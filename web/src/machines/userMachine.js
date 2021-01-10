import { assign, Machine } from "xstate";
import { getOrders } from "../services";

const createUserMachine = ({ name }) => Machine({
    id: 'user',
    initial: 'noauth',
    context: {
        orders: [],
        name,
    },
    states: {
        noauth: {
           
        },
        authenticated: {
            initial: 'loading_orders',
            context: {
                orders: [],
                orderSelected: null,
            },
            states: {
                loading_orders: {
                    invoke: {
                        id: "fetch-orders",
                        src: "getOrders",
                        onDone: {
                            target: "loaded",
                            actions: assign({
                                orders: (_, event) => event.data,
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
                        RETRY: "loading_orders"
                    }
                }
            }
        }
    }
}, {
    services: {
        getOrders: (context) => getOrders(context.accessToken),
    }
})

export default createUserMachine;