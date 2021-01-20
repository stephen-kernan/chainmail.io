const axios = require('axios')
const { requestInterceptor, responseInterceptor } = require('../utils/returnCallSpeed')

exports.synchronousChain = async (chain, baseUrl, responseParams) => {

    let responseData = {}

    for (let i = 0; i < chain.length; i++) {
        let call = chain[i]
        let fullBodyRequested = responseParams.query_body || call.query_body || call === chain[-1]
        let speedRequested = responseParams.query_speed || call.query_speed        
        let callResponse = {}

        if (speedRequested) {
            requestInterceptor();
            responseInterceptor();
        }

        if (fullBodyRequested || speedRequested) {
            responseData[call.name ? call.name : i + 1] = callResponse
        }

        await axios({
            method: call.method,
            data: call.data,
            url: baseUrl + call.url
        }).then(res => {
            if (fullBodyRequested) {
                callResponse.body = res.data
            } 
            
            if (speedRequested) {
                callResponse.speed = res.duration
            }

            callResponse.name = call.name ? call.name : i + 1
        })
    }
    return new Promise(resolve => {
        if (responseParams) {
            resolve(responseData)        
        }
    }) 
}