import { assign, Machine, send, sendParent, spawn } from "xstate";
import { fetchListUsers, addNewUser, globalSubject } from '../services';
import { login } from "../services";
import createUserMachine from "./userMachine";

export const rootMachine = Machine({
  id: "root-machine",
  initial: "idle",
  context: {
    userName: null,
    users: [],
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
        },
        addingUser: {
          invoke: {
            id: "add_user",
            src: "addNewUser",
            onDone: {
              target: "loading_users",
              actions: assign({
                userName: null
              })
            },
          }
        },
      },
      on: {
        ADD_USER: {
          target: 'addingUser'
        }
      }
    },
    selected: {}
  },
  on: {
    INPUT_USER_NAME: {
      actions: assign({
        userName: (_, event) => event.value
      })
    },
    SELECT_USER: {
      // actions: assign({
      //   userSelected: (_, event) => createUserMachine({ name: event.value })
      // }),
      actions: assign((_, event) => send({ type: 'SET_USERNAME', event }, { to: 'user' })),
      target: '.selected'
    },
  }
}, {
  services: {
    getListUsers: () => fetchListUsers,
    addNewUser: (context) => addNewUser({ name: context.userName }),
    login: (context) => login(context.userSelected.context.name),
  }
})

