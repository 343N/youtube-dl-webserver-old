const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
function getNewID(num){
    let ID = ""
    for (let n = 0; n < num; n++){
        ID += getRandChar()
    }

    return ID;
}

function getRandChar(){
    return chars.charAt(Math.floor(chars.length * Math.random()))
}

module.exports = {getNewID, getRandChar}