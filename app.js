/**
 * Defining local dependencies
 */
const Session = require("./Session.js")
const SessionHandler = require("./SessionHandler.js")
// const SessionFileHandler = require("./SessionFileHandler.js")
const Uid = require("./uniqueId.js")
const CookieParser = require('./cookieparser.js')
const prefs = require("./prefs.json")

/**
 * Defining global dependencies
 */
const http = require("http")
const path = require("path")
const fs = require("fs")
const MIMETYPES = require("mime-types")
const spawn = require('child_process').spawn;



/**
 * Defining constants
 */
const SH = 
    new SessionHandler(prefs.timeoutHrs, prefs.filedir, prefs.sessionTokenLength)

console.log("SessionFolderPath: ") 
console.log(SH.getFileHandler().getRootDirPath())
const server = http.createServer(reqHandler)

server.listen(prefs.port, console.err)
console.log(`Starting HTTP server... port ${prefs.port}`)

function reqHandler(req, res) {
    // console.log(`reqHandler`)
    // console.log(`   req.method: ${req.method}`)
    allocateSession(req, res)
    switch (req.method) {
        case "GET":
            handleGET(req, res)
            break;
        case "POST":
            handlePOST(req, res)
            break;
        default:
            res.writeHead(404, "NOT FOUND")
            res.end()
            break;
    }
}

function allocateSession(req, res){
    // console.log(`allocateSession`)
    // console.log(`   req.headers: ${req.headers}`)
    // console.log(req.headers)
    // console.log(req.headers.cookie)

    let s = CookieParser.getValFromString(req.headers.cookie, 'session-id')
    // console.log(`   session: ${s}`)
    if (s && SH.isValidSession(s)){
        return // console.log(`    Session '${s}' is valid`)
    }
    else {
        // console.log(`   ${s} invalid, creating new session`)
        let sess = SH.createNewSession()
        res.setHeader('set-cookie', `session-id=${sess.id}`)
        // console.log(`   Session '${sess.id}' created and allocated.`)
    }
}

function handleGET(req, res) {
    // console.log(`handleGET`)
    // console.log(`   req.url: ${req.url}`)
    if (req.url === "/") {
        res.statusCode = 301
        res.setHeader('Location', '/youtube-dl')
        res.write("Redirecting....")
        res.end()
        // setTimeout(() => {
        // }, 2000)
        return
    } else if (req.url === prefs.baseURL) {
        let basehtmlpath = convertURLtoPath(path.join(req.url, "/index.html"))
        serveFileToClient(basehtmlpath, req, res)
        return
    } else if (doesFileExist(req.url)){
        serveFileToClient(convertURLtoPath(req.url), req, res)
        return
    } else {
        console.log(`   Throwing 404 for ${req.url}`)
        res.statusCode = 404
        res.end()

    }
}



function serveExclusiveFileToClient(file, req, res, download){

}

function doesFileExist(path){
    console.log('doesFileExist:')
    console.log('   ' + path)
    console.log(fs.existsSync(convertURLtoPath(path)))
    return fs.existsSync(convertURLtoPath(path))
}

function serveFileToClient(file, req, res, download) {
    // console.log(`serveFileToClient`)
    // console.log('   filepath: ' + file)
    // console.log('   exists: ' + fs.existsSync(file))
    if (fs.existsSync(file))
    fs.readFile(file, (err, data) => {
        res.statusCode = 200
        res.setHeader("Content-Type", MIMETYPES.lookup(file))
        if (download) res.setHeader("Content-Disposition", "attachment; filename=" + file)
        res.write(data)
        res.end()
    });
    
}

function convertURLtoPath(URL){
    return (URL.charAt(0) === "/") ? URL.substr(1) : URL
}

function convertPathToURL(path){
    return (path.charAt(0) === "/") ? path : "/" + path
}

function handleDownloadRequest(req, res){
    let link = "";
    req.on('data', (data => {
        console.log("   DATA RECEIVED")
        console.log(data)
        link += data
    }) )
    req.on('end', (data => {
        console.log("   REQ FINISHED")
        link = link.toString()
        console.log("   " + link)
        downloadVideo(getSessionFromRequest(req), link, informClient, res)
        // console.log(req)
    }) )
}

function handlePOST(req, res) {
    console.log(`handlePOST`)
    if (req.url === prefs.baseURL + '/initDL'){
        handleDownloadRequest(req, res, informClient, res)

    } else {
        res.statusCode(404)
        res.end("Not found")
    }
    
}



function downloadVideo(session, link, stdout, res){
    SH.FileHandler.createSessionFolder(session)
    let process = spawn('youtube-dl', [
        '-o', 
        `${SH.FileHandler.getSessionFolderPath(session)}/ %(title)s-%(channel)s.%(ext)s`, 
        link]);

    process.stdout.on('data', stdout)
    process.stderr.on('data', stdout)
}

function informClient(data, res){
    console.log(data.toString())
}

function getSessionFromRequest(req){
    if (!req) throw "getSessionFromRequest: NO HTTP REQUEST."
    return SH.getSession(CookieParser.getValFromString(req.headers.cookie, 'session-id'))
}