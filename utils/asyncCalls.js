const axios = require('axios')

exports.asyncChain = async (chain) => {
    let responseData = []
    await Promise.all(chain.map( async (call) => {
        await axios({
            method: call.method,
            data: call.data,
            url: call.url
        }).then(response => {
            responseData.push(response.data)
        })
    }))
    return responseData;
}