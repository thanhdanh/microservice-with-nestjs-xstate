import { assign, Machine, sendParent, spawn } from "xstate";
import { fetchListUsers, addNewUser, globalSubject } from '../services';
import { login } from "../services";
import createUserMachine from "./userMachine";

export const rootMachine = Machine({
  id: "root-machine",
  initial: "idle",
  context: {
    userName: null,
    users: [],
    authorized: false,
    userSelected: spawn(createUserMachine()),
  },
  states: {
    idle: {
      initial: "loading_users",
      states: {
        loading_users: {
          invoke: {
            id: "fetch_users",
            src: "getListUsers",
            onDone: {
              target: "loaded_users",
              actions: assign({
                users: (_, event) => event.data
              })
            }
          },
        },
        loaded_users: {
          type: "final",
          on: {
            LOGIN: {
              actions: sendParent('authenticating')
            }
          }
        },
        failure: {
          on: {
            RETRY: "loading_users"
          }
        }
      }
    },
    addingUser: {
      invoke: {
        id: "add_user",
        src: "addNewUser",
        onDone: {
          target: "idle",
          actions: assign({
            userName: null
          })
        },
      }
    },
    authenticating: {
      invoke: {
        id: 'get_accesstoken',
        src: 'login',
        onDone: {
            // target: 'user.authenticated',
            actions: [assign({
                accessToken: (_, event) => event.data.access_token,
                authorized: true,
            }),
          ],
        },
        onError: {
          target: 'authenticating'
        }
      }
    },
  },
  on: {
    INPUT_USER_NAME: {
      actions: assign({
        userName: (_, event) => event.value
      })
    },
    ADD_USER: {
      target: 'addingUser',
    },
    SELECT_USER: {
      // actions: assign({
      //   userSelected: (_, event) => createUserMachine({ name: event.value })
      // }),
      target: 'user.authenticating'
    },
  }
}, {
  services: {
    getListUsers: () => fetchListUsers,
    addNewUser: (context) => addNewUser({ name: context.userName }),
    login: (context) => login(context.userSelected.context.name),
  }
})

