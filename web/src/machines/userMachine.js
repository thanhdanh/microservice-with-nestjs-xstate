import { assign, Machine } from "xstate";
import { getOrders } from "../services";

const createUserMachine = () => Machine({
    id: 'user',
    initial: 'noauth',
    context: {
        name: null,
        authorized: false,
        orders: [],
    },
    states: {
        noauth: {},
        authenticating: {
            invoke: {
                id: 'get_accesstoken',
                src: 'login',
                onDone: {
                    target: 'authenticated',
                    actions: assign({
                        accessToken: (_, event) => event.data.access_token,
                        authorized: true,
                    }),
                },
                onError: {
                    target: 'authenticating'
                }
            }
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
    },
    on: {
        SET_USERNAME: {
            actions: assign({
                name: (_, event) => event.value 
            })
        }
    }
}, {
    services: {
        getOrders: (context) => getOrders(context.accessToken),
    }
})

export default createUserMachine;