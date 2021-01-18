module.exports = (method, params = []) => {
    return {
        url: process.env.URL,
        method: "POST",
        body: JSON.stringify({
        jsonrpc: "1.0",
        id: "curltest",
        method: method,
        params: params
        })
    }
}