import { Machine, send, spawn } from "xstate";
import { fetchListUsers, addNewUser, login, getOrders, addNewOrder, getStatistic } from '../services';
import { assign } from '@xstate/immer';
import { respond, sendParent } from "xstate/lib/actions";

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
          actions: assign((ctx, event) => {
            ctx.data = event.data
          }),
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

const createUserMachine = (name) => Machine({
  id: 'user',
  initial: 'authorizing',
  context: {
    name,
    authorized: false,
    statistic: {},
    orders: [],
  },
  states: {
    authorizing: {
      invoke: {
        id: 'login',
        src: 'login',
        onDone: {
          target: 'fetch_orders',
          actions: [
            assign((ctx, event) => {
              ctx.authorized = true;
              ctx.accessToken = event.data?.access_token
            }),
            sendParent('AUTHORIZED')
          ],
        },
        onError: 'exit',
      },
    },
    fetch_orders: {
      invoke: {
        src: 'fetchOrders',
        onDone: {
          actions: [
            assign((ctx, event) => {
              ctx.orders = event.data;
              ctx.successMessage = 'Load orders list successful'
            }),
          ],
          target: 'get_statistic'
        },
        onError: [
          {
            cond: 'isUnauthorizedStatus',
            target: 'authorizing',
          },
        ]
      },
    },
    get_statistic: {
      invoke: {
        src: 'getStatistic',
        onDone: {
          actions: [
            assign((ctx, event) => {
              ctx.statistic = event.data;
            }),
          ],
          target: 'authorized'
        },
        onError: [
          {
            cond: 'isUnauthorizedStatus',
            target: 'authorizing',
          },
          {
            target: 'authorized'
          }
        ]
      },
    },
    add_order: {
      on: {
        CANCEL: "authorized"
      },
      invoke: {
        src: 'addNewOrder',
        onDone: {
          target: 'fetch_orders'
        },
        onError: [
          {
            cond: 'isUnauthorizedStatus',
            target: 'authorizing',
          },
          {
            target: 'authorized'
          }
        ]
      }
    },
    authorized: {      
    },
    exit: {
      type: 'final'
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
    AUTHORIZE: {
      target: 'authorizing',
      actions: assign((ctx, event) => { ctx.name = event.name })
    }
  }
}, {
  guards: {
    isUnauthorizedStatus: (context, evt) => evt.status === 401,
    isNotFoundStatus: (context, evt) => evt.status === 404,
    isAuthorized: (context) => !!context.authorized,
  },
  services: {
    login: (context) => login(context.name),
    getStatistic: (context, event) => getStatistic(context.accessToken),
    fetchOrders: (context) => getOrders(context.accessToken),
  }
})

export const appMachine = Machine({
  id: "app",
  initial: "idle",
  context: {
    userNameInput: null,
    users: [],
    userSelected: null,
    userSelectedName: null,
    errorMessage: null,
    successMessage: null,
  },
  states: {
    idle: {
      invoke: {
        src: usersMachine,
        onDone: {
          actions: assign((ctx, event) => {
            ctx.users = event.data.data;
            ctx.successMessage = 'Load users list successful';
          })
        }
      },
      on: {
        SELECT_USER: {
          // actions: assign((ctx, event) => {
          //   ctx.userSelected = event.value;
          // }),
          target: 'selected',
          actions: assign((ctx, event) => {
            ctx.userSelectedName = event.value;
            ctx.userSelected = spawn(createUserMachine(event.value))
          })
        },
        INPUT_USER_NAME: {
          actions: assign((ctx, event) => {
            ctx.userNameInput = event.value;
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
    selected: {
      on: {
        AUTHORIZED: 'authorized'
      }
      // invoke: {
      //   id: 'user',
      //   src: userMachine,
      //   data: {
      //     name: (ctx) => ctx.userSelected
      //   },
      //   onDone: {
      //     actions: assign((ctx) => { ctx.userSelected = null }),
      //     target: 'idle'
      //   }
      // },
    },
    authorized: {}
  },
}, {
  guards: {
    notUsernameInputEmpty: (context) => !!context.userNameInput,
    // isDuplicateData: (context, evt) => evt.data.code === 1,
  },
  services: {
    addNewOrder: (context, event) => addNewOrder(context.accessToken, event.data),
  },
})

