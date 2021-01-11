import { assign, Machine, send, sendParent, spawn } from "xstate";
import { fetchListUsers, addNewUser } from '../services';
import createUserMachine from "./userMachine";

export const rootMachine = Machine({
  id: "users",
  initial: "idle",
  context: {
    userName: null,
    users: [],
    userSelected: undefined,
    errorMessage: undefined,
    successMessage: undefined
  },
  states: {
    idle: {
      invoke: {
        id: "fetch_users",
        src: "getListUsers",
        onDone: {
          target: "loaded",
          actions: assign({
            users: (_, event) => event.data,
            successMessage: 'Load users list successful'
          })
        },
        onError: {
          target: 'loading_fail',
          actions: assign({
            errorMessage: 'Load users list failed'
          })
        }
      },
    },
    loaded: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            SELECT_USER: {
              actions: assign({ userSelected: (c, e) => spawn(createUserMachine({ name: e.value }))}),
              target: '#users.selected'
            },
            ADD_USER: '#users.add_new_user'
          }
        },
        
      },
      on: {
        INPUT_USER_NAME: {
          actions: assign({
            userName: (_, event) => event.value
          })
        },
      }
    },
    loading_fail: {
      on: {
        RETRY: "idle"
      }
    },
    add_new_user: {
      invoke: {
        id: "add_user",
        src: "addNewUser",
        onDone: {
          target: '#users.idle',
          actions: [
            assign({
              userName: null,
              successMessage: 'Add new user successful'
            }),
          ]
        },
      }
    },
    selected: {}
  },
}, {
  services: {
    getListUsers: () => fetchListUsers,
    addNewUser: (context) => addNewUser({ name: context.userName }),
  }
})

