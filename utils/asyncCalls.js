const axios = require('axios')

exports.asyncChain = async (chain, baseUrl) => {
    let responseData = []
    await Promise.all(chain.map( async (call) => {
        await axios({
            method: call.method,
            data: call.data,
            url: baseUrl + call.url
        }).then(response => {
            let body = {
                name: call.as ? call.as : call.method,
                num: call.data.num,
            }
            responseData.push(body)
        })
    }))        
    return new Promise (resolve => {
        resolve(responseData)
    });
}