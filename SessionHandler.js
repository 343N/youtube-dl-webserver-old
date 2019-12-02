class SessionHandler {

    constructor(timeout){
        this.timeout = timeout || 120
        this.sessionDict = {}
    }

    isValidSession(s){
        let sess = this.getSession(s)
        if (!this.sessionDict[sess.id]) return false

        if (this.hasSessionExpired(s)) return false

        return true
    }

    getSession(s){
        if (s instanceof Session)
            return s;
        else return this.sessionDict[s]
    }

    addSession(session, timestamp){
        if (session instanceof Session)
            this.sessionDict[session.id] = session;
        else {
            let s = new Session(session, timestamp)
            this.sessionDict[s.id] = s
        }
    }

    hasSessionExpired(s){
        let sess = (s instanceof Session) ? s : this.getSession(s)

        if (sess.timestamp + this.timeout < Date.now())
            return true

        return false
    }

    getSessionID(identifier){
        if (identifier instanceof Session)
            return identifier.id
        
        switch(typeof identifier){
            case "string":
                if (this.sessionDict[identifier])
                    return identifier
                else 
                    console.log(`Cannot get sessionID. Session not valid.`)
                break;
            case "number":
                for (let sess of this.sessionDict)
                    if (sess.timestamp == identifier)
                        return sess.id
        }

        return null;
    }

    getTimeoutHrs(){        return this.timeout / 60 }
    getTimeoutSeconds(){    return this.timeout * 60 }
    getTimeoutDays(){       return this.getTimeoutHrs() / 24 }
    getTimeoutMillis() {    return this.getTimeoutSeconds() * 1000}
}

module.exports = SessionHandler;