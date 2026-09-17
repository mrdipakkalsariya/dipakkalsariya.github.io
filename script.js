// ================================
// MOBILE MENU
// ================================

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    menuToggle.classList.toggle("active");
});

navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuToggle.classList.remove("active");
    });
});


// ================================
// HEADER + SCROLL PROGRESS
// ================================

const header = document.getElementById("header");
const progressBar = document.getElementById("scrollProgress");

function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    progressBar.style.width = progress + "%";

    if (scrollTop > 20) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();


// ================================
// ACTIVE NAV LINK ON SCROLL
// ================================

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

const navObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute("id");
                navLinks.forEach((link) => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
                });
            }
        });
    },
    { rootMargin: "-45% 0px -50% 0px" }
);

sections.forEach((section) => navObserver.observe(section));


// ================================
// HERO CODE TYPING EFFECT (single orchestrated load moment)
// ================================

const codeBody = document.querySelector(".code-window-body pre");

if (codeBody && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {

    const fullHTML = codeBody.innerHTML;
    const plainText = codeBody.textContent;

    // Type out plain text first, then swap in the syntax-highlighted markup
    codeBody.innerHTML = "";
    let i = 0;
    const speed = 12;

    function typeNext() {
        if (i <= plainText.length) {
            codeBody.textContent = plainText.slice(0, i);
            i++;
            requestAnimationFrame(() => setTimeout(typeNext, speed));
        } else {
            codeBody.innerHTML = fullHTML;
        }
    }

    setTimeout(typeNext, 400);
}


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
            const duration = 1200;
            const startTime = performance.now();

            function tick(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const value = Math.floor(progress * target);
                el.textContent = value + suffix;

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
// SCROLL REVEAL ANIMATION
// ================================

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("in-view");

                revealObserver.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.15
    }
);

revealElements.forEach((element) => {
    revealObserver.observe(element);
});