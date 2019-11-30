const SessionHandler = require('./sessionhandler.js')


const PREFS = require('./prefs.json');
if (!PREFS) throw "No preference file found! Aborting..."
if (!PREFS.url) PREFS.url = ""
PREFS.url = "/" + PREFS.url
if (!PREFS.videodir) PREFS.videodir = ""
PREFS.videodir = "/" + PREFS.videodir

const HTTP = require('http');
const FS = require('fs');
const WebSocket = require('ws')
const SERVER = HTTP.createServer(reqHandler);

const SH = new SessionHandler()

if (!PREFS.port) throw "No port specified!\nEdit prefs.json and add a port."
let wsServer = new WebSocket.Server({server: SERVER})

SERVER.listen(PREFS.port, (err) => {
    if (err) return console.err(err);

    console.log(`Starting HTTP server on port ${PREFS.port}`);
});


function reqHandler(req, res) {
    console.log(req.method)
    switch (req.method) {
        case "POST":
            handlePOST(req, res)
            break;
        case "GET":
            handleGET(req, res)
            break;
    }
}

function handleGET(req, res) {
    console.log("Handling GET req.")
    if (req.url !== PREFS.url) {
        res.writeHead(404, "FUCK! CAN'T FIND SHIT.")
        res.end()
        return
    }
    let HTML = FS.readFileSync(PREFS.httpFileLocation)
    let str = `Your ip is ${req.socket.remoteAddress}.`
    
    
    
    let s = SH.newSession()
    if (!HTML){
        res.end("HTML FILE MISSING OH SHIT OH FUCK")
        return
    }
    
    res.writeHead(200, {
        'Content-Type': 'text/html',
        "set-cookie": `session-id=${s.id}`
    })
    res.write(HTML)
    
    console.log(`New connection\nCreating session: ${s.id} - ${s.timestamp}`)
    res.end()

}

function handlePOST(req, res) {
    console.log("Handling POST req.")
    let postdata = "";

    req.on('data', (datachunk) => {
        console.log("Handling data...")
        console.log(datachunk.toString())
        postdata += datachunk.toString()
    })

    req.on('end', () => {
        console.log(postdata)
        console.log("Finished processing form data.")
        let sess = postdata.split("\n")[0]
        if (!SH.isValidSession(sess))
            res.statusCode = 403
        else res.statusCode = 204
        res.end()
    })
}

wsServer.on('connection', (ws) => {
    ws.on('cli-data', (a,b,c) => {

    })
    ws.send("Connected!")
})

SERVER.on('upgrade', (req, socket, head) => {
    let pathname = url.parse(request.url).pathname
    if (pathname !== PREFS.url)
        return
    // req.end()
    console.log(req)
    
})