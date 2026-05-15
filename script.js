const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",    // 0 normal excited
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAd/chiikawa-hachiware.gif",  // 1 confused
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",             // 2 pleading
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",             // 3 sad
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",       // 4 sadder
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",             // 5 devastated
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",               // 6 very devastated
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"  // 7 crying
]

const noMessages = [
    "Nah, maybe later",
    "Are you sure? 🤔",
    "But I worked so hard on this... 🥺",
    "Come on, just open it! 🎁",
    "It's your BIRTHDAY though... 🎂",
    "You're really gonna leave me hanging? 😢",
    "I'll be so sad if you don't open it... 💔",
    "PLEASE??? It's special! 😭",
    "You can't escape your birthday surprise 😜"
]

const yesTeasePokes = [
    "hmm try saying no first... see what happens 😏",
    "go on, hit no... just once 👀",
    "aren't you curious what happens? 😈",
    "press no, I dare you 😏"
]

const runawayMessages = [
    "Hehe, catch me! 😜",
    "Too slow~ 💨",
    "Nope, not here! 🏃‍♀️",
    "You'll never catch me! 😝",
    "Almost! Try again~ 🎯",
    "Just open it already! 🎁",
    "I'm too fast for you! ⚡",
    "Give up and click Open it! 🥰",
    "Still trying? 😏",
    "Okay fine, I'll slow dow— SIKE 😜"
]

let runawayMsgIndex = 0

let yesTeasedCount = 0

let noClickCount = 0
let runawayEnabled = false
let musicPlaying = true

const cuteGif = document.getElementById('cute-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')

// Splash screen — user taps to enter, which allows music to play
document.getElementById('splash-btn').addEventListener('click', () => {
    const splash = document.getElementById('splash-screen')
    splash.classList.add('splash-exit')

    // Start music (browser allows it because this is a real user gesture)
    music.volume = 0.3
    music.muted = false
    music.play().catch(() => {})
    musicPlaying = true
    document.getElementById('music-toggle').textContent = '🔊'

    // Show main content and music toggle
    document.getElementById('main-content').style.display = ''
    document.getElementById('music-toggle').style.display = ''

    // Remove splash after animation
    setTimeout(() => {
        splash.remove()
    }, 800)
})

function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.muted = false
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

function handleYesClick() {
    if (!runawayEnabled) {
        // Tease her to try No first
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTeaseMessage(msg)
        return
    }
    // Save music position so yes.html can resume from here
    sessionStorage.setItem('musicTime', music.currentTime)
    sessionStorage.setItem('musicPlaying', musicPlaying)
    window.location.href = 'yes.html'
}

function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

function handleNoClick() {
    noClickCount++

    // Cycle through guilt-trip messages
    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
    noBtn.textContent = noMessages[msgIndex]

    // Grow the Yes button bigger each time (capped for mobile)
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    const maxFontSize = window.innerWidth < 600 ? 28 : 48
    yesBtn.style.fontSize = `${Math.min(currentSize * 1.2, maxFontSize)}px`
    const padY = Math.min(18 + noClickCount * 3, 35)
    const padX = Math.min(45 + noClickCount * 6, window.innerWidth < 600 ? 50 : 90)
    yesBtn.style.padding = `${padY}px ${padX}px`
    yesBtn.style.maxWidth = '90vw'

    // Shrink No button to contrast
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
    }

    // Swap gif through stages
    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    // Runaway starts at click 5
    if (noClickCount >= 5 && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
    }
}

function swapGif(src) {
    cuteGif.style.opacity = '0'
    setTimeout(() => {
        cuteGif.src = src
        cuteGif.style.opacity = '1'
    }, 200)
}

function enableRunaway() {
    // Disable clicking the No button so it can't grow Yes anymore
    noBtn.removeAttribute('onclick')
    noBtn.style.pointerEvents = 'auto'
    noBtn.style.cursor = 'default'

    // Make the button visible with purple style
    noBtn.classList.add('runaway-visible')

    // Still run away on hover
    noBtn.addEventListener('mouseover', runAway)
    noBtn.addEventListener('touchstart', runAway, { passive: true })

    // Immediately move it once
    runAway()

    // Auto-move randomly every 1.5–3 seconds so it keeps dodging
    setInterval(() => {
        runAway()
    }, 1500 + Math.random() * 1500)
}

function rectsOverlap(r1, r2, padding) {
    return !(r1.right + padding < r2.left ||
             r1.left - padding > r2.right ||
             r1.bottom + padding < r2.top ||
             r1.top - padding > r2.bottom)
}

function runAway() {
    const margin = 20
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight
    const maxX = window.innerWidth - btnW - margin
    const maxY = window.innerHeight - btnH - margin

    const yesRect = yesBtn.getBoundingClientRect()
    const musicBtn = document.getElementById('music-toggle')
    const musicRect = musicBtn.getBoundingClientRect()

    let randomX, randomY, attempts = 0

    // Keep generating positions until we find one that doesn't overlap
    do {
        randomX = Math.random() * maxX + margin / 2
        randomY = Math.random() * maxY + margin / 2
        const noRect = {
            left: randomX,
            top: randomY,
            right: randomX + btnW,
            bottom: randomY + btnH
        }
        const overlapsYes = rectsOverlap(noRect, yesRect, 20)
        const overlapsMusic = rectsOverlap(noRect, musicRect, 10)
        if (!overlapsYes && !overlapsMusic) break
        attempts++
    } while (attempts < 50)

    noBtn.style.position = 'fixed'
    noBtn.style.left = `${randomX}px`
    noBtn.style.top = `${randomY}px`
    noBtn.style.zIndex = '50'

    // Cycle through runaway messages
    noBtn.textContent = runawayMessages[runawayMsgIndex % runawayMessages.length]
    runawayMsgIndex++
}
