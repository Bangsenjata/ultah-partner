let musicPlaying = false
let currentSlide = 0
let slideInterval = null

window.addEventListener('load', () => {
    launchConfetti()
    startSlideshow()

    // Resume music from where it left off on the previous page
    const music = document.getElementById('bg-music')
    music.volume = 0.3

    const savedTime = sessionStorage.getItem('musicTime')
    if (savedTime) {
        music.currentTime = parseFloat(savedTime)
    }

    const wasMusicPlaying = sessionStorage.getItem('musicPlaying')
    if (wasMusicPlaying !== 'false') {
        music.play().catch(() => {})
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    } else {
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    }
})

function launchConfetti() {
    const colors = ['#FFB6C1', '#FF69B4', '#FF1493', '#DB7093', '#FFC0CB', '#F472B6', '#fff', '#FFD1DC']
    const isMobile = window.innerWidth < 600

    // Initial big burst
    confetti({
        particleCount: isMobile ? 60 : 200,
        spread: isMobile ? 70 : 120,
        origin: { x: 0.5, y: 0.3 },
        colors
    })

    // Phase 1: Dense burst for the first 5 seconds
    const burstCount = isMobile ? 8 : 25
    const burstInterval = isMobile ? 500 : 400

    const burstTimer = setInterval(() => {
        confetti({
            particleCount: burstCount,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors
        })
        confetti({
            particleCount: burstCount,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors
        })
    }, burstInterval)

    // Phase 2: After 5 seconds, switch to subtle mode
    setTimeout(() => {
        clearInterval(burstTimer)

        const subtleCount = isMobile ? 4 : 15
        const subtleInterval = isMobile ? 1500 : 600

        setInterval(() => {
            confetti({
                particleCount: subtleCount,
                angle: 60,
                spread: isMobile ? 40 : 55,
                origin: { x: 0, y: 0.6 },
                colors
            })
            confetti({
                particleCount: subtleCount,
                angle: 120,
                spread: isMobile ? 40 : 55,
                origin: { x: 1, y: 0.6 },
                colors
            })
        }, subtleInterval)
    }, 5000)
}

// --- Slideshow ---
function startSlideshow() {
    const polaroids = document.querySelectorAll('.polaroid')
    if (polaroids.length === 0) return

    // Prev/Next buttons
    const prevBtn = document.getElementById('slide-prev')
    const nextBtn = document.getElementById('slide-next')

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const prev = (currentSlide - 1 + polaroids.length) % polaroids.length
            goToSlide(prev, polaroids)
            resetAutoSlide(polaroids)
        })
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const next = (currentSlide + 1) % polaroids.length
            goToSlide(next, polaroids)
            resetAutoSlide(polaroids)
        })
    }

    // Swipe gesture for mobile
    const frame = document.querySelector('.slideshow-frame')
    if (frame) {
        let touchStartX = 0
        let touchEndX = 0

        frame.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX
        }, { passive: true })

        frame.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX
            const diff = touchStartX - touchEndX

            if (Math.abs(diff) > 50) { // minimum swipe distance
                if (diff > 0) {
                    // Swiped left → next
                    const next = (currentSlide + 1) % polaroids.length
                    goToSlide(next, polaroids)
                } else {
                    // Swiped right → prev
                    const prev = (currentSlide - 1 + polaroids.length) % polaroids.length
                    goToSlide(prev, polaroids)
                }
                resetAutoSlide(polaroids)
            }
        }, { passive: true })
    }

    // Auto-cycle every 4 seconds
    slideInterval = setInterval(() => {
        const next = (currentSlide + 1) % polaroids.length
        goToSlide(next, polaroids)
    }, 4000)
}

function goToSlide(index, polaroids) {
    // Remove all states
    polaroids.forEach(p => {
        p.classList.remove('active', 'prev')
    })

    // Mark previous slide
    polaroids[currentSlide].classList.add('prev')

    // Activate new slide
    currentSlide = index
    polaroids[currentSlide].classList.add('active')
}

function resetAutoSlide(polaroids) {
    clearInterval(slideInterval)
    slideInterval = setInterval(() => {
        const next = (currentSlide + 1) % polaroids.length
        goToSlide(next, polaroids)
    }, 4000)
}

// ==========================================
// Music crossfade between sections
// ==========================================
let activeMusic = 'song1' // 'song1' or 'song2'
const music1 = document.getElementById('bg-music')
const music2 = document.getElementById('bg-music-2')
music2.volume = 0

function crossfadeTo(target) {
    if (target === activeMusic) return
    if (!musicPlaying) {
        activeMusic = target
        return
    }

    const fadeOut = target === 'song2' ? music1 : music2
    const fadeIn = target === 'song2' ? music2 : music1
    activeMusic = target

    // Start the new song
    fadeIn.volume = 0
    fadeIn.play().catch(() => {})

    // Smooth crossfade over 1 second
    const steps = 20
    const interval = 50 // 20 steps × 50ms = 1 second
    let step = 0

    const fadeTimer = setInterval(() => {
        step++
        const progress = step / steps
        fadeOut.volume = Math.max(0, 0.3 * (1 - progress))
        fadeIn.volume = Math.min(0.3, 0.3 * progress)

        if (step >= steps) {
            clearInterval(fadeTimer)
            fadeOut.pause()
        }
    }, interval)
}

// Watch for photos section scroll
const photosSection = document.querySelector('.photos-section')
const heroSection = document.querySelector('.hero-section')

if (photosSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.target === photosSection && entry.isIntersecting) {
                crossfadeTo('song2')
            }
        })
    }, { threshold: 0.3 })

    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.target === heroSection && entry.isIntersecting) {
                crossfadeTo('song1')
            }
        })
    }, { threshold: 0.3 })

    observer.observe(photosSection)
    if (heroSection) heroObserver.observe(heroSection)
}

function toggleMusic() {
    const current = activeMusic === 'song1' ? music1 : music2
    if (musicPlaying) {
        music1.pause()
        music2.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        current.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}
