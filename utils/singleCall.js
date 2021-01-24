const axios = require('axios')
const { requestInterceptor, responseInterceptor } = require('./returnCallSpeed')

exports.singleCall = async (call, base_url, responseParams) => {
    let speedRequested = responseParams.query_speed || call.query_speed
    
    let callResponse = {}

    if (speedRequested) {
        requestInterceptor();
        responseInterceptor();
    }

    await axios({
        method: call.method,
        data: call.data,
        url: base_url + call.url
    }).then(res => {
        callResponse.body = res.data
        
        if (speedRequested) {
            callResponse.speed = res.duration
        }

        callResponse.name = call.name ? call.name : null
    })

    return new Promise(resolve => {
        if (responseParams) {
            resolve(callResponse)        
        }
    }) 
}