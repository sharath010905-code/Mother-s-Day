const envelope = document.getElementById('envelope');
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let isAnimating = false;

class Particle {
    constructor() {
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight / 2 + 50;
        this.vx = (Math.random() - 0.5) * 12;
        this.vy = (Math.random() - 1) * 12 - 2;
        this.size = Math.random() * 10 + 5;
        let p = Math.random();
        if (p < 0.4) {
            this.type = 'heart';
            this.color = ['#ff6b6b', '#ff9b9b'][Math.floor(Math.random() * 2)];
        } else if (p < 0.8) {
            this.type = 'petal';
            this.color = ['#ffd1dc', '#ffb7b2', '#ffdac1', '#ffffff'][Math.floor(Math.random() * 4)];
            this.size = Math.random() * 15 + 10;
        } else {
            this.type = 'circle';
            this.color = ['#f6d365', '#ffffff', '#fda085'][Math.floor(Math.random() * 3)];
        }
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 15;
        this.opacity = 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.type === 'petal') {
            this.vy += 0.05;
            this.vx += Math.sin(this.y * 0.01) * 0.2;
        } else {
            this.vy += 0.15;
        }
        this.rotation += this.rotationSpeed;
        this.opacity -= 0.004;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        
        if (this.type === 'heart') {
            ctx.beginPath();
            let topCurveHeight = this.size * 0.3;
            ctx.moveTo(0, topCurveHeight);
            ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
            ctx.bezierCurveTo(-this.size / 2, this.size / 2, 0, this.size * 0.8, 0, this.size);
            ctx.bezierCurveTo(0, this.size * 0.8, this.size / 2, this.size / 2, this.size / 2, topCurveHeight);
            ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
            ctx.closePath();
            ctx.fill();
        } else if (this.type === 'petal') {
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size / 2, this.size, 0, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        if (particles[i].opacity <= 0 || particles[i].y > canvas.height) {
            particles.splice(i, 1);
            i--;
        }
    }
    
    if (particles.length > 0) {
        requestAnimationFrame(animateParticles);
    } else {
        isAnimating = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function explodeHearts() {
    if (isAnimating) return;
    isAnimating = true;
    for (let i = 0; i < 250; i++) {
        particles.push(new Particle());
    }
    animateParticles();
}

envelope.addEventListener('click', () => {
    if (!envelope.classList.contains('open')) {
        envelope.classList.add('open');
        
        // Explode hearts slightly after flap opens
        setTimeout(() => {
            explodeHearts();
        }, 300);
        
        // After letter pulls out, expand it
        setTimeout(() => {
            envelope.classList.add('fullscreen-letter');
        }, 1200);
    }
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const firefliesCanvas = document.getElementById('fireflies');
    if(firefliesCanvas) {
        firefliesCanvas.width = window.innerWidth;
        firefliesCanvas.height = window.innerHeight;
    }
});

// Fireflies background
const firefliesCanvas = document.getElementById('fireflies');
if (firefliesCanvas) {
    const fctx = firefliesCanvas.getContext('2d');
    firefliesCanvas.width = window.innerWidth;
    firefliesCanvas.height = window.innerHeight;

    let fireflies = [];
    for(let i=0; i<60; i++) {
        fireflies.push({
            x: Math.random() * firefliesCanvas.width,
            y: Math.random() * firefliesCanvas.height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            size: Math.random() * 2 + 1,
            alpha: Math.random() * 0.5 + 0.3
        });
    }
    
    function animateFireflies() {
        fctx.clearRect(0, 0, firefliesCanvas.width, firefliesCanvas.height);
        for(let f of fireflies) {
            f.x += f.vx;
            f.y += f.vy;
            if(f.x < 0 || f.x > firefliesCanvas.width) f.vx *= -1;
            if(f.y < 0 || f.y > firefliesCanvas.height) f.vy *= -1;
            
            fctx.beginPath();
            fctx.arc(f.x, f.y, f.size, 0, Math.PI*2);
            fctx.fillStyle = `rgba(255, 230, 150, ${f.alpha + Math.sin(Date.now() * 0.003 + f.x) * 0.2})`;
            fctx.shadowBlur = 8;
            fctx.shadowColor = '#fff5cc';
            fctx.fill();
        }
        requestAnimationFrame(animateFireflies);
    }
    animateFireflies();
}

// 3D Tilt effect
envelope.addEventListener('mousemove', (e) => {
    if(envelope.classList.contains('open')) return;
    const rect = envelope.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xPct = x / rect.width - 0.5;
    const yPct = y / rect.height - 0.5;
    
    envelope.style.transform = `perspective(1000px) rotateY(${xPct * 8}deg) rotateX(${-yPct * 8}deg) translateY(-2px)`;
});

envelope.addEventListener('mouseleave', () => {
    if(!envelope.classList.contains('open')) {
        envelope.style.transform = '';
    }
});
