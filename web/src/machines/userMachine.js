import { assign, Machine } from "xstate";
import { getOrders, login } from "../services";

const createUserMachine = ({ name }) => Machine({
    id: 'user',
    initial: 'authenticating',
    context: {
        name,
        authorized: false,
        orders: [],
    },
    states: {
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
        
    }
}, {
    services: {
        getOrders: (context) => getOrders(context.accessToken),
        login: (context) => login(context.name),
    }
})

export default createUserMachine;