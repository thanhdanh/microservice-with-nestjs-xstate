import { assign, Machine } from "xstate";
import { fetchListUsers, addNewUser, login, getOrders } from '../services';

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

export const appMachine = Machine({
  id: "app",
  initial: "ready",
  context: {
    userNameInput: null,
    users: [],
    userSelected: null,
    authorized: false,
    accessToken: null,
    orders: [],
    orderSelected: null,
    errorMessage: null,
    successMessage: null,
  },
  states: {
    ready: {
      on: {
        FETCH_USERS: 'fetching_users',
        FETCH_ODERS: {
          cond: 'isAuthorized',
          target: 'fetching_orders',
        },
        SELECT_USER: {
          actions: assign({
            userSelected: (_, event) => event.value
          }),
          target: 'authorizing'
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
    fetching_users: {
      invoke: {
        src: "fetchListUsers",
        onDone: {
          target: "ready",
          actions: assign({
            users: (_, event) => event.data,
            successMessage: 'Load users list successful'
          })
        },
        onError: {
          target: 'fetch_users_fail',
          actions: assign({
            errorMessage: 'Load users failed'
          })
        }
      },
    },
    fetch_users_fail: {
      on: {
        RETRY: "fetching_users"
      }
    },
    add_user: {
      invoke: {
        id: 'add_new_user',
        src: newUserMachine,
        data: {
          userName: (context, _) => context.userNameInput
        },
        onDone: {
          target: 'fetching_users',
          actions: assign({
            userNameInput: null,
            successMessage: 'Add new user successful'
          })
        },
      }
    },
    authorizing: {
      invoke: {
        src: 'login',
        onDone: {
          target: 'fetching_orders',
          actions: assign({
            authorized: true,
            accessToken: (_, event) => event.data?.access_token
          }),
        },
        onError: 'ready'
      }
    },
    fetching_orders: {
      invoke: {
        src: 'fetchOrders',
        onDone: {
          target: 'ready',
          actions: [
            assign({
              orders: (_, event) => event.data,
              successMessage: 'Load orders list successful'
            }),
          ]
        },
        onError: 'ready'
      }
    }
  },
}, {
  guards: {
    isAuthorized: (context) => !!context.authorized,
    notUsernameInputEmpty: (context) => !!context.userNameInput,
  },
  services: {
    fetchListUsers: () => fetchListUsers,
    login: (context) => login(context.userSelected),
    fetchOrders: (context) => getOrders(context.accessToken),
  }
})

