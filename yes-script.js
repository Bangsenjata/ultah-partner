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
    const colors = ['#FFD700', '#FF6B6B', '#A855F7', '#06B6D4', '#FF85A2', '#FFA500', '#fff', '#F472B6']
    const isMobile = window.innerWidth < 600

    // Initial big burst (smaller on mobile)
    confetti({
        particleCount: isMobile ? 80 : 200,
        spread: isMobile ? 80 : 120,
        origin: { x: 0.5, y: 0.3 },
        colors
    })

    // Continuous side cannons — less frequent and fewer on mobile
    const count = isMobile ? 10 : 25
    const interval = isMobile ? 700 : 400

    setInterval(() => {
        confetti({
            particleCount: count,
            angle: 60,
            spread: 55,
            origin: { x: 0, y: 0.6 },
            colors
        })

        confetti({
            particleCount: count,
            angle: 120,
            spread: 55,
            origin: { x: 1, y: 0.6 },
            colors
        })
    }, interval)
}

// --- Slideshow ---
function startSlideshow() {
    const polaroids = document.querySelectorAll('.polaroid')
    const dots = document.querySelectorAll('.dot')
    if (polaroids.length === 0) return

    // Click on dots to jump to slide
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.index), polaroids, dots)
            resetAutoSlide(polaroids, dots)
        })
    })

    // Prev/Next buttons
    const prevBtn = document.getElementById('slide-prev')
    const nextBtn = document.getElementById('slide-next')

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const prev = (currentSlide - 1 + polaroids.length) % polaroids.length
            goToSlide(prev, polaroids, dots)
            resetAutoSlide(polaroids, dots)
        })
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const next = (currentSlide + 1) % polaroids.length
            goToSlide(next, polaroids, dots)
            resetAutoSlide(polaroids, dots)
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
                    goToSlide(next, polaroids, dots)
                } else {
                    // Swiped right → prev
                    const prev = (currentSlide - 1 + polaroids.length) % polaroids.length
                    goToSlide(prev, polaroids, dots)
                }
                resetAutoSlide(polaroids, dots)
            }
        }, { passive: true })
    }

    // Auto-cycle every 4 seconds
    slideInterval = setInterval(() => {
        const next = (currentSlide + 1) % polaroids.length
        goToSlide(next, polaroids, dots)
    }, 4000)
}

function goToSlide(index, polaroids, dots) {
    // Remove all states
    polaroids.forEach(p => {
        p.classList.remove('active', 'prev')
    })
    dots.forEach(d => d.classList.remove('active'))

    // Mark previous slide
    polaroids[currentSlide].classList.add('prev')

    // Activate new slide
    currentSlide = index
    polaroids[currentSlide].classList.add('active')
    dots[currentSlide].classList.add('active')
}

function resetAutoSlide(polaroids, dots) {
    clearInterval(slideInterval)
    slideInterval = setInterval(() => {
        const next = (currentSlide + 1) % polaroids.length
        goToSlide(next, polaroids, dots)
    }, 4000)
}

function toggleMusic() {
    const music = document.getElementById('bg-music')
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}
