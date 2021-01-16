
const apiDomain = process.env.REACT_APP_API_HOST;

async function postData(url = '', data = {}, headers = {}) {
    // Default options are marked with *
    return fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            'Accept' : 'application/json',
            ...headers,
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
}

export async function fetchListUsers() {
    const url = apiDomain + '/users';
    return fetch(url, { cache: 'no-cache',  mode: 'cors', }).then(response => response.json())
}

export async function addNewUser(data) {
    const url = apiDomain + '/users';
    return postData(url, data).then(response => response.json())
}

export async function login(name ='') {
    const url = apiDomain + '/auth/login';
    return postData(url, { username: name }).then(response => response.json())
}

export async function getOrders(accessToken = '') {
    const url = apiDomain + '/orders';
    const headers = {
        'Content-Type': 'application/json',
        'Accept' : 'application/json',
        'Authorization' : `Bearer ${accessToken}`
    }
    return fetch(url, {
        method: 'GET',
        headers,
    }).then(response => response.json())
}

export async function addNewOrder(accessToken = '', data = {}) {
    const url = apiDomain + '/orders';
    const headers = {
        'Content-Type': 'application/json',
        'Accept' : 'application/json',
        'Authorization' : `Bearer ${accessToken}`
    }
    return postData(url, data, headers).then(response => response.json())
}

export async function getStatistic(accessToken = '') {
    const url = apiDomain + '/orders/statistic';
    const headers = {
        'Content-Type': 'application/json',
        'Accept' : 'application/json',
        'Authorization' : `Bearer ${accessToken}`
    }
    return fetch(url, {
        method: 'GET',
        headers,
    }).then(response => response.json())
}

export async function cancelOrder(orderId, accessToken) {
    const url = apiDomain + '/orders/' + orderId + '/cancel';
    
    const headers = {
        'Content-Type': 'application/json',
        'Accept' : 'application/json',
        'Authorization' : `Bearer ${accessToken}`
    }
    
    return fetch(url, {
        method: 'GET',
        headers,
    }).then(response => response.json())
}