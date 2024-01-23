const axios = require('axios');
const urlJoin = require('url-join');
const debug = require('debug')('reviews:users');

const USERS_SERVICE = process.env.USERS_SERVICE || 'http://localhost:4003';
const API_VERSION = '/api/v1/orders';

const updateOrdersAddress = async function(accessToken, userId, newAddress) {

    try {
        const urlPut = urlJoin(USERS_SERVICE, API_VERSION, '/user/', userId.toString(), '/deliveryAddress');
        const headers = {
            Authorization: accessToken
          };
          const config = {
            headers: headers,
          };

        await axios.put(urlPut, {deliveryAddress : newAddress}, config);
        return true;
    } catch (e) {
        console.error(e);
        return null;
    }
}

module.exports = {
    updateOrdersAddress
}