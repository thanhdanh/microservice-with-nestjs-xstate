import { Machine, sendUpdate, actions, spawn } from "xstate";
import { assign } from "@xstate/immer";
import { addNewOrder, fetchListUsers, getOrders, getStatistic, login, cancelOrder } from "../shared/services";

const createUserMachine = ({ name }) => Machine(
  {
    id: 'user',
    initial: 'authorizing',
    context: {
      accessToken: null,
      name,
      orders: [],
      statistics: {},
    },
    states: {
      authorizing: {
        invoke: {
          id: 'authorizing',
          src: 'login',
          onDone: {
            actions: [
              sendUpdate(),
              assign((ctx, event) => { ctx.accessToken = event.data.access_token })
            ],
            target: 'authorized'
          },
          onError: {
            target: 'failure'
          },
        }
      },
      authorized: {
        // type: "final"
        initial: 'fetch_orders',
        on: {
          FETCH_ORDERS: {
            cond: 'isAuthorized',
            target: '.fetch_orders',
          },
          GET_STATISTIC: {
            cond: 'isAuthorized',
            target: '.get_statistic',
          },
          ADD_ORDER: {
            cond: 'isAuthorized',
            target: '.add_order'
          },
          CANCEL_ORDER: {
            cond: 'isAuthorized',
            target: '.cancel_order',
          },
        },
        states: {
          add_order: {
            invoke: {
              src: 'addNewOrder',
              onDone: {
                target: 'fetch_orders'
              },
            }
          },
          fetch_orders: {
            invoke: {
              src: 'fetchOrders',
              onDone: {
                actions: [
                  assign((ctx, event) => {
                    ctx.orders = event.data;
                  }),
                ],
                target: 'get_statistic'
              },
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
                ]
              },
            }
          },
          cancel_order: {
            invoke: {
              src: 'cancelOrder',
              onDone: 'fetch_orders'
            }
          }
        }
      },
      failure: {
        on: {
          RETRY: "authorizing"
        }
      }
    },
    
  },
  { 
    guards: {
      isAuthorized: (ctx) => !!ctx.accessToken,
    },
    services: {
      login: (ctx) => login(ctx.name),
      fetchOrders: (context) => getOrders(context.accessToken),
      addNewOrder: (context, event) => {
        return addNewOrder(context.accessToken, event.values)
      },
      getStatistic: (context, event) => getStatistic(context.accessToken),
      cancelOrder: (context, event) => cancelOrder(event.id, context.accessToken),
    }
  }
)

const fetchUsersState = {
  initial: "loading",
  states: {
    loading: {
      invoke: {
        id: "fetch-users",
        src: "fetchListUsers",
        onDone: {
          target: "loaded",
          actions: assign((ctx, event) => {
            ctx.listUsers = event.data;
          })
        },
        onError: {
          target: "failure"
        }
      }
    },
    loaded: {
      type: "final"
    },
    failure: {
      on: {
        RETRY: "loading"
      }
    }
  }
};

export const appMachine = Machine(
  {
    id: 'app_machine',
    initial: 'ready',
    context: {
      listUsers: [],
      userChosen: null,
    },
    states: {
      ready: {
        ...fetchUsersState
        
      },
      selected: {},
    },
    on: {
      SELECT_USER: {
        target: "selected",
        actions: [
          (_, event) => console.log('Selecting', event),
          assign((ctx, event) => { 
            ctx.userChosen = spawn(createUserMachine({ name: event.value }), { autoForward: true });
          })
        ]
      }
    }
  },
  {
    guards: {
      isAuthorized: (ctx) => !!ctx.userChosen,
      // isNotEmpty: (ctx, event) => !!event.value,
    },
    actions: {
      resetUser: (ctx) => ctx.userChosen = null,
    },
    services: {
      fetchListUsers,
    }
  }
)