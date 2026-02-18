/* ============================================================
   V.V CONSTRUCTION & SALES — MAIN JAVASCRIPT
   ============================================================ */

'use strict';

/* ---- PAGE LOADER ---- */
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('page-loader');
        if (loader) loader.classList.add('hidden');
    }, 1900);
});

/* ---- SCROLL PROGRESS BAR ---- */
const scrollProgress = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = pct + '%';
}, { passive: true });

/* ---- CURSOR GLOW ---- */
const cursorGlow = document.getElementById('cursor-glow');
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorGlow) {
        cursorGlow.style.left = mouseX + 'px';
        cursorGlow.style.top = mouseY + 'px';
    }
});
// Expand glow on interactive elements
document.querySelectorAll('a, button, .service-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursorGlow) { cursorGlow.style.width = '60px'; cursorGlow.style.height = '60px'; }
    });
    el.addEventListener('mouseleave', () => {
        if (cursorGlow) { cursorGlow.style.width = '20px'; cursorGlow.style.height = '20px'; }
    });
});

/* ---- STICKY NAVBAR ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }
}, { passive: true });

/* ---- HAMBURGER MENU ---- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
hamburger?.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
});
// Close on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks?.classList.remove('open');
        hamburger?.classList.remove('open');
        hamburger?.setAttribute('aria-expanded', 'false');
    });
});

/* ---- DARK MODE TOGGLE ---- */
const darkToggle = document.getElementById('dark-mode-toggle');
const toggleIcon = darkToggle?.querySelector('.toggle-icon');
let isDark = localStorage.getItem('vv-dark') === 'true';
if (isDark) { document.body.classList.add('dark-mode'); if (toggleIcon) toggleIcon.textContent = '🌙'; }

darkToggle?.addEventListener('click', () => {
    isDark = !isDark;
    document.body.classList.toggle('dark-mode', isDark);
    if (toggleIcon) toggleIcon.textContent = isDark ? '🌙' : '☀️';
    localStorage.setItem('vv-dark', isDark);
});

/* ---- PARTICLE CANVAS ---- */
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const PARTICLE_COUNT = 70;
    const GOLD = 'rgba(200,161,59,';

    function createParticle() {
        return {
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 2 + 0.5,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -Math.random() * 0.6 - 0.2,
            alpha: Math.random() * 0.5 + 0.1,
        };
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());

    function drawLine(a, b) {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist > 120) return;
        ctx.beginPath();
        ctx.strokeStyle = GOLD + (0.15 * (1 - dist / 120)) + ')';
        ctx.lineWidth = 0.5;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
    }

    function animate() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.y < -5 || p.x < -5 || p.x > W + 5) {
                particles[i] = createParticle();
                particles[i].y = H + 5;
            }
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = GOLD + p.alpha + ')';
            ctx.fill();
            for (let j = i + 1; j < particles.length; j++) drawLine(p, particles[j]);
        });
        requestAnimationFrame(animate);
    }
    animate();
})();

/* ---- PARALLAX HERO ---- */
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
    if (!hero) return;
    const offset = window.scrollY;
    hero.style.backgroundPositionY = `calc(50% + ${offset * 0.3}px)`;
}, { passive: true });

/* ---- SCROLL REVEAL (IntersectionObserver) ---- */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

/* ---- ANIMATED COUNTERS ---- */
let countersStarted = false;
const countersSection = document.querySelector('.counters-grid');

function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();
    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
    }
    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;
            document.querySelectorAll('.counter-number').forEach(animateCounter);
            counterObserver.disconnect();
        }
    });
}, { threshold: 0.3 });
if (countersSection) counterObserver.observe(countersSection);

/* ---- PROJECT GALLERY FILTER ---- */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
            const cat = card.dataset.category;
            if (filter === 'all' || cat === filter) {
                card.style.display = '';
                setTimeout(() => card.classList.remove('hidden'), 10);
            } else {
                card.classList.add('hidden');
                setTimeout(() => { if (card.classList.contains('hidden')) card.style.display = 'none'; }, 400);
            }
        });
    });
});

/* ---- TESTIMONIAL SLIDER ---- */
const slides = document.querySelectorAll('.testimonial-slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prev-slide');
const nextBtn = document.getElementById('next-slide');
let currentSlide = 0;
let autoSlide;

function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function startAutoSlide() {
    autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
}
function resetAutoSlide() {
    clearInterval(autoSlide);
    startAutoSlide();
}

prevBtn?.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoSlide(); });
nextBtn?.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoSlide(); });
dots.forEach(dot => {
    dot.addEventListener('click', () => { goToSlide(parseInt(dot.dataset.index, 10)); resetAutoSlide(); });
});
if (slides.length > 0) startAutoSlide();

/* ---- RIPPLE EFFECT ---- */
document.querySelectorAll('.ripple').forEach(el => {
    el.addEventListener('click', function (e) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const wave = document.createElement('span');
        wave.classList.add('ripple-wave');
        wave.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top:  ${e.clientY - rect.top - size / 2}px;
    `;
        this.appendChild(wave);
        wave.addEventListener('animationend', () => wave.remove());
    });
});

/* ---- CONTACT FORM ---- */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('form-submit');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    setTimeout(() => {
        formSuccess.style.display = 'block';
        contactForm.reset();
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
        setTimeout(() => { formSuccess.style.display = 'none'; }, 5000);
    }, 1200);
});

/* ---- AI CHAT ASSISTANT ---- */
const chatBtn = document.getElementById('ai-chat-btn');
const chatWindow = document.getElementById('ai-chat-window');
const chatClose = document.getElementById('ai-chat-close');
const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMsgs = document.getElementById('chat-messages');
const quickReplies = document.getElementById('quick-replies');

// Knowledge base
const KB = {
    'cost estimate': `💰 **Construction Cost Estimates:**\n• Residential (per sq ft): ₹1,500 – ₹3,500\n• Commercial (per sq ft): ₹2,000 – ₹5,000\n• Renovation: ₹800 – ₹2,000\nFor a precise quote, please fill out our contact form or call us!`,
    'estimate': `💰 **Construction Cost Estimates:**\n• Residential (per sq ft): ₹1,500 – ₹3,500\n• Commercial (per sq ft): ₹2,000 – ₹5,000\n• Renovation: ₹800 – ₹2,000\nFor a precise quote, please fill out our contact form or call us!`,
    'material': `🧱 **Recommended Materials:**\n• **Structure:** TMT Steel, OPC Cement (43/53 grade)\n• **Walls:** AAC Blocks or Red Bricks\n• **Flooring:** Vitrified Tiles, Marble, or Hardwood\n• **Roofing:** RCC Slab with waterproofing membrane\nWe supply all premium materials — contact us for pricing!`,
    'suggest': `🧱 **Recommended Materials:**\n• **Structure:** TMT Steel, OPC Cement (43/53 grade)\n• **Walls:** AAC Blocks or Red Bricks\n• **Flooring:** Vitrified Tiles, Marble, or Hardwood\n• **Roofing:** RCC Slab with waterproofing membrane\nWe supply all premium materials — contact us for pricing!`,
    'appointment': `📅 **Book an Appointment:**\nYou can reach us at:\n📞 +91 12345 67890\n✉️ info@vvconstruction.com\n🕐 Mon–Sat: 9 AM – 6 PM\nOr fill out the contact form below and we'll call you back within 24 hours!`,
    'book': `📅 **Book an Appointment:**\nYou can reach us at:\n📞 +91 12345 67890\n✉️ info@vvconstruction.com\n🕐 Mon–Sat: 9 AM – 6 PM\nOr fill out the contact form below and we'll call you back within 24 hours!`,
    'service': `🏗️ **Our Services:**\n1. Residential Construction\n2. Commercial Projects\n3. Material Supply & Sales\n4. Renovation Services\n5. Architecture & Design\n6. Project Management\nWhich service would you like to know more about?`,
    'residential': `🏠 **Residential Construction:**\nWe build custom homes, villas, and apartment complexes with premium craftsmanship. Our team handles everything from foundation to finishing. Timeline: 8–18 months depending on size.`,
    'commercial': `🏢 **Commercial Projects:**\nFrom office towers to retail complexes, we deliver large-scale commercial builds on time and within budget. We handle all permits, inspections, and compliance.`,
    'renovation': `🔨 **Renovation Services:**\nWe transform existing spaces — kitchens, bathrooms, offices, and full home makeovers. Minimal disruption, maximum results. Get a free site visit today!`,
    'contact': `📞 **Contact V.V Construction:**\n📍 123 Construction Avenue, City – 400001\n📞 +91 12345 67890\n✉️ info@vvconstruction.com\n🕐 Mon–Sat: 9 AM – 6 PM`,
    'hello': `👋 Hello! Welcome to V.V Construction & Sales. How can I assist you today? You can ask me about cost estimates, materials, our services, or booking an appointment!`,
    'hi': `👋 Hi there! I'm the V.V AI Assistant. Ask me anything about our construction services, pricing, or materials!`,
    'thank': `😊 You're welcome! Feel free to ask if you have any more questions. We're here to help you build your dream!`,
};

function getAIResponse(msg) {
    const lower = msg.toLowerCase();
    for (const key of Object.keys(KB)) {
        if (lower.includes(key)) return KB[key];
    }
    return `🤔 I'm not sure about that specific query. For detailed assistance, please:\n📞 Call us: +91 12345 67890\n✉️ Email: info@vvconstruction.com\nOr fill out the contact form on this page!`;
}

function appendMsg(text, isUser) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + (isUser ? 'user' : 'bot');
    div.innerHTML = `
    ${!isUser ? '<span class="msg-avatar">🤖</span>' : ''}
    <div class="msg-bubble">${text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>
    ${isUser ? '<span class="msg-avatar">👤</span>' : ''}
  `;
    chatMsgs.appendChild(div);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

function sendMessage(text) {
    if (!text.trim()) return;
    if (quickReplies) quickReplies.style.display = 'none';
    appendMsg(text, true);
    chatInput.value = '';

    // Typing indicator
    const typing = document.createElement('div');
    typing.className = 'chat-msg bot';
    typing.innerHTML = '<span class="msg-avatar">🤖</span><div class="msg-bubble" style="opacity:0.5">Typing...</div>';
    chatMsgs.appendChild(typing);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;

    setTimeout(() => {
        typing.remove();
        appendMsg(getAIResponse(text), false);
    }, 900 + Math.random() * 400);
}

chatBtn?.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    chatWindow.setAttribute('aria-hidden', !chatWindow.classList.contains('open'));
    if (chatWindow.classList.contains('open')) chatInput?.focus();
});
chatClose?.addEventListener('click', () => {
    chatWindow.classList.remove('open');
    chatWindow.setAttribute('aria-hidden', 'true');
});
chatSend?.addEventListener('click', () => sendMessage(chatInput.value));
chatInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(chatInput.value); });
document.querySelectorAll('.quick-reply').forEach(btn => {
    btn.addEventListener('click', () => sendMessage(btn.dataset.msg));
});

/* ---- ACTIVE NAV LINK ON SCROLL ---- */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinkEls.forEach(link => {
                link.style.color = link.getAttribute('href') === '#' + id
                    ? 'var(--gold)'
                    : '';
            });
        }
    });
}, { threshold: 0.4 });
sections.forEach(s => sectionObserver.observe(s));

console.log('%c V.V Construction & Sales ', 'background:#0B1C2D;color:#C8A13B;font-size:16px;font-weight:bold;padding:8px 16px;border-radius:4px;');
console.log('%c Built with precision. ', 'color:#C8A13B;font-size:12px;');
