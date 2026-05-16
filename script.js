// === GIF stages ===
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

// === Phase 1: Yes button runs away ===
const yesRunawayMessages = [
    "Buka Dong! 🎉",
    "Hehe, belum boleh~ 😜",
    "Tangkep dulu dong! 💨",
    "Nggak semudah itu! 🏃‍♀️",
    "Coba lagi~ hampir dapet! 🎯",
    "Sabar yaa... 😏",
    "Eits, mau kemana? 😝",
    "Coba klik yang lain dulu! 👀",
    "Sini sini... eh kabur lagi! ⚡",
    "Masih nyoba? Semangat! 💪"
]

// === Phase 2: No button messages ===
const noMessages = [
    "Nanti aja dehh",
    "Yakin nih? 🤔",
    "Padahal aku udah capek bikin ini... 🥺",
    "Ayolah, buka aja! 🎁",
    "Ini hari ULANG TAHUN lohh... 🎂",
    "Masa gamau sih... 😢",
    "Aku sedih kalau ga dibuka... 💔",
    "PLEASEEE??? Ini spesial! 😭",
    "Gabisa kabur dari surprise-mu 😜"
]

// === Phase 2b: No button runaway messages ===
const noRunawayMessages = [
    "Hehe, tangkep aku! 😜",
    "Terlalu lambat~ 💨",
    "Bukan di sini! 🏃‍♀️",
    "Gabisa nangkep aku! 😝",
    "Hampirrr! Coba lagi~ 🎯",
    "Buka aja langsung! 🎁",
    "Aku terlalu cepat! ⚡",
    "Nyerah aja, klik Buka! 🥰",
    "Masih nyoba? 😏",
    "Oke oke aku pelan— EH SIKE 😜"
]

// === State ===
let phase = 1 // 1=yes runs, 2=no responds, 3=no runs, 4=yes returns
let yesRunawayCount = 0
let noClickCount = 0
let noRunawayMsgIndex = 0
let musicPlaying = true
let noAutoMoveInterval = null

const cuteGif = document.getElementById('cute-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')

// === Splash screen ===
document.getElementById('splash-btn').addEventListener('click', () => {
    const splash = document.getElementById('splash-screen')
    splash.classList.add('splash-exit')

    music.volume = 0.3
    music.muted = false
    music.play().catch(() => {})
    musicPlaying = true
    document.getElementById('music-toggle').textContent = '🔊'

    document.getElementById('main-content').style.display = ''
    document.getElementById('music-toggle').style.display = ''

    setTimeout(() => {
        splash.remove()
        // Start phase 1: Yes button runs away
        startYesRunaway()
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

// ==========================================
// PHASE 1: Yes button runs away
// ==========================================
function startYesRunaway() {
    phase = 1
    yesBtn.removeAttribute('onclick')
    yesBtn.addEventListener('mouseover', runYesAway)
    yesBtn.addEventListener('touchstart', runYesAway, { passive: true })

    // Auto-move yes button every 2s so it keeps dodging
    setInterval(() => {
        if (phase === 1) runYesAway()
    }, 2000 + Math.random() * 1500)

    // Move it once immediately
    runYesAway()
}

function runYesAway() {
    if (phase !== 1) return

    yesRunawayCount++
    const margin = 20
    const btnW = yesBtn.offsetWidth
    const btnH = yesBtn.offsetHeight
    const maxX = window.innerWidth - btnW - margin
    const maxY = window.innerHeight - btnH - margin

    const noRect = noBtn.getBoundingClientRect()
    const musicBtn = document.getElementById('music-toggle')
    const musicRect = musicBtn.getBoundingClientRect()

    let randomX, randomY, attempts = 0

    do {
        randomX = Math.random() * maxX + margin / 2
        randomY = Math.random() * maxY + margin / 2
        const yesRect = {
            left: randomX, top: randomY,
            right: randomX + btnW, bottom: randomY + btnH
        }
        const overlapsNo = rectsOverlap(yesRect, noRect, 20)
        const overlapsMusic = rectsOverlap(yesRect, musicRect, 10)
        if (!overlapsNo && !overlapsMusic) break
        attempts++
    } while (attempts < 50)

    yesBtn.style.position = 'fixed'
    yesBtn.style.left = `${randomX}px`
    yesBtn.style.top = `${randomY}px`
    yesBtn.style.zIndex = '50'

    // Cycle through messages
    const msgIndex = yesRunawayCount % yesRunawayMessages.length
    yesBtn.textContent = yesRunawayMessages[msgIndex]

    // Show toast hints
    if (yesRunawayCount === 3) {
        showTeaseMessage("hmm... coba klik tombol yang lain dulu 👀")
    }
    if (yesRunawayCount === 6) {
        showTeaseMessage("iya yang itu... klik aja! 😏")
    }

    // After 8 attempts, move to phase 2
    if (yesRunawayCount >= 8) {
        phase = 2
        yesBtn.removeEventListener('mouseover', runYesAway)
        yesBtn.removeEventListener('touchstart', runYesAway)
        // Keep yes button at last position, but make it unclickable in phase 2
        yesBtn.style.pointerEvents = 'none'
        yesBtn.style.opacity = '0.4'
        yesBtn.textContent = "Buka Dong! 🎉"

        // Enable no button clicking
        noBtn.onclick = handleNoClick
        showTeaseMessage("jangan klik yang ini ya~🥺")
    }
}

// ==========================================
// PHASE 2: No button responds to clicks
// ==========================================
function handleNoClick() {
    if (phase !== 2) return
    noClickCount++

    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
    noBtn.textContent = noMessages[msgIndex]

    // Swap gif through stages
    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    // After 5 clicks, start phase 3: No runs away
    if (noClickCount >= 5) {
        phase = 3
        startNoRunaway()
    }
}

// ==========================================
// PHASE 3: No button runs away
// ==========================================
function startNoRunaway() {
    noBtn.onclick = null
    noBtn.classList.add('runaway-visible')

    noBtn.addEventListener('mouseover', runNoAway)
    noBtn.addEventListener('touchstart', runNoAway, { passive: true })
    runNoAway()

    // Auto-move
    let noMoveCount = 0
    noAutoMoveInterval = setInterval(() => {
        if (phase !== 3) return
        noMoveCount++
        runNoAway()

        // After 5 auto-moves, end phase 3 → phase 4
        if (noMoveCount >= 5) {
            clearInterval(noAutoMoveInterval)
            phase = 4
            endGame()
        }
    }, 1500 + Math.random() * 1000)
}

function runNoAway() {
    if (phase !== 3) return

    const margin = 20
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight
    const maxX = window.innerWidth - btnW - margin
    const maxY = window.innerHeight - btnH - margin

    const yesRect = yesBtn.getBoundingClientRect()
    const musicBtn = document.getElementById('music-toggle')
    const musicRect = musicBtn.getBoundingClientRect()

    let randomX, randomY, attempts = 0

    do {
        randomX = Math.random() * maxX + margin / 2
        randomY = Math.random() * maxY + margin / 2
        const noRect = {
            left: randomX, top: randomY,
            right: randomX + btnW, bottom: randomY + btnH
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

    noBtn.textContent = noRunawayMessages[noRunawayMsgIndex % noRunawayMessages.length]
    noRunawayMsgIndex++
}

// ==========================================
// PHASE 4: Yes button returns, big and clickable
// ==========================================
function endGame() {
    const isMobile = window.innerWidth < 600

    // Hide no button with fade
    noBtn.style.transition = 'opacity 0.5s ease'
    noBtn.style.opacity = '0'
    setTimeout(() => { noBtn.style.display = 'none' }, 500)

    // Put yes button back into the normal document flow (below GIF)
    yesBtn.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
    yesBtn.style.position = 'relative'
    yesBtn.style.left = 'auto'
    yesBtn.style.top = 'auto'
    yesBtn.style.transform = 'none'
    yesBtn.style.pointerEvents = 'auto'
    yesBtn.style.opacity = '1'
    yesBtn.style.fontSize = isMobile ? '1.8rem' : '2.4rem'
    yesBtn.style.padding = isMobile ? '20px 44px' : '28px 64px'
    yesBtn.style.maxWidth = '90vw'
    yesBtn.style.zIndex = '10'
    yesBtn.style.boxShadow = '0 8px 40px rgba(255, 105, 180, 0.5)'
    yesBtn.textContent = "Buka Dong! 🎉"

    // Make it clickable
    yesBtn.addEventListener('click', () => {
        sessionStorage.setItem('musicTime', music.currentTime)
        sessionStorage.setItem('musicPlaying', musicPlaying)
        window.location.href = 'yes.html'
    })

    // Happy gif
    swapGif(gifStages[0])

    showTeaseMessage("finally~ sekarang boleh dibuka! 🥰")
}

// ==========================================
// Utility functions
// ==========================================
function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 3000)
}

function swapGif(src) {
    cuteGif.style.opacity = '0'
    setTimeout(() => {
        cuteGif.src = src
        cuteGif.style.opacity = '1'
    }, 200)
}

function rectsOverlap(r1, r2, padding) {
    return !(r1.right + padding < r2.left ||
             r1.left - padding > r2.right ||
             r1.bottom + padding < r2.top ||
             r1.top - padding > r2.bottom)
}
