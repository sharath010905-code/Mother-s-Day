/* ============================================================
   SCRIPT.JS  –  Putta Mother's Day Website
   ============================================================ */

// ---- Elements ----
const envelopeBox  = document.getElementById('envelopeBox');
const envFlap      = document.getElementById('envFlap');
const letterPeek   = document.getElementById('letterPeek');
const seal         = document.getElementById('seal');
const hint         = document.getElementById('hint');
const landing      = document.getElementById('landing');
const letterPage   = document.getElementById('letterPage');
const confettiCvs  = document.getElementById('confetti');
const firefliesCvs = document.getElementById('fireflies');
const cCtx         = confettiCvs.getContext('2d');
const fCtx         = firefliesCvs.getContext('2d');

// ---- Resize canvases ----
function resizeCanvases() {
    confettiCvs.width  = firefliesCvs.width  = window.innerWidth;
    confettiCvs.height = firefliesCvs.height = window.innerHeight;
}
resizeCanvases();
window.addEventListener('resize', resizeCanvases);

// ============================================================
//  FIREFLIES
// ============================================================
const fireflies = Array.from({ length: 55 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.7,
    vy: (Math.random() - 0.5) * 0.7,
    r: Math.random() * 1.8 + 0.6,
    phase: Math.random() * Math.PI * 2
}));

function drawFireflies() {
    fCtx.clearRect(0, 0, firefliesCvs.width, firefliesCvs.height);
    const t = Date.now() * 0.002;
    for (const f of fireflies) {
        f.x += f.vx; f.y += f.vy;
        if (f.x < 0 || f.x > firefliesCvs.width)  f.vx *= -1;
        if (f.y < 0 || f.y > firefliesCvs.height) f.vy *= -1;
        const alpha = 0.3 + 0.4 * Math.abs(Math.sin(t + f.phase));
        fCtx.beginPath();
        fCtx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        fCtx.fillStyle = `rgba(255,222,130,${alpha})`;
        fCtx.shadowBlur = 7;
        fCtx.shadowColor = '#ffe080';
        fCtx.fill();
    }
    requestAnimationFrame(drawFireflies);
}
drawFireflies();

// ============================================================
//  CONFETTI / PETALS
// ============================================================
let particles = [];
let confettiRunning = false;

class Particle {
    constructor() {
        this.x  = window.innerWidth  / 2 + (Math.random() - 0.5) * 60;
        this.y  = window.innerHeight / 2 + (Math.random() - 0.5) * 60;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = -(Math.random() * 10 + 2);
        this.alpha = 1;
        this.rot = Math.random() * 360;
        this.rotV = (Math.random() - 0.5) * 6;

        const r = Math.random();
        if (r < 0.4) {
            this.type  = 'heart';
            this.size  = Math.random() * 8 + 5;
            this.color = ['#e8a0a0','#f4b8b8','#ffd1d1'][Math.floor(Math.random()*3)];
        } else if (r < 0.75) {
            this.type  = 'petal';
            this.w     = Math.random() * 10 + 8;
            this.h     = Math.random() * 18 + 12;
            this.color = ['#ffd1dc','#ffd6e7','#ffecf1','#fff0f3'][Math.floor(Math.random()*4)];
        } else {
            this.type  = 'dot';
            this.size  = Math.random() * 6 + 3;
            this.color = ['#f6d365','#fda085','#fff'][Math.floor(Math.random()*3)];
        }
    }

    update() {
        this.x  += this.vx;
        this.vy += this.type === 'petal' ? 0.08 : 0.18;
        this.y  += this.vy;
        this.rot += this.rotV;
        this.alpha -= this.type === 'petal' ? 0.003 : 0.005;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot * Math.PI / 180);
        ctx.globalAlpha = Math.max(this.alpha, 0);
        ctx.fillStyle = this.color;

        if (this.type === 'heart') {
            const s = this.size;
            ctx.beginPath();
            ctx.moveTo(0, s * 0.3);
            ctx.bezierCurveTo(0, 0, -s/2, 0, -s/2, s*0.3);
            ctx.bezierCurveTo(-s/2, s*0.65, 0, s*0.9, 0, s);
            ctx.bezierCurveTo(0, s*0.9,  s/2, s*0.65,  s/2, s*0.3);
            ctx.bezierCurveTo(s/2, 0, 0, 0, 0, s*0.3);
            ctx.fill();
        } else if (this.type === 'petal') {
            ctx.beginPath();
            ctx.ellipse(0, 0, this.w/2, this.h/2, 0, 0, Math.PI*2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, this.size/2, 0, Math.PI*2);
            ctx.fill();
        }
        ctx.restore();
    }
}

function runConfetti() {
    particles = Array.from({ length: 220 }, () => new Particle());
    confettiRunning = true;
    animateConfetti();
}

function animateConfetti() {
    cCtx.clearRect(0, 0, confettiCvs.width, confettiCvs.height);
    particles = particles.filter(p => p.alpha > 0 && p.y < confettiCvs.height + 60);
    particles.forEach(p => { p.update(); p.draw(cCtx); });
    if (particles.length) requestAnimationFrame(animateConfetti);
    else confettiRunning = false;
}

// ============================================================
//  ENVELOPE OPEN SEQUENCE
// ============================================================
let opened = false;

envelopeBox.addEventListener('click', openEnvelope);

function openEnvelope() {
    if (opened) return;
    opened = true;

    // 1. Hide hint
    hint.classList.add('hide');
    seal.classList.add('hide');

    // 2. Open flap
    envFlap.classList.add('open');

    // 3. Lift letter peek
    setTimeout(() => {
        letterPeek.classList.add('lift');
    }, 350);

    // 4. Trigger confetti
    setTimeout(() => {
        runConfetti();
    }, 500);

    // 5. Switch to letter page
    setTimeout(() => {
        landing.classList.add('fade-out');
        setTimeout(() => {
            landing.style.display = 'none';
            letterPage.classList.remove('hidden');

            // Staggered text reveal
            const anims = letterPage.querySelectorAll('.anim');
            anims.forEach((el, i) => {
                const delay = 200 + i * 350;
                setTimeout(() => el.classList.add('visible'), delay);
            });
        }, 600);
    }, 900);
}

// ============================================================
//  3D TILT (Desktop only, won't cause mobile issues)
// ============================================================
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    envelopeBox.addEventListener('mousemove', (e) => {
        if (opened) return;
        const r  = envelopeBox.getBoundingClientRect();
        const xP = (e.clientX - r.left) / r.width  - 0.5;
        const yP = (e.clientY - r.top)  / r.height - 0.5;
        envelopeBox.style.transform = `perspective(900px) rotateY(${xP*10}deg) rotateX(${-yP*10}deg) translateY(-6px)`;
    });
    envelopeBox.addEventListener('mouseleave', () => {
        if (!opened) envelopeBox.style.transform = '';
    });
}
