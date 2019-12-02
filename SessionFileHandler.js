const path = require("path")
const fs = require("fs")
const SessionHandler = require('./SessionHandler.js')

class SessionFileHandler {

    constructor(SH, rootfolder){
        if (SH instanceof SessionHandler) 
            this.SH = SH
        else throw `SessionFileHandler must be passed a valid ` + 
            `SessionHandler object in its constructor! (arg #1)`

        if (!rootfolder || typeof rootfolder  !== "string")
            throw `Root folder must be provided (arg #2)`

        this.dir = rootfolder
    }

    sessionHasFolder(s){
        s = this.SH.getSessionID(s)
        return fs.existsSync(path.join(this.dir, s))
    }

    async deleteSessionFolder(s){
        if (this.sessionHasFolder(s))
            fs.rmdir(this.getSessionFolderPath(s))
    }

    getSessionFolderPath(s){
        let s = this.SH.getSessionID(s)
        return path.join(this.dir, s)        
    }

    async getSessionFolderContents(s){
        if (!this.sessionHasFolder(s)) 
            return "No session folder!"

        
    }
}

module.exports = SessionFileHandler