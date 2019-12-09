let linkfield = document.querySelector('textarea#linkfield')

let dlButtTonne = document.querySelector('button#linkfield')

dlButtTonne.addEventListener('click', () => {
    let links = linkfield.value.split('\n')
    for (let l of links){
        if (l.length == 0) continue;
        initiateServerDownload(l.trim())
    }
})



function initiateServerDownload(link){
    console.log("Starting download of " + link)
    let initReq = new XMLHttpRequest()
    initReq.open("POST", document.URL + "/initDL")
    initReq.send(link)
    
}





let previousSessionCol = document.querySelector("#previousSessionData")
previousSessionCol.appendChild(createVideoCard("/youtube-dl/a7ri6n.mp4", "Getting mad @ streetbois", "00:40", "23.4mb"))
previousSessionCol.appendChild(createVideoCard("/youtube-dl/a7ri6n.mp4", "Getting mad @ streetbois 2", "00:40", "23.4mb"))

function createVideoCard(link, title, duration, size) {
    let container = document.createElement('div')
    container.setAttribute("class", "card mx-auto")
    container.setAttribute("style", "width: 16rem; margin-bottom:1rem;")
    // container.setAttribute("style", "")
    // container.setAttribute("style", "width: 18rem;")

    cardVidPreview = document.createElement('video')
    cardVidPreview.setAttribute('class', 'card-img-top')
    cardVidPreview.setAttribute('style', 'background-color: grey; width: 100%;')
    cardVidPreview.setAttribute('src', link)
    cardVidPreview.setAttribute('loop', '')
    cardVidPreview.muted = true
    // cardVidPreview.volume = 0
    cardVidPreview.addEventListener('mouseover', (a) => {
        let v = a.srcElement
        if (v.paused) v.play()
    })
    cardVidPreview.addEventListener('mouseleave', (a) => {
        let v = a.srcElement
        if (!v.paused) v.pause()
    })

    container.appendChild(cardVidPreview)

    let cardBody = document.createElement('div')
    cardBody.setAttribute('class', 'card-body text-left')
    cardBody.innerHTML =
        `<h5 class="card-title">${title}</h5>
        <p class="card-text">Duration: ${duration}<BR>Size: ${size}</p>
        <a href="#" class="btn btn-primary">Download</a>
        <a href="#" class="btn btn-danger">Delete</a>`

    container.appendChild(cardBody)

    return container
}