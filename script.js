// =====================================================
// DIPAK KALSARIYA - PORTFOLIO SCRIPT
// =====================================================

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;


// ================================
// MOBILE MENU
// ================================

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

function closeMenu() {
    navMenu.classList.remove("active");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
}

menuToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("active");
    menuToggle.classList.toggle("active", open);
    menuToggle.setAttribute("aria-expanded", String(open));
});

navMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

// Close the menu when tapping outside of it, or when pressing Escape
document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) closeMenu();
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 1080) closeMenu();
});


// ================================
// HEADER + SCROLL PROGRESS + BACK TO TOP
// ================================

const header = document.getElementById("header");
const progressBar = document.getElementById("scrollProgress");
const toTop = document.getElementById("toTop");

function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    progressBar.style.width = progress + "%";
    header.classList.toggle("scrolled", scrollTop > 20);
    toTop.classList.toggle("visible", scrollTop > 600);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
});


// ================================
// ACTIVE NAV LINK ON SCROLL
// ================================

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const navObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
            });
        });
    },
    { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => navObserver.observe(section));


// ================================
// TYPED ROLE TEXT IN HERO
// ================================

const typedEl = document.getElementById("typedText");

if (typedEl && !prefersReducedMotion) {
    const phrases = [
        "Android apps",
        "Jetpack Compose UIs",
        "On-device AI / ML",
        "Secure login (MFA & Azure SSO)",
        "Android TV experiences"
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function type() {
        const current = phrases[phraseIndex];

        charIndex += deleting ? -1 : 1;
        typedEl.textContent = current.slice(0, charIndex);

        let delay = deleting ? 35 : 70;

        if (!deleting && charIndex === current.length) {
            delay = 1700;          // pause when the phrase is complete
            deleting = true;
        } else if (deleting && charIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 350;
        }

        setTimeout(type, delay);
    }

    typedEl.textContent = "";
    setTimeout(type, 1100);
}


// ================================
// SKILL MARQUEE (duplicate content for a seamless loop)
// ================================

const marqueeTrack = document.getElementById("marqueeTrack");

if (marqueeTrack) {
    marqueeTrack.innerHTML += marqueeTrack.innerHTML;
}


// ================================
// SCROLL REVEAL (with stagger inside grids)
// ================================

const revealElements = document.querySelectorAll(".reveal");

// Give each element a small delay based on its position inside its parent
revealElements.forEach((el) => {
    const siblings = Array.from(el.parentElement.children).filter((c) => c.classList.contains("reveal"));
    const index = siblings.indexOf(el);
    el.style.setProperty("--d", `${Math.min(index, 5) * 90}ms`);
});

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
        });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);

revealElements.forEach((el) => revealObserver.observe(el));


// ================================
// ACHIEVEMENT COUNT-UP
// ================================

const counters = document.querySelectorAll(".count-up");

const counterObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const suffix = el.dataset.suffix || "";
            const duration = prefersReducedMotion ? 1 : 1400;
            const startTime = performance.now();

            function tick(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);   // ease-out
                el.textContent = Math.floor(eased * target) + suffix;

                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    el.textContent = target + suffix;
                }
            }

            requestAnimationFrame(tick);
            observer.unobserve(el);
        });
    },
    { threshold: 0.6 }
);

counters.forEach((el) => counterObserver.observe(el));


// ================================
// 3D TILT (profile card + certificate cards, desktop only)
// ================================

if (canHover && !prefersReducedMotion) {
    document.querySelectorAll(".tilt").forEach((card) => {
        const maxTilt = card.classList.contains("profile-card") ? 7 : 5;

        card.addEventListener("pointermove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            card.style.transform =
                `perspective(900px) rotateX(${(-y * maxTilt).toFixed(2)}deg) rotateY(${(x * maxTilt).toFixed(2)}deg) translateY(-4px)`;
        });

        card.addEventListener("pointerleave", () => {
            card.style.transform = "";
        });
    });
}


// ================================
// CURSOR GLOW (desktop only)
// ================================

const cursorGlow = document.getElementById("cursorGlow");

if (cursorGlow && canHover && !prefersReducedMotion) {
    let glowX = 0, glowY = 0, ticking = false;

    window.addEventListener("pointermove", (e) => {
        glowX = e.clientX;
        glowY = e.clientY;
        cursorGlow.classList.add("visible");

        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                cursorGlow.style.transform = `translate(${glowX}px, ${glowY}px)`;
                ticking = false;
            });
        }
    }, { passive: true });

    document.addEventListener("pointerleave", () => cursorGlow.classList.remove("visible"));
}


// ================================
// CERTIFICATE LIGHTBOX
// ================================

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");

let lastFocused = null;

function openLightbox(src, title) {
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = title + " badge";
    lightboxCaption.textContent = title;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
}

function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
}

document.querySelectorAll(".cert-badge").forEach((btn) => {
    btn.addEventListener("click", () => openLightbox(btn.dataset.full, btn.dataset.title));
});

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        if (!lightbox.hidden) closeLightbox();
        closeMenu();
    }
});
