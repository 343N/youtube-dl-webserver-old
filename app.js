/**
 * Defining local dependencies
 */
const Session = require("./Session.js")
const SessionHandler = require("./SessionHandler.js")
const SessionFileHandler = require("./SessionFileHandler.js")
const prefs = require("./prefs.json")

/**
 * Defining global dependencies
 */
const http = require("http")
const path = require("path")
const fs = require("fs")
const MIMETYPES = require("mime-types")



/**
 * Defining constants
 */
const SH = new SessionHandler()
const SFH = new SessionFileHandler(SH, prefs.baseURL)


const server = http.createServer(reqHandler)

server.listen(prefs.port, console.err)
console.log(`Starting HTTP server... port ${prefs.port}`)

function reqHandler(req, res) {
    console.log(`reqHandler`)
    console.log(req.method)
    switch (req.method) {
        case "GET":
            handleGET(req, res)
            break;
        case "POST":
            break;
    }
}

function handleGET(req, res) {
    console.log(`handleGET`)
    console.log(req.url)
    if (req.url === "/") {
        res.statusCode = 301
        res.write("Redirecting....")
        setTimeout(() => {
            res.setHeader('Location', '/youtube-dl')
            res.end()
        }, 2000)
    }
    if (req.url === prefs.baseURL) {
        let basehtmlpath = convertURLtoPath(path.join(req.url, "/index.html"))
        serveFileToClient(basehtmlpath, req, res)
        return
    } else {
        res.statusCode = 404
        res.end()
    }
}

function serveExclusiveFileToClient(file, req, res, download){

}

function serveFileToClient(file, req, res, download) {
    console.log(`serveFileToClient`)
    console.log('filepath: ' + file)
    console.log('exists: ' + fs.existsSync(file))
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

function handlePOST(req, res) {
    console.log(`handlePOST`)

}