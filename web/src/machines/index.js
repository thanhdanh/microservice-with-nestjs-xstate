import { assign, Machine, send, spawn } from "xstate";
import { fetchListUsers, addNewUser, login, getOrders, addNewOrder, getStatistic } from '../services';


const usersMachine = Machine({
  id: 'users',
  initial: 'loading',
  context: {
    data: []
  },
  states: {
    loading: {
      invoke: {
        src: 'fetchUsers',
        onDone: {
          data: (_, event) => event.data,
          target: 'success'
        },
        onError: 'failed'
      },
    },
    failed: {
      on: {
        RETRY: "loading"
      }
    },
    success: {
      type: 'final',
      data: {
        data: (context) => context.data
      }
    }
  }
}, {
  services: {
    fetchUsers: () => fetchListUsers,
    fetchOrders: (context) => getOrders(context.accessToken),
  }
})

const newUserMachine = Machine({
  id: 'add_new_user',
  initial: 'processing',
  context: {
    userName: '',
  },
  states: {
    processing: {
      invoke: {
        src: 'addNewUser',
        onDone: 'success',
        onError: 'failed'
      },
    },
    failed: {
      on: {
        RETRY: "processing"
      }
    },
    success: {
      type: 'final'
    }
  }
}, {
  services: {
    addNewUser: (c) => addNewUser({ name: c.userName }),
  }
})

const createUserMachine = ({ name }) => Machine({
  id: 'user',
  initial: 'no_auth',
  context: {
    name,
    authorized: false,
    statistic: {},
    orders: [],
  },
  states: {
    no_auth: {
      invoke: {
        src: 'login',
        onDone: {
          target: 'authorized',
          actions: [
            assign({
              authorized: true,
              accessToken: (_, event) => event.data?.access_token
            }),
          ],
        },
        onError: [
          {
            cond: 'isNotFoundStatus',
            target: '#app.idle',
          }
        ]
      },
    },
    fetch_orders: {
      invoke: {
        src: 'fetchOrders',
        onDone: {
          actions: [
            assign({
              orders: (_, event) => event.data,
              successMessage: 'Load orders list successful'
            }),
          ]
        },
        onError: [
          {
            cond: 'isUnauthorizedStatus',
            target: 'no_auth',
          },
        ]
      },
    },
    get_statistic: {
      invoke: {
        src: 'getStatistic',
        onDone: {
          actions: [
            assign({
              statistic: (_, event) => ({ ...event.data }),
            }),
          ]
        },
        onError: [
          {
            cond: 'isUnauthorizedStatus',
            target: 'no_auth',
          },
        ]
      },
    },
    add_order: {
      on: {
        CANCEL: "authorized"
      },
      invoke: {
        src: 'addNewOrder',
        onDone: 'ready',
        onError: [
          {
            cond: 'isUnauthorizedStatus',
            target: 'no_auth',
          },
          {
            target: 'ready'
          }
        ]
      }
    },
    authorized: {      
    }
  },
  on: {
    FETCH_ORDERS: {
      cond: 'isAuthorized',
      target: 'fetch_orders',
    },
    GET_STATISTIC: {
      cond: 'isAuthorized',
      target: 'get_statistic',
    },
    ADD_ORDER: {
      cond: 'isAuthorized',
      target: 'add_order'
    },
  }
}, {
  guards: {
    isUnauthorizedStatus: (context, evt) => evt.status === 401,
    isNotFoundStatus: (context, evt) => evt.status === 404,
    isAuthorized: (context) => !!context.authorized,
  },
  services: {
    login: (context) => login(context.name),
  }
})

export const appMachine = Machine({
  id: "app",
  initial: "idle",
  context: {
    userNameInput: null,
    users: [],
    userSelected: null,
    errorMessage: null,
    successMessage: null,
  },
  states: {
    idle: {
      invoke: {
        src: usersMachine,
        onDone: {
          actions: assign({
            users: (_, event) => event.data.data,
            successMessage: 'Load users list successful'
          })
        }
      },
      on: {
        SELECT_USER: {
          actions: [
            assign({
              userSelected: (_, event) => spawn(createUserMachine(event.value))
            }),
            "persist"
          ],
          target: 'selected'
        },
        INPUT_USER_NAME: {
          actions: assign({
            userNameInput: (_, event) => event.value
          }),
        },
        ADD_USER: {
          cond: 'notUsernameInputEmpty',
          target: 'add_user'
        },
      }
    },
    add_user: {
      invoke: {
        src: newUserMachine,
        data: {
          userName: (context, _) => context.userNameInput
        },
        onDone: {
          target: 'idle',
          actions: assign({
            userNameInput: null,
            successMessage: 'Add new user successful'
          })
        },
      }
    },
    selected: {},
  },
}, {
  guards: {
    notUsernameInputEmpty: (context) => !!context.userNameInput,
    isDuplicateData: (context, evt) => evt.data.code === 1,
  },
  services: {
    addNewOrder: (context, event) => addNewOrder(context.accessToken, event.data),
    getStatistic: (context, event) => getStatistic(context.accessToken),
  },
})

