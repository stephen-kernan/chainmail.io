const axios = require('axios')
const { requestInterceptor, responseInterceptor } = require('./returnCallSpeed')

exports.asyncChain = async (chain, baseUrl, responseParams) => {
    let responseData = {
        numCallsCompleted: 0
    }
    await Promise.all(chain.map( async (call, i) => {
        let fullBodyRequested = responseParams.query_body || call.query_body || call === chain[-1]
        let speedRequested = responseParams.query_speed || call.query_speed
        let callResponse = {}
        
        if (fullBodyRequested || speedRequested) {
            responseData[call.name ? call.name : i + 1] = callResponse
        }

        if (speedRequested) {
            requestInterceptor()
            responseInterceptor();
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

            responseData.numCallsCompleted += 1
        })
    }))        
    return new Promise (resolve => {
        resolve(responseData)
    });
}