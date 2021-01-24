const axios = require('axios');

exports.requestInterceptor = () => {
    axios.interceptors.request.use( (config) => {
        config.metadata = { startTime: new Date() }
        return config
    }, (err) => {
        console.log(err)
        return err
    })    


}

exports.responseInterceptor = () => {
    axios.interceptors.response.use( (res) => {
        res.config.metadata.endTime = new Date()
        res.duration = res.config.metadata.endTime - res.config.metadata.startTime
        return res
    }, (err) => {
        console.log(err)
        return err
    })    
}