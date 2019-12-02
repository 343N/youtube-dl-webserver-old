let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

function generateID(length){
    if (!length) throw 'No length specified!'
    let ID = ""
    for (let i = 0; i < length; i++){
        ID += getRandomChar()
    }
    return ID
}

function getRandomChar(){
    return chars.charAt(Math.floor(Math.random() * chars.length))
}

module.exports = { generateID }