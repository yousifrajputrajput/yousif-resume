/* ============ CONSTELLATION NETWORK INTRO ============ */
(function () {
    const canvas = document.getElementById('warpCanvas');
    const ctx = canvas.getContext('2d');
    const intro = document.getElementById('warpIntro');
    const warpText = document.querySelector('.warp-text');
    let w, h, particles = [];
    const particleCount = 150;
    const connectionDist = 150;
    let startTime = Date.now();

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();
    document.body.classList.add('intro-active');

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 2 + 1
        });
    }

    let mouse = { x: null, y: null };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function animate() {
        const elapsed = Date.now() - startTime;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, w, h);

        // Add mouse as a particle for connections
        let allParticles = [...particles];
        if (mouse.x !== null) {
            allParticles.push({ x: mouse.x, y: mouse.y, vx: 0, vy: 0, size: 0, isMouse: true });
        }

        for (let i = 0; i < allParticles.length; i++) {
            let p = allParticles[i];
            if (!p.isMouse) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;

                ctx.fillStyle = 'rgba(0, 210, 255, 0.8)';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }

            for (let j = i + 1; j < allParticles.length; j++) {
                let p2 = allParticles[j];
                let dx = p.x - p2.x;
                let dy = p.y - p2.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist) {
                    let opacity = 1 - dist / connectionDist;
                    ctx.strokeStyle = `rgba(0, 210, 255, ${opacity})`;
                    ctx.lineWidth = p.isMouse || p2.isMouse ? 1 : 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }

        // Show Text Phase
        if (elapsed > 1000) warpText.classList.add('visible');

        // End Phase
        if (elapsed > 5000) {
            intro.classList.add('done');
            document.body.classList.remove('intro-active');
            document.body.classList.add('intro-reveal');
            setTimeout(() => { 
                intro.style.display = 'none'; 
                if (typeof revealOnScroll === 'function') revealOnScroll();
            }, 1000);
            return;
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
})();

/* ============ CUSTOM CURSOR ============ */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
});

function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

// Cursor hover effect on interactive elements
document.querySelectorAll('a, button, .project-card, .skill-card, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorRing.style.width = '50px';
        cursorRing.style.height = '50px';
        cursorRing.style.borderColor = 'var(--accent)';
        cursorDot.style.transform = 'scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
        cursorRing.style.width = '36px';
        cursorRing.style.height = '36px';
        cursorRing.style.borderColor = 'var(--accent-light)';
        cursorDot.style.transform = 'scale(1)';
    });
});

// Hide cursor on mobile
if ('ontouchstart' in window) {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
}

/* ============ NAVBAR ============ */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

// Scroll effect
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = navLinks.querySelector(`a[href="#${id}"]`);
        if (link) {
            if (scrollY >= top && scrollY < top + height) {
                navLinks.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
});

/* ============ SCROLL REVEAL ============ */
const revealElements = document.querySelectorAll('.reveal');
const revealOnScroll = () => {
    revealElements.forEach(el => {
        const top = el.getBoundingClientRect().top;
        const trigger = window.innerHeight * 0.85;
        if (top < trigger) {
            el.classList.add('active');
        }
    });
};
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

/* ============ COUNTER ANIMATION ============ */
const counters = document.querySelectorAll('.stat-num[data-target]');
let counterStarted = false;

const startCounters = () => {
    if (counterStarted) return;
    const aboutSection = document.getElementById('about');
    if (!aboutSection) return;
    const top = aboutSection.getBoundingClientRect().top;
    if (top < window.innerHeight * 0.8) {
        counterStarted = true;
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            const update = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current) + '+';
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target + '+';
                }
            };
            update();
        });
    }
};
window.addEventListener('scroll', startCounters);

/* ============ SKILL BARS ANIMATION ============ */
let skillsAnimated = false;
const animateSkills = () => {
    if (skillsAnimated) return;
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;
    const top = skillsSection.getBoundingClientRect().top;
    if (top < window.innerHeight * 0.8) {
        skillsAnimated = true;
        document.querySelectorAll('.skill-level-bar').forEach(bar => {
            const width = bar.getAttribute('data-width');
            setTimeout(() => { bar.style.width = width; }, 300);
        });
    }
};
window.addEventListener('scroll', animateSkills);

/* ============ TYPING EFFECT ============ */
const heroTitle = document.querySelector('.hero h1');
if (heroTitle) {
    const roles = ['Full-Stack Developer', 'UI/UX Designer', 'Problem Solver', 'Creative Coder'];
    let roleIndex = 0, charIndex = 0, isDeleting = false;

    // Create typing span if not exists
    let typingSpan = document.getElementById('typingText');
    if (!typingSpan) {
        typingSpan = document.createElement('span');
        typingSpan.id = 'typingText';
        typingSpan.className = 'gradient-text';
        typingSpan.style.borderRight = '2px solid var(--accent)';
        typingSpan.style.paddingRight = '4px';
        typingSpan.style.animation = 'blink 1s infinite';

        // Replace the existing gradient text
        const existingGradient = heroTitle.querySelector('.gradient-text');
        if (existingGradient) {
            existingGradient.replaceWith(typingSpan);
        }
    }

    function typeEffect() {
        const current = roles[roleIndex];
        if (isDeleting) {
            typingSpan.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingSpan.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === current.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 400;
        }

        setTimeout(typeEffect, speed);
    }

    setTimeout(typeEffect, 1500);
}

/* ============ SMOOTH SCROLL ============ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* ============ CONTACT FORM ============ */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>&nbsp; Sending...';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i>&nbsp; Message Sent!';
            btn.style.background = 'linear-gradient(135deg, #00ff88, #00d4ff)';

            contactForm.reset();

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }, 1500);
    });
}

/* ============ PARALLAX ON HERO ============ */
window.addEventListener('scroll', () => {
    const heroGlow = document.querySelector('.hero-glow');
    if (heroGlow) {
        const scroll = window.scrollY;
        heroGlow.style.transform = `translateX(-50%) translateY(${scroll * 0.3}px)`;
    }
});

/* ============ TILT EFFECT ON PROJECT CARDS ============ */
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});
