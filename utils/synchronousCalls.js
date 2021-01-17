const axios = require('axios')

exports.synchronousChain = async (chain, baseUrl) => {
    let responseData = []
    for (let i = 0; i < chain.length; i++) {
        let call = chain[i]
        await axios({
            method: call.method,
            data: call.data,
            url: baseUrl + call.url
        }).then(() => {
            let body = {
                name: call.as ? call.as : i + 1,
                num: call.data.num,
            }
            responseData.push(body)
        })
    }
    return new Promise(resolve => {
        resolve(responseData)        
    }) 
}