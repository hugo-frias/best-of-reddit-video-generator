var fetch = require('cross-fetch')
var fs = require('fs')
var https = require('https')

/*
Pesquisa pelos Top Posts de um determinado tempo (na ultima hora, dia, semana, mês, ano ou de sempre) do subreddit passado por parâmetro e adiciona-os á lista de posts potênciais para
o video, caso eles:
 - Não sejam NSFW (Not Safe For Work, contendo nudez ou imagens demasiado gráficas)
 - Têm de ser videos com uma duração inferior a 1 minuto
 - A duração total dos posts não pode ser superior a 400 segundos
Dos posts encontrados são extraídos o título, o autor do video, o url do post e os url's do próprio video e aúdio
*/
var getData = async function (subReddit, timeFrame) {
    let postList = []
    let duration = 0
    let data = await fetch("https://www.reddit.com/" + subReddit + "/top.json?t="+timeFrame).then(response => response.json())
    for (let post of data.data.children) {
        if (post.data.post_hint == "hosted:video" && post.data.over_18 == false && duration < 400 && post.data.secure_media.reddit_video.duration < 60) {
            let videoPost = {}
            videoPost.title = post.data.title
            videoPost.user = post.data.author
            videoPost.url = "https://www.reddit.com/" + post.data.permalink
            if (post.data.secure_media != undefined) {
                videoPost.video = (post.data.secure_media.reddit_video.fallback_url).split('?')[0]
                videoPost.videoName = videoPost.video.split("/")[3] + ".mp4"
                videoPost.audio = (post.data.secure_media.reddit_video.fallback_url).split('_')[0] + '_audio.mp4'
                videoPost.audioName = videoPost.video.split("/")[3] + ".mp3"
                videoPost.duration = post.data.secure_media.reddit_video.duration
                duration += videoPost.duration
            }
            postList.push(videoPost)
        }
    }
    return postList
}

// Faz o download de todos os ficheiros presentes na lista passada por parâmetro
var downloadAllFiles = async function (postList) {
    for (var post of postList) {
        await download(post.video, ".mp4")
        await download(post.audio, ".mp3")

    }
}

// Faz download de um ficheiro com base no seu URL e na sua extensão (podendo ser mp4 ou mp3)
async function download(url, ext) {

    return new Promise(async function (resolve) {
        const nomeVideo = (ext == ".gif") ? url.split("/")[3] : url.split("/")[3] + ext
        const pasta = (ext == ".mp4") ? "videos" : (ext == ".mp3") ? "audio" : null
        const fileStream = fs.createWriteStream("./" + pasta + "/" + nomeVideo);
        console.log("> [content-downloader] Downloading " + url + " into the folder " + pasta)
        await getDataAsync(url, fileStream).then(await closeFileStreamAsync(fileStream)).then(resolve())
    })

}

// Faz o download do ficheiro com recurso ao fileStream e usando o URL do video
async function getDataAsync(url, fileStream) {
    return new Promise(async function (resolve, reject) {
        https.get(url, async function (res) {
            console.log("> [content-downloader] Downloaded " + url + " successfully")
            res.pipe(fileStream);
            resolve()
        })
    })
}

// Fecha o pipe do fileStream
async function closeFileStreamAsync(fileStream) {
    return new Promise(async function (resolve) {
        fileStream.on("finish", async function (err) {
            fileStream.close()
            console.log("> [content-downloader] Closing fileStream")
            resolve()
        });
    });
}


module.exports = {
    getData: getData,
    downloadAllFiles: downloadAllFiles
}