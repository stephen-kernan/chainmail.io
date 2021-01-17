const axios = require('axios')

exports.synchronousChain = async (chain) => {
    let responseData = []
    for (let i = 0; i < chain.length; i++) {
        let call = chain[i]
        await axios({
            method: call.method,
            data: call.data,
            url: call.url
        }).then(response => {
            responseData.push(response.data)
        })
    }
    return responseData
}