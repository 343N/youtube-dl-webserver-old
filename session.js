let UID = require("./uid.js")
// console.log(UID)

class Session {
    /**
     * 
     * @param {string} [ID] - Unique Session ID 
     * @param {Date} [timestamp] - Time of session creation 
     */
    constructor(ID, timestamp){
        if (ID) this.id = ID
        if (timestamp) this.timestamp = timestamp

        if (!ID) this.id = UID.getNewID(10)
        if (!timestamp) this.timestamp = Date.now()
    }

    // get id() { return this.id }
    // set id(x) { this.id = x }

    // get timestamp() { return this.timestamp }
    // set timestamp(x) { this.timestamp = x }
}

module.exports = Session

