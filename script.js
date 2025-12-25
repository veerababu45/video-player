// ------------------------
// Select elements
// ------------------------
const video = document.getElementById("video-player");
const playBtn = document.getElementById("play");
const rewindBtn = document.getElementById("skipminus-10");
const forwardBtn = document.getElementById("skipplus-10");

const currentTimeElem = document.getElementById("current-time");
const maxDurationElem = document.getElementById("max-duration");
const playbackLine = document.querySelector(".playback-line");
const progressBar = document.querySelector(".progress-bar");

const volumeSlider = document.getElementById("volume");
const muteBtn = document.getElementById("mute");
const fullscreenBtn = document.getElementById("fullscreen");

const videoContainer = document.querySelector(".video-container");

// Search Elements
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const suggestions = document.getElementById("suggestions");

// Comments Elements
const commentInput = document.getElementById("comment-input");
const commentBtn = document.getElementById("comment-btn");
const commentList = document.getElementById("comment-list");
const clearCommentsBtn = document.getElementById("clear-comments");

// ------------------------
// Format time
// ------------------------
const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
};

// ------------------------
// Play / Pause
// ------------------------
playBtn.addEventListener("click", () => {
    if(video.paused) {
        video.play();
        playBtn.innerHTML = '<span class="material-symbols-outlined">pause</span>';
    } else {
        video.pause();
        playBtn.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';
    }
});

// ------------------------
// Skip Forward / Backward
// ------------------------
rewindBtn.addEventListener("click", () => video.currentTime -= 10);
forwardBtn.addEventListener("click", () => video.currentTime += 10);

// ------------------------
// Timer & Progress Bar
// ------------------------
video.addEventListener("loadedmetadata", () => {
    maxDurationElem.textContent = formatTime(video.duration);
});

video.addEventListener("timeupdate", () => {
    currentTimeElem.textContent = formatTime(video.currentTime);
    const progressPercent = (video.currentTime / video.duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
});

// Click on progress bar to seek
playbackLine.addEventListener("click", e => {
    const rect = playbackLine.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    video.currentTime = (clickX / width) * video.duration;
});

// Drag progress bar
playbackLine.addEventListener("mousedown", () => {
    const moveHandler = e => {
        const rect = playbackLine.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        video.currentTime = (clickX / width) * video.duration;
    };
    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("mouseup", () => {
        window.removeEventListener("mousemove", moveHandler);
    }, { once: true });
});

// ------------------------
// Volume & Mute
// ------------------------
volumeSlider.addEventListener("input", () => video.volume = volumeSlider.value);

muteBtn.addEventListener("click", () => {
    video.muted = !video.muted;
    muteBtn.innerHTML = video.muted 
        ? '<span class="material-symbols-outlined">volume_off</span>'
        : '<span class="material-symbols-outlined">volume_up</span>';
});

// ------------------------
// Fullscreen
// ------------------------
fullscreenBtn.addEventListener("click", () => {
    if(!document.fullscreenElement) {
        videoContainer.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// Toggle fullscreen icon
document.addEventListener("fullscreenchange", () => {
    const icon = fullscreenBtn.querySelector("span");
    icon.textContent = document.fullscreenElement ? "fullscreen_exit" : "fullscreen";
});

// ------------------------
// Search Functionality
// ------------------------
searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim().toLowerCase();
    if(!query) return alert("Please type something to search!");

    const items = suggestions.querySelectorAll("p");
    items.forEach(item => {
        item.style.display = item.textContent.toLowerCase().includes(query) ? "block" : "none";
    });
});

searchInput.addEventListener("keydown", e => {
    if(e.key === "Enter") searchBtn.click();
});

// ------------------------
// Comments Functionality
// ------------------------
commentBtn.addEventListener("click", () => {
    const commentText = commentInput.value.trim();
    if(!commentText) return alert("Please type a comment!");
    
    const comment = document.createElement("p");
    comment.textContent = commentText;
    commentList.appendChild(comment);
    
    commentInput.value = "";
});

// Clear all comments
clearCommentsBtn.addEventListener("click", () => {
    commentList.innerHTML = "";
});
