// Festive particle system — floating emojis, sparkles, and glowing orbs
(function () {
    const container = document.querySelector('.floating-bg')
    if (!container) return

    const isMobile = window.innerWidth < 600
    const emojis = ['🌸', '✨', '🎁', '⭐', '🎂', '🎉', '🎀', '🥳', '💫', '🌷', '🧁', '💖', '🌺']
    const sparkleColors = ['#FFB6C1', '#FF69B4', '#FF1493', '#DB7093', '#FFC0CB', '#F472B6', '#fff']
    const orbColors = [
        'rgba(219, 112, 147, 0.12)',
        'rgba(255, 105, 180, 0.1)',
        'rgba(255, 182, 193, 0.1)',
        'rgba(199, 21, 133, 0.08)',
        'rgba(244, 114, 182, 0.1)'
    ]

    // --- Floating emojis ---
    function spawnEmoji() {
        const el = document.createElement('span')
        el.className = 'float-particle'
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)]
        el.style.left = Math.random() * 100 + '%'
        el.style.fontSize = (0.8 + Math.random() * (isMobile ? 0.8 : 1.4)) + 'rem'
        el.style.opacity = 0.15 + Math.random() * 0.2

        const duration = 10 + Math.random() * 12
        el.style.animationDuration = duration + 's'
        el.style.animationDelay = Math.random() * 2 + 's'

        container.appendChild(el)

        // Remove after one cycle to prevent memory buildup
        setTimeout(() => el.remove(), (duration + 3) * 1000)
    }

    // Spawn initial batch (fewer on mobile)
    const initialEmojis = isMobile ? 6 : 15
    for (let i = 0; i < initialEmojis; i++) {
        setTimeout(() => spawnEmoji(), Math.random() * 4000)
    }

    // Keep spawning (slower on mobile)
    setInterval(spawnEmoji, isMobile ? 3000 : 1200)

    // --- Sparkle dots ---
    function spawnSparkle() {
        const el = document.createElement('div')
        el.className = 'sparkle'
        el.style.left = Math.random() * 100 + '%'
        el.style.top = Math.random() * 100 + '%'
        el.style.background = sparkleColors[Math.floor(Math.random() * sparkleColors.length)]

        const size = 2 + Math.random() * 4
        el.style.width = size + 'px'
        el.style.height = size + 'px'

        const duration = 1.5 + Math.random() * 2.5
        el.style.animationDuration = duration + 's'
        el.style.animationDelay = Math.random() * 2 + 's'

        container.appendChild(el)

        setTimeout(() => el.remove(), (duration + 3) * 1000)
    }

    // Spawn initial batch of sparkles (fewer on mobile)
    const initialSparkles = isMobile ? 8 : 20
    for (let i = 0; i < initialSparkles; i++) {
        setTimeout(() => spawnSparkle(), Math.random() * 3000)
    }

    // Keep spawning sparkles (slower on mobile)
    setInterval(spawnSparkle, isMobile ? 1500 : 600)

    // --- Glowing orbs (static, ambient) ---
    const orbPositions = [
        { left: '10%', top: '20%', size: 120 },
        { left: '80%', top: '70%', size: 100 },
        { left: '50%', top: '10%', size: 80 },
        { left: '25%', top: '80%', size: 140 },
        { left: '70%', top: '30%', size: 90 },
    ]

    orbPositions.forEach((pos, i) => {
        const el = document.createElement('div')
        el.className = 'glow-orb'
        el.style.left = pos.left
        el.style.top = pos.top
        el.style.width = pos.size + 'px'
        el.style.height = pos.size + 'px'
        el.style.background = orbColors[i % orbColors.length]
        el.style.animationDuration = (4 + Math.random() * 4) + 's'
        el.style.animationDelay = (Math.random() * 3) + 's'
        container.appendChild(el)
    })
})()
