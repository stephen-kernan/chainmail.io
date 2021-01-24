const axios = require('axios')
const { requestInterceptor, responseInterceptor } = require('./returnCallSpeed')

exports.synchronousChain = async (chain, base_url, responseParams) => {

    let responseData = {}

    let exports = {}

    for (let i = 0; i < chain.length; i++) {
        let call = chain[i]
        let fullBodyRequested = responseParams.query_body || call.query_body || i === ( chain.length - 1 )
        let speedRequested = responseParams.query_speed || call.query_speed        
        let callResponse = {}
        let headers = call.headers ? call.headers : {}

        if (speedRequested) {
            requestInterceptor();
            responseInterceptor();
        }

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
            } else if (typeof call[key] === 'object') {
                for (item in call[key]) {
                    let object = call[key]
                    if (typeof object[item] === 'string') {
                        if (object[item].includes('exports')) {
                            let string = object[item].split('.')
                            let exportKey = string[1]
                            if (!exports[exportKey]) {
                                throw new Error(`the export requested by ${call.name ? "'" + call.name + "'" : `the ${i + 1} call`} is not available. make sure the export refers to a request made before this one.`)
                            }                        
                            let exportValue = string[2] ? exports[exportKey][string[2]] : exports[exportKey];
                            call[key][item] = exportValue 
                        }
                    }
                }
            }
        }

        await axios({
            headers: headers,
            method: call.method,
            data: call.body,
            url: base_url + call.url
        }).then(res => {
            if (fullBodyRequested) {
                callResponse.body = res.data
            } 
            
            if (speedRequested) {
                callResponse.speed = res.duration
            }

            callResponse.name = call.name ? call.name : i + 1
            exports[callResponse.name] = res.data

            if (fullBodyRequested || speedRequested) {
                responseData[call.name ? call.name : i + 1] = callResponse
                responseData[call.name ? call.name : i + 1].name = call.name ? call.name : i + 1
            }


        })
    }

    return new Promise(resolve => {
        if (responseParams) {
            resolve(responseData)        
        }
    }) 
}