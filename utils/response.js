class Util { ;

success(payload, message) {
    let resultObj = payload
    try {
        resultObj = resultObj.toObject()
    } catch (err) {
        resultObj = payload
    }
    return { status: true, message: message, ...resultObj }
}
error(payload, message) {
    return { status: false, message: message, result: payload }
}
}
module.exports = new Util();