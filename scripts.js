gsap.registerPlugin(ScrollTrigger, TextPlugin, Draggable);
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 900,
        easing: 'power3.out',
        once: true,
        mirror: false,
        anchorPlacement: 'top-bottom',
        offset: 60,
    });
    const terminalWindow = document.createElement('div');
    terminalWindow.className = 'terminal-window';
    terminalWindow.id = 'terminal-window';
    terminalWindow.innerHTML = `
        <div class="terminal-header">
            <div class="terminal-title">sulav@portfolio: ~</div>
            <button class="terminal-button-close"></button>
        </div>
        <div class="terminal-body">
            <div class="terminal-output">Welcome to My Portfolio Terminal</div>
            <div class="terminal-output">Type 'help' for list of commands</div>
            <div class="terminal-prompt">
                <span class="terminal-prompt-user">sulav@portfolio</span><span class="terminal-prompt-path">~</span><span class="terminal-prompt-symbol">$</span>
                <input type="text" class="terminal-input" autofocus>
            </div>
        </div>
    `;
    document.body.appendChild(terminalWindow);
    const heroTerminalButton = document.getElementById('hero-terminal-button');
    const headerTerminalButton = document.getElementById('header-terminal-button');
    const terminalInput = terminalWindow.querySelector('.terminal-input');
    const terminalBody = terminalWindow.querySelector('.terminal-body');
    const terminalCloseButton = terminalWindow.querySelector('.terminal-button-close');
    Draggable.create("#terminal-window", {
        trigger: ".terminal-header",
        type: "x,y",
        bounds: "body",
        cursor: "grabbing",
        activeCursor: "grabbing",
        fastMode: true,
        edgeResistance: 0
    });
    const openTerminal = () => {
        terminalWindow.classList.add('active');
        gsap.fromTo(terminalWindow,
            { bottom: '-100%', opacity: 0, scale: 0.8 },
            { bottom: 0, opacity: 1, scale: 1, duration: 0.3, ease: 'back.out' }
        );
        setTimeout(() => terminalWindow.querySelector('.terminal-input').focus(), 50);
    };
    const closeTerminal = () => {
        gsap.to(terminalWindow, {
            bottom: '-100%',
            opacity: 0,
            scale: 0.8,
            duration: 0.3,
            ease: 'back.in',
            onComplete: () => {
                terminalWindow.classList.remove('active');
            }
        });
    };
    heroTerminalButton.addEventListener('click', openTerminal);
    headerTerminalButton.addEventListener('click', openTerminal);
    terminalCloseButton.addEventListener('click', closeTerminal);
    const primaryButtons = document.querySelectorAll('.btn-primary');
    primaryButtons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const ripple = document.createElement('div');
            ripple.className = 'btn-ripple';
            ripple.style.position = 'absolute';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = '0px';
            ripple.style.height = '0px';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'radial-gradient(circle, rgba(255,255,255,0.6), rgba(255,255,255,0.1))';
            ripple.style.pointerEvents = 'none';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.zIndex = '10';
            button.appendChild(ripple);
            ripple.offsetHeight;
            ripple.animate([
                { width: '0px', height: '0px', opacity: '1' },
                { width: '400px', height: '400px', opacity: '0' }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                ripple.remove();
            };
        });
    });
    const skillCards = document.querySelectorAll('.skill-card');
    let activeTooltip = null;
    let exitTimeouts = new Map();
    let activeCardHandlers = new Map();
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            if (exitTimeouts.has(card)) {
                clearTimeout(exitTimeouts.get(card));
                exitTimeouts.delete(card);
            }
            card.classList.remove('exiting');
            card.classList.add('hovering');
            const description = card.querySelector('p')?.textContent;
            if (!description) return;
            if (activeTooltip) {
                activeTooltip.remove();
            }
            const tooltip = document.createElement('div');
            tooltip.className = 'skill-tooltip';
            tooltip.textContent = description;
            document.body.appendChild(tooltip);
            activeTooltip = tooltip;
            const updateTooltipPosition = (event) => {
                if (tooltip.parentElement) {
                    tooltip.style.left = (event.clientX + 15) + 'px';
                    tooltip.style.top = (event.clientY + 15) + 'px';
                }
            };
            card.addEventListener('mousemove', updateTooltipPosition);
            activeCardHandlers.set(card, updateTooltipPosition);
            updateTooltipPosition(e);
        });
        card.addEventListener('mouseleave', () => {
            const handler = activeCardHandlers.get(card);
            if (handler) {
                card.removeEventListener('mousemove', handler);
                activeCardHandlers.delete(card);
            }
            if (activeTooltip) {
                activeTooltip.remove();
                activeTooltip = null;
            }
            card.classList.remove('hovering');
            card.classList.add('exiting');
            const timeout = setTimeout(() => {
                card.classList.remove('exiting');
                exitTimeouts.delete(card);
            }, 800);
            exitTimeouts.set(card, timeout);
        });
    });
    const aboutTexts = document.querySelectorAll('.about-text');
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px'
    };
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const rect = entry.target.getBoundingClientRect();
                const scrollPercent = Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height));
                entry.target.style.opacity = 0.65 + (scrollPercent * 0.35);
            }
        });
    }, observerOptions);
    aboutTexts.forEach(text => {
        textObserver.observe(text);
    });
    window.addEventListener('scroll', () => {
        aboutTexts.forEach(text => {
            const rect = text.getBoundingClientRect();
            const scrollPercent = Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height));
            text.style.opacity = 0.65 + (scrollPercent * 0.35);
        });
    }, { passive: true });
    terminalInput.addEventListener('keydown', (e) => handleCommand(e, terminalBody, commands));
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const closeMobileMenuButton = document.getElementById('close-mobile-menu');
    const header = document.querySelector('header');
    const currentYearSpan = document.getElementById('current-year');
    const musicButton = document.getElementById('header-music-button');
    const allNavLinks = document.querySelectorAll('a[href^="#"]');
    const animatedTagline = document.getElementById('animated-tagline');
    const pfpImage = document.querySelector('.pfp-image');
    const audio = new Audio('forest-lofi.mp3');
    audio.loop = true;
    audio.volume = 0.6;
    let isPlaying = false;
    const taglinePhrases = ["A Passionate Creator", "A Chess Player", "A C++ Dev", "A Web Dev", "A Book Enjoyer"];
    let currentPhraseIndex = 0;
    const animateTagline = () => {
        gsap.to(animatedTagline, {
            opacity: 0,
            y: -10,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => {
                currentPhraseIndex = (currentPhraseIndex + 1) % taglinePhrases.length;
                animatedTagline.textContent = taglinePhrases[currentPhraseIndex];
                gsap.fromTo(animatedTagline,
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
                );
            }
        });
    };
    setInterval(animateTagline, 3000);
    const tl = gsap.timeline({defaults: { ease: "power4.out" }});
    tl.to('.hero-line', { y: 0, duration: 0.8, stagger: 0.15, delay: 0.3 });
    tl.fromTo('#hero-button-container', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.7 }, "-=0.5");
    tl.fromTo('.animate-scroll-arrow', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.4");
    gsap.to('.animate-scroll-arrow', { y: -10, duration: 1.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    if (musicButton) {
        musicButton.addEventListener('click', () => {
            isPlaying = !isPlaying;
            if (isPlaying) {
                audio.play().catch(error => {
                    console.error("Audio playback failed:", error);
                    isPlaying = false;
                    musicButton.classList.remove('playing');
                });
                musicButton.classList.add('playing');
            } else {
                audio.pause();
                musicButton.classList.remove('playing');
            }
        });
    }
    const closeMobileMenu = () => {
        if (!mobileMenuOverlay) return;
        gsap.to(mobileMenuOverlay, { opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => { mobileMenuOverlay.classList.add('hidden'); document.body.style.overflow = ''; } });
    };
    const openMobileMenu = () => {
        if (!mobileMenuOverlay) return;
        mobileMenuOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        gsap.fromTo(mobileMenuOverlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
        gsap.from(mobileMenuOverlay.querySelectorAll('a'), { y: 20, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'power2.out' });
    };
    if (mobileMenuButton) mobileMenuButton.addEventListener('click', openMobileMenu);
    if (closeMobileMenuButton) closeMobileMenuButton.addEventListener('click', closeMobileMenu);
    allNavLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    const offset = 80;
                    const targetY = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({
                        top: targetY,
                        behavior: 'smooth'
                    });
                    if (mobileMenuOverlay && !mobileMenuOverlay.classList.contains('hidden')) {
                        closeMobileMenu();
                    }
                }
            }
        });
    });
    window.addEventListener('scroll', () => {
        if (header) {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }
    }, { passive: true });
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
    if (pfpImage) {
        pfpImage.classList.add('idle-animation');
    }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    document.getElementById('three-bg').appendChild(renderer.domElement);
    const particles = new THREE.Group();
    scene.add(particles);
    const particleCount = 180;
    const particleVertices = [];
    const particleSize = 0.36;
    const connectionDistance = 18;
    const maxOpacity = 0.065;
    const colors = [
        new THREE.Color(0x89b482),
        new THREE.Color(0x7fbbb3),
        new THREE.Color(0xe69875),
        new THREE.Color(0xa79a83)
    ];
    const particleMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    const particleGeometry = new THREE.SphereGeometry(particleSize, 8, 8);
    for (let i = 0; i < particleCount; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
        particle.material.color = color;
        particle.material.opacity = Math.random() * 0.5 + 0.1;
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 200;
        const z = (Math.random() - 0.5) * 200;
        particle.position.set(x, y, z);
        particle.userData.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01,
            (Math.random() - 0.5) * 0.01
        );
        particles.add(particle);
        particleVertices.push(particle.position);
    }
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array(particleCount * particleCount * 3);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x8cd5d0,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
    });
    const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineMesh);
    camera.position.z = 50;
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });
    function animate() {
        requestAnimationFrame(animate);
        particles.children.forEach(particle => {
            particle.position.add(particle.userData.velocity);
            if (Math.abs(particle.position.x) > 100) particle.position.x *= -1;
            if (Math.abs(particle.position.y) > 100) particle.position.y *= -1;
            if (Math.abs(particle.position.z) > 100) particle.position.z *= -1;
        });
        let lineIndex = 0;
        for(let i = 0; i < particleCount; i++) {
            for(let j = i + 1; j < particleCount; j++) {
                const dist = particleVertices[i].distanceTo(particleVertices[j]);
                if(dist < connectionDistance) {
                    linePositions[lineIndex++] = particleVertices[i].x;
                    linePositions[lineIndex++] = particleVertices[i].y;
                    linePositions[lineIndex++] = particleVertices[i].z;
                    linePositions[lineIndex++] = particleVertices[j].x;
                    linePositions[lineIndex++] = particleVertices[j].y;
                    linePositions[lineIndex++] = particleVertices[j].z;
                }
            }
        }
        lineGeometry.setDrawRange(0, lineIndex / 3);
        lineGeometry.attributes.position.needsUpdate = true;
        const time = Date.now() * 0.0002;
        lineMesh.material.opacity = (Math.sin(time) * 0.25 + 0.75) * maxOpacity;
        camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 10 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize);
    animate();
});