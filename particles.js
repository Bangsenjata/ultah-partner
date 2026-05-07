// Festive particle system — floating emojis, sparkles, and glowing orbs
(function () {
    const container = document.querySelector('.floating-bg')
    if (!container) return

    const emojis = ['🎈', '✨', '🎁', '⭐', '🎂', '🎉', '🎀', '🥳', '💫', '🎊', '🧁', '🍰']
    const sparkleColors = ['#FFD700', '#A855F7', '#06B6D4', '#FF6B6B', '#F472B6', '#FFA500', '#fff']
    const orbColors = [
        'rgba(168, 85, 247, 0.12)',
        'rgba(255, 215, 0, 0.1)',
        'rgba(6, 182, 212, 0.1)',
        'rgba(255, 107, 107, 0.08)',
        'rgba(244, 114, 182, 0.1)'
    ]

    // --- Floating emojis ---
    function spawnEmoji() {
        const el = document.createElement('span')
        el.className = 'float-particle'
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)]
        el.style.left = Math.random() * 100 + '%'
        el.style.fontSize = (0.8 + Math.random() * 1.4) + 'rem'
        el.style.opacity = 0.15 + Math.random() * 0.2

        const duration = 10 + Math.random() * 12
        el.style.animationDuration = duration + 's'
        el.style.animationDelay = Math.random() * 2 + 's'

        container.appendChild(el)

        // Remove after one cycle to prevent memory buildup
        setTimeout(() => el.remove(), (duration + 3) * 1000)
    }

    // Spawn initial batch
    for (let i = 0; i < 15; i++) {
        setTimeout(() => spawnEmoji(), Math.random() * 4000)
    }

    // Keep spawning
    setInterval(spawnEmoji, 1200)

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

    // Spawn initial batch of sparkles
    for (let i = 0; i < 20; i++) {
        setTimeout(() => spawnSparkle(), Math.random() * 3000)
    }

    // Keep spawning sparkles
    setInterval(spawnSparkle, 600)

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
