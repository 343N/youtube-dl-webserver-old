let uid = require("./uniqueId.js")

class Session {
    
    constructor(ID, timestamp, token){
        this.id = ID
        this.timestamp = timestamp
        this.token = token || 10

        if (!ID) this.id = uid.generateID(token)
        if (!timestamp) this.timestamp = Date.now()
    }

    setData(data){
        this.sessionData = data;
    }
}

module.exports = Session