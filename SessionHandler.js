const SessionFileHandler = require("./SessionFileHandler.js")
const Session = require("./Session.js")
class SessionHandler {

    constructor(timeout, sessPath, tokenLength){
        this.timeout = timeout
        this.FileHandler = 
            new SessionFileHandler(this, convertURLtoPath(sessPath))
        this.tokenLength = tokenLength || 20
        if (!sessPath) 
            throw "A session path must be specified for the file handler."
        if (!tokenLength) 
            console.log("Token length not specified! Defaulting to " + this.tokenLength)
        if (!timeout) 
            console.log("NO SESSION TIMEOUT SPECIFIED! Sessions will last forever.")
        this.sessionDict = {}
    }

    isValidSession(s){
        // console.log(`SessionHandler.isValidSession`)
        let sess = this.getSession(s)
        if (!sess || !this.sessionDict[sess.id]) return false
        
        // console.log(`   session is valid and exists`)
        
        if (this.hasSessionExpired(s)) return false

        return true
    }

    getSession(s){
        if (s instanceof Session)
            return s;
        else return this.sessionDict[s]
    }


    addSession(session, timestamp){
        // console.log(`addSession - existing sessions:`)
        // console.log(this.sessionDict)
        if (session instanceof Session){
            this.sessionDict[session.id] = session;
            return this.sessionDict[session.id]
        } else {
            let s = new Session(session, timestamp, this.tokenLength)
            this.sessionDict[s.id] = s
            return s
        }
    }

    createNewSession(session, timestamp){
        return this.addSession(session, timestamp)
    }

    hasSessionExpired(s){
        // console.log(`SessionHandler.hasSessionExpired`)
        // console.log(`   ${(s instanceof Session) ? this.getSession(s).id : s}`)
        let sess = (s instanceof Session) ? s : this.getSession(s)

        if (sess.timestamp + hrsToMillis(this.timeout) < Date.now())
            return true

        return false
    }

    setSessionData(session, data){
        this.sessionData = d
    }

    getSessionData(session){
        if (!session) return null
        return this.sessionData
    }

    writeSessionData(session){
        this.FileHandler.writeSessionData(session)
    }

    getSessionID(identifier){
        if (identifier instanceof Session)
            return identifier.id
        
        switch(typeof identifier){
            case "string":
                if (this.sessionDict[identifier])
                    return identifier
                else 
                    // console.log(`Cannot get sessionID. Session not valid.`)
                break;
            case "number":
                for (let sess of this.sessionDict)
                    if (sess.timestamp == identifier)
                        return sess.id
        }

        return null;
    }

    getFileHandler(){
        return this.FileHandler
    }

    getTimeoutHrs()         { return this.timeout }
    getTimeoutMins()        { return this.timeout * 60}
    getTimeoutDays()        { return this.timeout / 24 }
    getTimeoutSeconds()     { return this.getTimeoutMins() * 60 }
    getTimeoutMillis()      { return this.getTimeoutSeconds() * 1000}
}


function hrsToMillis(hrs){
    return hrs * 60 * 60 * 1000
}

function convertURLtoPath(URL){
    return (URL.charAt(0) === "/") ? URL.substr(1) : URL
}

function convertPathToURL(path){
    return (path.charAt(0) === "/") ? path : "/" + path
}

module.exports = SessionHandler;