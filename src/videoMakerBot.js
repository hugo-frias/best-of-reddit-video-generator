var exec = require('child_process').exec
var fs = require('fs')

//  Junta a componente do video de um post (.mp4) á respetiva componente de aúdio (.mp3)
var joinVideoAndAudio = async function (post, pastaVideosComAudio, withAudioName) {
    return new Promise(async function (resolve) {
        try {
            exec('ffmpeg -i ../videos/' + post.videoName + ' -i ../audio/' + post.audioName + ' -c copy ' + pastaVideosComAudio + withAudioName, (err, stdout, stderr) => {
                if (err) {
                    console.log("> [video-maker] Error joining audio and video for " + post.videoName)
                        // "\n> Output of the Error:\n" + err)

                    console.log("> [video-maker] Trying to move video without the audio")
                    exec('copy ..\\videos\\' + post.videoName + ' ' + "..\\videoAndAudio\\" + withAudioName, (err, stdout, stderr) => {
                        if (err) {
                            console.log("> [video-maker] Error moving video without audio")
                        } else {
                            console.log("> [video-maker] Moved video without audio")
                        }
                    })
                    resolve()
                    return;
                } else {
                    console.log("> [video-maker] Joined video and audio for " + post.videoName)
                    resolve()
                }
            })
        } catch (err) {
            console.log("> [video-maker] Errou OMEGALUL" + err)
        }
    })
}

//  Verifica a resolução de um clipe de video
var checkResolution = async function (videoName, pastaVideosComAudio, pastaVideosResolucaoCerta) {
    return new Promise((resolve) => {
        var resolution = ''
        exec('ffprobe -v error -select_streams v:0 -show_entries stream=display_aspect_ratio -of json=c=1 ' + pastaVideosComAudio + videoName, async function (err, stdout, stderr) {
            try {
                if (err) {
                    console.log("> [video-maker] Error verifying the resolution for " + videoName + "." + "\n> Output of the Error:\n" + err)
                    resolve()
                    return;
                } else {
                    console.log("> [video-maker] Checking Resolution for " + videoName)
                    resolution = JSON.parse(stdout).streams[0].display_aspect_ratio
                    console.log("> [video-maker] Resolution is: " + resolution)
                    if (resolution != "16:9") {
                        console.log("> [video-maker] Fixing resolution: " + resolution)
                        await fixResolution(videoName, pastaVideosComAudio, pastaVideosResolucaoCerta)
                        resolve()
                    } else {
                        console.log("> [video-maker] " + videoName + " has the right resolution. Moving it to the folder " + pastaVideosResolucaoCerta)
                        exec('move ' + pastaVideosComAudio.split('/')[0] + '\\' + videoName + " " + pastaVideosResolucaoCerta)
                        resolve()
                    }
                }
            } catch (err) {
                console.log("> [video-maker] Errou OMEGALUL" + err)
            }
        });

    })

}

//  Corrige a resolução de um vídeo que não tenha resolução 16:9, adicionando margens "blurred"
async function fixResolution(videoName, pastaVideosComAudio, pastaVideosResolucaoCerta) {
    return new Promise((resolve) => {
        try {
            exec('ffmpeg -i ' + pastaVideosComAudio + videoName + ' -lavfi "[0:v]scale=1920*2:1080*2,boxblur=luma_radius=min(h\\,w)/20:luma_power=1:chroma_radius=min(cw\\,ch)/20:chroma_power=1[bg];[0:v]scale=-1:1080[ov];[bg][ov]overlay=(W-w)/2:(H-h)/2,crop=w=1920:h=1080" ../tempResolution/' + videoName + ' && ffmpeg -i ../tempResolution/' + videoName + ' -vf "scale=1920:1080,setsar=1" ' + pastaVideosResolucaoCerta + videoName, (err, stdout, stderr) => {
                if (err) {
                    console.log("> [video-maker] Error fixing the resolution of " + videoName)
                    resolve()
                    return;
                } else {
                    console.log("> [video-maker] Resolution of " + videoName + " corrected")
                    resolve()

                }
            });

        } catch (err) {
            console.log("> [video-maker] Error moving the file " + videoName + " to the correct folder")
        }
    })

}

//  Adiciona o título do post original ao clipe do mesmo, sendo colocado no canto inferior esquerdo
var addTextToVideo = async function (post, video, pasta, pastaVideosResolucaoCerta) {
    return new Promise((resolve) => {
        var title = post.title
        if (post.title.includes('\'')) {
            title = post.title.replace('\'', '')
        }
        try {
            console.log("> [video-maker] Adding text to the video " + post.video)
            exec('ffmpeg -i ' + pastaVideosResolucaoCerta + video + ' -vf "drawtext=text=\'' + title + '\':font=\'Arial Black\':x=0:y=h-th:fontsize=24:fontcolor=white:box=1:boxcolor=black@0.5:boxborderw=5:enable=\'between(t,' + 0 + ',' + post.duration + ')\'" -c:a copy ' + pasta + post.videoName.split('.')[0] + 'withText.mp4', (err, stdout, stderr) => {
                if (err) {
                    console.log("> [video-maker] Error adding text to the video " + post.videoName + "."
                        + "\n> Output of the Error:\n" + err)
                    resolve()
                    return;
                } else {
                    console.log("> [video-maker] Text added to the video " + post.videoName + ".")
                    resolve()
                }
            })

        } catch (err) {
        }
    })
}

//  Guarda num ficheiro .txt a localização e nomes dos ficheiros dos clipes a serem utilizados para o vídeo final
var makeListFile = async function (videosWithTextFolder) {
    var data = '';
    await new Promise((resolve) => {
        try {
            console.log("> [video-maker] Creating file list.")
            fs.readdir(videosWithTextFolder, (err, files) => {
                files.forEach(file => {
                    data += 'file ' + videosWithTextFolder.split("/")[1] + "/" + file + "\n";
                })
                fs.writeFile("../listaDeVideos.txt", data, function (err) {
                    if (err) return console.log(err);
                })
                resolve()
            })
        } catch (err) {
            console.log("> [video-maker] Error creating the file list.\nOutput of the Error:\n" + err)
            reject()
        }
    })
    return data
}

/*
    Junta todos os clipes já editados (com as resoluções certas, com aúdio e video sincronizados e texto no ecrã) e
    cria o video final a ser publicado no youtube
*/
var videoMaker = async function (videoName, pastaVideoFinal) {
    return new Promise((resolve, reject) => {
        exec('ffmpeg -safe 0 -f concat -i ../listaDeVideos.txt -c copy ' + pastaVideoFinal + videoName, async function (err, stdout, stderr) {
            if (err) {
                console.log("> [video-maker] Error creating final video "
                    + ".\n> Output of the Error:\n" + err)
                reject()
                return;
            } else {
                console.log("> [video-maker] Final video created with the name: " + videoName)
                resolve()
            }
        });
    })
}




module.exports = {
    joinVideoAndAudio: joinVideoAndAudio,
    checkResolution: checkResolution,
    addTextToVideo: addTextToVideo,
    makeListFile: makeListFile,
    videoMaker: videoMaker
}