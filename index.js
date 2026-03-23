
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');

    // Optional: Toggle class on navbar to hide the header logo when menu is open
    document.querySelector('.navbar').classList.toggle('menu-open');

    if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});


// Close menu when clicking a link
const mobileLinks = document.querySelectorAll('.mobile-links a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});



(function () {
    "use strict";

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
        duration: 1.2,
        lerp: 0.1,
        smoothWheel: true
    });
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const pageCenter = document.querySelector(".page-center");
    const camera = document.querySelector(".camera");
    const videoContainer = document.querySelector(".video-container");
    const glassOverlay = document.querySelector(".glass-overlay");
    const title = document.querySelector(".glass-title");
    const navCenter = document.querySelector(".nav-center");
    const navLinks = document.querySelectorAll(".nav-link");
    const whyChooseSection = document.querySelector(".why-choose-section");
    const sectionTitle = document.querySelector(".section-title");
    const cardsWrapper = document.querySelector(".cards-wrapper");
    const bgVideoOverlay = document.querySelector(".bg-video-overlay");
    const premiumBtn = document.querySelector(".premium-button");

    gsap.set([cardsWrapper, videoContainer, glassOverlay, title], { force3D: true, z: 0.01 });

    document.body.appendChild(title);
    gsap.set(title, {
        position: "fixed", top: "50%", left: "50%",
        xPercent: -50, yPercent: -50,
        scale: 1, color: "#FEF8E8", zIndex: 10000
    });

    let moveX = 0, moveY = 0;
    function calculateLogoTarget() {
        const navRect = navCenter.getBoundingClientRect();
        moveX = navRect.left + navRect.width / 2 - window.innerWidth / 2;
        moveY = navRect.top + navRect.height / 2 - window.innerHeight / 2;
    }
    calculateLogoTarget();

    gsap.set(sectionTitle, { opacity: 0 });
    gsap.set(cardsWrapper, { y: "110vh", opacity: 0 });
    ScrollTrigger.create({
        trigger: pageCenter,
        start: "top top",
        end: "+=350%",
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true, // Add this line
        onUpdate(self) {
            const p = self.progress;

            // ================= HERO =================
            const heroFade = gsap.utils.clamp(0, 1, p / 0.25);
            gsap.set([".hero-left", ".hero-left-bottom", ".hero-right", ".window-frame"], {
                opacity: 1 - heroFade,
                pointerEvents: p > 0.25 ? "none" : "auto"
            });

            const camScale = gsap.utils.mapRange(0, 0.4, 1, 2.5, gsap.utils.clamp(0, 0.4, p));
            gsap.set(camera, { scale: camScale });

            // ================= LOGO =================
            const logoP = gsap.utils.clamp(0, 1, p / 0.4);
            let navColor = (p > 0.4 && p < 0.95) ? "#FFFFFF" : "#603000";

            gsap.set(navLinks, { color: navColor });
            gsap.set(title, {
                x: moveX * logoP,
                y: moveY * logoP,
                scale: 1 - 0.4 * logoP,
                color: navColor
            });


            // --- NAVBAR FOOTER COLOR CHANGE ---
            const footerSection = document.querySelector(".container"); // Your footer wrapper

            ScrollTrigger.create({
                trigger: footerSection,
                start: "top 10%", // When the top of footer is 10% from the top of the screen
                end: "bottom bottom",
                onEnter: () => {
                    gsap.to(navLinks, { color: "#FFFFFF", duration: 0.4 });
                },
                onLeaveBack: () => {
                    // Return to the original color when scrolling back up
                    // Adjust #603000 to whatever your primary dark color is
                    gsap.to(navLinks, { color: "#603000", duration: 0.4 });
                }
            });


            // ================= VIDEO (NO OVERLAY) =================
            if (p <= 0.4) {
                gsap.set(glassOverlay, { opacity: 1, visibility: "visible" });
                gsap.set(videoContainer, {
                    position: "absolute",
                    top: "7%", left: "12%", width: "76%", height: "85%",
                    borderRadius: "160px", filter: "blur(4px)", xPercent: 0, yPercent: 0
                });
            } else {
                const vidP = gsap.utils.clamp(0, 1, (p - 0.4) / 0.2);
                const glassFade = gsap.utils.clamp(0, 1, (p - 0.4) / 0.1);

                gsap.set(glassOverlay, {
                    opacity: 1 - glassFade,
                    visibility: glassFade >= 1 ? "hidden" : "visible"
                });

                gsap.set(videoContainer, {
                    position: "fixed",
                    top: "50%", left: "50%", xPercent: -50, yPercent: -50,
                    width: `${76 + vidP * 24}vw`, height: `${85 + vidP * 15}vh`,
                    borderRadius: `${160 - vidP * 160}px`,
                    filter: `blur(${4 + vidP * 76}px)`
                });
            }

            // ================= WHY CHOOSE (TITLE & CARDS) =================
            if (p > 0.4 && p < 0.99) {
                whyChooseSection.classList.add("active");
                gsap.set(whyChooseSection, { opacity: 1 });
                gsap.set([sectionTitle, ".cta-container"], { opacity: 1, visibility: "visible" });

                const spans = document.querySelectorAll(".section-title span");
                spans.forEach((span, idx) => {
                    const start = 0.42 + (idx * 0.03);
                    const txtP = gsap.utils.clamp(0, 1, (p - start) / 0.1);
                    const ease = gsap.parseEase("power2.out")(txtP);
                    gsap.set(span, { y: `${(1 - ease) * 110}%` });
                });

                const btnP = gsap.utils.clamp(0, 1, (p - 0.5) / 0.1);
                const btnEase = gsap.parseEase("power2.out")(btnP);
                gsap.set(premiumBtn, { y: `${(1 - btnEase) * 110}%` });

                const cardsStart = 0.55;
                const cP = gsap.utils.clamp(0, 1, (p - cardsStart) / (1 - cardsStart));
                const totalScrollDistance = (580 * 3.8) + window.innerHeight;

                gsap.set(cardsWrapper, {
                    opacity: 1,
                    y: window.innerHeight - (cP * totalScrollDistance)
                });

            } else if (p >= 0.99) {
                gsap.set(whyChooseSection, { opacity: 0 });
                whyChooseSection.classList.remove("active");
            } else {
                whyChooseSection.classList.remove("active");
                gsap.set([sectionTitle, cardsWrapper], { opacity: 0 });
            }
        }
    });


    window.addEventListener("resize", () => {
        calculateLogoTarget();
        ScrollTrigger.refresh();
    });
})();








// Catagory section
const data = [
    {
        title: "Kathyawadi",
        lines: [
            "Authentic Kathiyawadi cuisine with bold spices and rustic flavours.",
            "Traditional slow-cooked recipes using local ingredients."
        ],
        thumbs: ["img/d1.jpg", "img/d2.jpg", "img/d3.jpg"]
    },
    {
        title: "Punjabi",
        lines: [
            "Rich Punjabi dishes with creamy gravies and bold flavours.",
            "Comfort food inspired by North Indian traditions."
        ],
        thumbs: ["img/d1.jpg", "img/d2.jpg", "img/d3.jpg"]
    },
    {
        title: "Chinese",
        lines: [
            "Street-style Chinese with smoky wok-tossed flavours.",
            "Bold sauces and crunchy textures in every bite."
        ],
        thumbs: ["img/d1.jpg", "img/d2.jpg", "img/d3.jpg"]
    },
    {
        title: "Fast Food",
        lines: [
            "Crispy, cheesy fast food made fresh.",
            "Quick bites loved by all age groups."
        ],
        thumbs: ["img/d1.jpg", "img/d2.jpg", "img/d3.jpg"]
    }
];
const dishes = document.querySelectorAll(".dish");
const title = document.getElementById("catTitle");
const lines = document.querySelectorAll(".c-line");
const thumbs = document.querySelectorAll(".thumb");
const prev = document.getElementById("prev");
const next = document.getElementById("next");

let index = 0;
let isAnimating = false;

function updateThumbs(i) {
    thumbs.forEach((thumb, idx) => {
        const img = thumb.querySelector("img");
        if (img && data[i].thumbs[idx]) {
            img.src = data[i].thumbs[idx];
            gsap.fromTo(img, { opacity: 0 }, { opacity: 1, duration: 0.5 });
        }
    });
}

function playSlide(i) {
    // Prevent overlapping animations
    if (isAnimating) return;
    isAnimating = true;

    const current = dishes[i];
    const previousDish = document.querySelector(".dish.active");

    const tl = gsap.timeline({
        onComplete: () => {
            isAnimating = false;
            startAutoPlay(); // Restart timer only after animation ends
        }
    });

    // 1. Remove previous active dish
    if (previousDish) {
        previousDish.classList.remove("active");
        tl.to(previousDish, {
            y: "-150%",
            opacity: 0,
            duration: 0.6,
            ease: "power2.in"
        }, 0);
    }

    // 2. Prepare and Serve New Dish
    current.classList.add("active");
    gsap.set(current, { zIndex: 10 });

    tl.fromTo(current,
        { y: "-150%", rotation: -15, opacity: 0 },
        { y: "0%", rotation: 0, opacity: 1, duration: 1, ease: "back.out(1.2)" },
        0.2
    );

    // 3. Update Content
    title.textContent = data[i].title;
    lines.forEach((l, n) => { l.textContent = data[i].lines[n] || ""; });

    tl.fromTo([title, ".c-line", ".thumb"],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power3.out" },
        0.3
    );

    updateThumbs(i);
}

function startAutoPlay() {
    stopAutoPlay(); // Safety clear
    gsap.fromTo(".auto-loader-fill",
        { width: "0%" },
        {
            width: "100%",
            duration: 5,
            ease: "none",
            onComplete: () => {
                if (!isAnimating) nextSlide();
            }
        }
    );
}

function stopAutoPlay() {
    gsap.killTweensOf(".auto-loader-fill");
    gsap.set(".auto-loader-fill", { width: "0%" });
}

function nextSlide() {
    if (isAnimating) return;
    index = (index + 1) % data.length;
    playSlide(index);
}

function prevSlide() {
    if (isAnimating) return;
    index = (index - 1 + data.length) % data.length;
    playSlide(index);
}

// ===== BUTTON EVENTS =====
// We stop the auto-play IMMEDIATELY when a user clicks
next.addEventListener('click', () => {
    if (isAnimating) return;
    stopAutoPlay();
    nextSlide();
});

prev.addEventListener('click', () => {
    if (isAnimating) return;
    stopAutoPlay();
    prevSlide();
});

// INITIALIZE
document.addEventListener("DOMContentLoaded", () => {
    playSlide(0);
});






// About us section 
const apPoints = document.querySelectorAll('.ap-benefit-point');
const apSlides = document.getElementById('apSlides');

let apCurrent = 0;
let apTimer;
const AP_DURATION = 5000; // 5s loading

function apResetLines() {
    apPoints.forEach(p => {
        const line = p.querySelector('.ap-point-line span');
        line.style.transition = 'none';
        line.style.width = '0%';
    });
    void document.body.offsetHeight;
}

function apGoToSlide(index) {
    apCurrent = index;

    apPoints.forEach(p => p.classList.remove('active'));
    apPoints[apCurrent].classList.add('active');

    apSlides.style.transform = `translateX(-${apCurrent * 25}%)`;

    apResetLines();

    const activeLine = apPoints[apCurrent].querySelector('.ap-point-line span');
    activeLine.style.transition = `width ${AP_DURATION}ms linear`;
    activeLine.style.width = '100%';

    clearTimeout(apTimer);
    apTimer = setTimeout(apNextSlide, AP_DURATION);
}

function apNextSlide() {
    let next = apCurrent + 1;
    if (next >= apPoints.length) next = 0;
    apGoToSlide(next);
}

apPoints.forEach(p => {
    p.addEventListener('click', () => {
        clearTimeout(apTimer);
        apGoToSlide(+p.dataset.index);
    });
});

/* INIT */
apGoToSlide(0);





const track = document.getElementById("agReviewTrack");
const originalCards = Array.from(track.children);

// Clone twice to ensure the track is always wider than the screen
for (let i = 0; i < 2; i++) {
    originalCards.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });
}

let pos = 0;
const speed = 0.7; // Lower is smoother

function animateReviews() {
    pos -= speed;

    // Get exact width including gap
    const cardWidth = originalCards[0].getBoundingClientRect().width + 20;
    const totalWidth = cardWidth * originalCards.length;

    // Seamless reset
    if (Math.abs(pos) >= totalWidth) {
        pos = 0;
    }

    track.style.transform = `translate3d(${pos}px, 0, 0)`;
    requestAnimationFrame(animateReviews);
}

animateReviews();
























function initSmoothTyping() {
    const titleSelectors = '.section .title h2, .ap-benefits-title, .gallery-header h2, .ag-review-title';
    const titles = document.querySelectorAll(titleSelectors);

    titles.forEach((title) => {
        const originalHTML = title.innerHTML;
        // Split by <br> tags but keep them
        const parts = originalHTML.split(/(<br.*?>)/gi);
        title.innerHTML = '';
        title.classList.add('typing-title');

        parts.forEach(part => {
            if (part.toLowerCase().startsWith('<br')) {
                title.innerHTML += part;
            } else {
                const chars = part.split('');
                chars.forEach(char => {
                    if (char === " ") {
                        // Inject a standard space to keep text-align: center working
                        title.appendChild(document.createTextNode(" "));
                    } else {
                        const spanWrapper = document.createElement('span');
                        spanWrapper.className = 'char-wrap';

                        const charSpan = document.createElement('span');
                        charSpan.className = 'char';
                        charSpan.textContent = char;

                        spanWrapper.appendChild(charSpan);
                        title.appendChild(spanWrapper);
                    }
                });
            }
        });

        const allChars = title.querySelectorAll('.char');

        gsap.to(allChars, {
            opacity: 1,
            y: "0%",
            filter: "blur(0px)",
            duration: 0.8,
            stagger: 0.03,
            ease: "power2.out",
            scrollTrigger: {
                trigger: title,
                start: "top 95%", // Trigger slightly later for better visibility
                toggleActions: "play none none none"
            }
        });
    });
}

// Critical: Run after everything is loaded to prevent size bugs
window.addEventListener('load', initSmoothTyping);