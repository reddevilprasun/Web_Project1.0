console.log("hey")
let currentSong = new Audio();
let songs;
let currfolder;
function secondsToMinutesSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}
// play Pause icon ---->>>
const playPauseIcon = (index1) => {
    let array = Array.from(document.querySelector(".songsList").getElementsByTagName("li"))
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.querySelector(".songName").innerHTML.trim() == decodeURI(songs[index1])) {
            e.querySelector(".play-circle2").innerHTML = `<i style="color: black;" class="fa-solid fa-pause"></i>`
        } else {
            e.querySelector(".play-circle2").innerHTML = `<i class="fa-solid fa-play play-icon"></i>`
        }

    }
}
async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://192.168.211.113:3000/${folder}/`);
    let responce = await a.text();
    let div = document.createElement("div");
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a");
    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    // Show all songs in the play list
    let songUL = document.querySelector(".songsList").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML += `<li>
        <i class="fa-solid fa-music"></i>
        <div class="info">
            <div class="songName">
                ${song.replaceAll("%20", " ")}
            </div>
            <div class="songArtist">
                Artist name
            </div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <div class="play-circle2">
                <i class="fa-solid fa-play play-icon"></i>
            </div>
        </div>
    </li>`;
    }
    // Attach an event listener to each song
    Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", (element) => {
            if (currentSong.paused) {
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
                playPauseIcon(songs.indexOf(currentSong.src.split("/").slice(-1)[0]))

            } else {
                currentSong.pause()
                playPauseIcon(songs.length + 1)
                let button = document.querySelector(".song-buttons").querySelector("span")
                button.innerHTML = `<i style="color: white;" class="fa-solid fa-play play-icon"></i>`

            }
        })
    })
    return songs;
}



const playMusic = (track, pause = false) => {

    currentSong.src = `/${currfolder}/` + track
    if (!pause) {
        currentSong.play()
        let button = document.querySelector(".song-buttons").querySelector("span")
        button.innerHTML = `<i class="fa-solid fa-pause"></i>`
    }
    document.querySelector(".song-info").innerHTML = decodeURI(track)
    document.querySelector(".song-time").innerHTML = "00:00 / 00:00"
}

async function displayAlbums() {
    let a = await fetch(`http://192.168.211.113:3000/songs/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let array = Array.from(anchors);

    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the meta data of the folder
            let a = await fetch(`http://192.168.211.113:3000/songs/${folder}/info.json`)
            let response = await a.json();
            document.querySelector(".cardContainer").innerHTML += `<div data-folder="${folder}" class="card">
       <div  class="song-pic-play">
           <div class="play-circle">
               <i class="fa-solid fa-play play-icon"></i>
           </div>
           <div class="song-img">
               <img src="/songs/${folder}/cover.jpeg" alt="">
           </div>
       </div>
       <h2>${response.tile}</h2>
       <p>${response.discription}</p>
   </div>`
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach((e) => {
        e.addEventListener("click", async (item) => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(decodeURI(songs[0]));
            playPauseIcon(0)
        }
        )
    }
    )

}

async function main() {

    await getSongs("songs/NCS");
    playMusic(songs[0], true)
    //Display all the albums on the page
    displayAlbums();

    // Attach an event listener to play, next and previous

    play.addEventListener("click", (params) => {
        if (currentSong.paused) {
            currentSong.play()
            let button = document.querySelector(".song-buttons").querySelector("span")
            button.innerHTML = `<i class="fa-solid fa-pause"></i>`
            playPauseIcon(songs.indexOf(currentSong.src.split("/").slice(-1)[0]))
        } else {
            currentSong.pause()
            let button = document.querySelector(".song-buttons").querySelector("span")
            button.innerHTML = `<i style="color: white;" class="fa-solid fa-play play-icon"></i>`
            playPauseIcon(songs.length + 1)
        }
    }
    )
    // Listen for Time update event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".song-time").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        if (((currentSong.currentTime / currentSong.duration) * 100) == 100) {
            let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
            if ((index + 1) < songs.length) {
                playMusic(songs[index + 1])
                playPauseIcon(index + 1)
            }
        }
    }
    )
    // Add a event Listener to the seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    }
    )
    // Add an event listener for hamburger
    document.querySelector(".hamburger-logo").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    }
    )
    // Add event listener for the crox
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    }
    )
    // Add an evnt listener to previous and next
    previous.addEventListener("click", () => {

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) > -1) {
            playMusic(songs[index - 1])
            playPauseIcon(index - 1)
        }
    }
    )
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
            playPauseIcon(index + 1)
        }
    }
    )
    // Add an event to volume and icon changing
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
        if ((parseInt(e.target.value)) == 0) {
            document.querySelector(".volume-icon").innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`
        } else if ((parseInt(e.target.value)) <= 50) {
            document.querySelector(".volume-icon").innerHTML = `<i class="fa-solid fa-volume-low"></i>`
        } else if ((parseInt(e.target.value)) > 50) {
            document.querySelector(".volume-icon").innerHTML = `<i class="fa-solid fa-volume-high"></i>`
        }
    }
    )
    // Add a event Listener to mute
    document.querySelector(".volume-icon").addEventListener("click", (e) => {
        if (e.currentTarget.innerHTML.includes(`<i class="fa-solid fa-volume-high"></i>`) || e.currentTarget.innerHTML.includes(`<i class="fa-solid fa-volume-low"></i>`)) {
            e.currentTarget.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            e.currentTarget.innerHTML = `<i class="fa-solid fa-volume-low"></i>`
            currentSong.volume = 0.2;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 20;
        }
    }
    )

}
main();


