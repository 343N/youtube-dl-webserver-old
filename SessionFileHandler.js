const path = require("path")
const fs = require("fs")
const SessionHandler = require('./SessionHandler.js')

class SessionFileHandler {

    constructor(SH, rootfolder){
        if (!SH) throw `SessionFileHandler must be passed a valid ` + 
            `SessionHandler object in its constructor! (arg #1)`

        if (!rootfolder || typeof rootfolder  !== "string")
            throw `Root folder must be provided (arg #2)`

        this.SH = SH
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

    getRootDirPath(){
        return this.dir
    }

    getSessionFolderPath(s){
        s = this.SH.getSessionID(s)
        return path.join(this.dir, s)        
    }

    async getSessionFolderContents(s){
        if (!this.sessionHasFolder(s)) 
            return "No session folder!"
    }

    async writeSessionData(session, data){
        // console.log()
    }

    createSessionFolder(session){
       
        if (typeof session == "object" 
            && !fs.existsSync(path.join(this.dir, session.id))){
            fs.mkdirSync(path.join(this.dir, session.id))
            return true
        }
        else if (typeof session == 'string' 
            && !fs.exists(path.join(this.dir, session))){

            fs.mkdirSync(path.join(this.dir, session))
            return true

        }
        else return false
    }

    
}

module.exports = SessionFileHandler