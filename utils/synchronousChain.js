const axios = require('axios')
const { requestInterceptor, responseInterceptor } = require('./returnCallSpeed')

exports.synchronousChain = async (chain, baseUrl, responseParams) => {

    let responseData = {}

    let exports = {}

    for (let i = 0; i < chain.length; i++) {
        let call = chain[i]
        let fullBodyRequested = responseParams.query_body || call.query_body || call === chain[-1]
        let speedRequested = responseParams.query_speed || call.query_speed        
        let callResponse = {}

        if (call.export) {
            exports[call.name]
        }

        if (speedRequested) {
            requestInterceptor();
            responseInterceptor();
        }

        if (fullBodyRequested || speedRequested) {
            responseData[call.name ? call.name : i + 1] = callResponse
        }

        if (call.foreign_key) {
            for (key in call) {
                if (typeof call[key] === 'string') {
                    if (call[key].includes('exports')) {
                        let string = call[key].split('.')
                        let exportKey = string[1]
                        if (!exports[exportKey]) {
                            throw new Error(`the export requested by ${call.name ? "'" + call.name + "'" : `the ${i + 1} call`} is not available. make sure the export refers to a request made before this one.`)
                        }                        
                        let exportValue = string[2] ? exports[exportKey][string[2]] : exports[exportKey];
                        call[key] = exportValue                       
                    }
                }
            }

            console.log(call)
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
            exports[callResponse.name] = res.data
        })
    }
    return new Promise(resolve => {
        if (responseParams) {
            resolve(responseData)        
        }
    }) 
}