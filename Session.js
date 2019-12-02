let uid = require("./uniqueId.js")

class Session {
    
    constructor(ID, timestamp){
        this.id = ID
        this.timestamp = timestamp

        if (!ID) this.id = uid.generateID(10)
        if (!timestamp) this.timestamp = Date.now()
    }

    setData(data){
        this.sessionData = data;
    }
}

module.exports = Session