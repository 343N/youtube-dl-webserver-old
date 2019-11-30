const Session = require("./session.js")


class SessionHandler{
    constructor(arg, test){
        this.sessionDict = {}
        if (typeof test === "function")
            this.testValidity = test;
        if (typeof test === "number")
            this.sessionLength = test;
        else this.sessionLength = 120
            
        

        if (arg instanceof Session) 
            this.sessionDict[arg.id] = arg;

        if (arg instanceof Array)
            for (let sess of arg)
                if (sess instanceof Session)
                    this.sessionDict[sess.id] = sess
            
    }

    isValidSession(arg){
        if (arg instanceof Session && this.sessionDict[arg.id])
            return sessionTest(arg)
        if (typeof arg === "string" && this.sessionDict[arg])
            return sessionTest(this.essionDict[arg])
        
        return false
    }

    testValidity(session){
        let min = this.sessionLength || 120
        if (session instanceof Session && this.sessionDict[session.id] )
            return (session.timestamp < Date.now() + (min * 60 * 1000))
        if (typeof session === "string" && this.sessionDict[session.id])
            return (this.sessionDict[session].timestamp < Date.now() + (min * 60 * 1000))
        
        return false
    }

    newSession(id, timestamp){
        let s = new Session(id, timestamp)

        this.sessionDict[s.id] = s;

        return s;
    }

}

module.exports = SessionHandler