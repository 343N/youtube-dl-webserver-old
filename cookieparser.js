function getCookieTableFromString(str){
    // console.log(`getCookieTableFromString`)
    // console.log(`   ${str}`)
    if (!str) return null;
    let cookieStrs = str.split(';')
    let tbl = {}
    for (let cookie of cookieStrs){
        if (cookie.length == 0) continue;
        let kv = splitKeyValPair(cookie)
        tbl[kv.key] = kv.val
    }
    // console.log(tbl)
    return tbl;
}

function getStringFromCookieTable(tbl){
    let keys = Object.keys(tbl)
    let str = ""
    for (let key of keys){
        str += `${key}=${tbl[key]};`
    }
}

function updateCookieString(string, key, val){
    let tbl = getCookieTableFromString(string)
    tbl[key] = val

    return getStringFromCookieTable(tbl)
}

function getValFromString(string, key){
    // console.log(`getValFromString`)
    // console.log(`   ${string}`)
    let tbl = getCookieTableFromString(string)
    if (tbl && tbl[key]) return tbl[key]
}

function splitKeyValPair(kv){
    let spl = kv.split(`=`);
    // console.log(spl)
    return {key: spl[0], val: spl[1]}
}

module.exports = {
    getCookieTableFromString, 
    getStringFromCookieTable,
    updateCookieString,
    getValFromString
}