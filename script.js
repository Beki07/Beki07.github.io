document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------------
       NAVIGATION BETWEEN SECTIONS
    ----------------------------------------------------------- */
    const links = document.querySelectorAll(".nav-link, .logo");

    const sections = document.querySelectorAll(".section");

    links.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();

            links.forEach(l => l.classList.remove("active"));
            sections.forEach(s => s.classList.remove("active"));

            link.classList.add("active");

            const targetId = link.dataset.target;
            const targetSection = document.getElementById(targetId);
            if (targetSection) targetSection.classList.add("active");

            window.scrollTo({ top: 0, behavior: "smooth" });

            document.querySelector("nav").classList.remove("active");
        });
    });


    /* -----------------------------------------------------------
       MOBILE MENU
    ----------------------------------------------------------- */
    const hamburger = document.querySelector(".hamburger");
    const nav = document.querySelector("header nav");

    if (hamburger && nav) {
        hamburger.addEventListener("click", () => {
            nav.classList.toggle("active");
        });
    }


    /* -----------------------------------------------------------
       HEADER SHRINK ON SCROLL
    ----------------------------------------------------------- */
    const header = document.querySelector("header");

    if (header) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 20) header.classList.add("shrink");
            else header.classList.remove("shrink");
        });
    }


    /* -----------------------------------------------------------
       SCROLL TO TOP BUTTON
    ----------------------------------------------------------- */
    const toTop = document.getElementById("toTop");

    if (toTop) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                toTop.classList.add("show");
            } else {
                toTop.classList.remove("show");
            }
        });

        toTop.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }


    /* -----------------------------------------------------------
       TYPING ANIMATION
    ----------------------------------------------------------- */
    const roleText = document.getElementById("role-text");
    const roles = [
        "Mechanical Engineer",
        "Robotics Enthusiast",
        "Aerospace Explorer",
        "Programmer"
    ];
    let roleIndex = 0;
    let charIndex = 0;

    function type() {
        if (!roleText) return;

        const currentText = roles[roleIndex];
        roleText.textContent = currentText.substring(0, charIndex++);

        if (charIndex <= currentText.length) {
            setTimeout(type, 90);
        } else {
            setTimeout(() => {
                charIndex = 0;
                roleIndex = (roleIndex + 1) % roles.length;
                type();
            }, 1500);
        }
    }
    type();


    /* -----------------------------------------------------------
       FADE-IN ON SCROLL
    ----------------------------------------------------------- */
    const fadeElements = document.querySelectorAll(".fade-in");

    function fadeInCheck() {
        fadeElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 120) {
                el.classList.add("visible");
            }
        });
    }
    window.addEventListener("scroll", fadeInCheck);
    fadeInCheck();


    /* -----------------------------------------------------------
       ACHIEVEMENTS CAROUSEL – INFINITE SCROLL
    ----------------------------------------------------------- */
    const track = document.querySelector(".carousel-track");
    let position = 0;
    const speed = 0.6;
    let paused = false;

    if (track) {
        track.innerHTML += track.innerHTML;

        function moveCarousel() {
            if (!paused) {
                position -= speed;
                if (position <= -track.scrollWidth / 2) {
                    position = 0;
                }
                track.style.transform = `translateX(${position}px)`;
            }
            requestAnimationFrame(moveCarousel);
        }

        moveCarousel();

        track.querySelectorAll(".carousel-item").forEach(item => {
            item.addEventListener("mouseenter", () => paused = true);
            item.addEventListener("mouseleave", () => paused = false);
        });
    }


    /* ===========================================================
       ABOUT – SPACE RAIL / STARFIELD / STAGE SLIDER
    ========================================================== */

    const aboutSection = document.getElementById("about");
    const railInner = document.querySelector(".about-rail-inner");
    const nodes = document.querySelectorAll(".about-node");
    const dots = document.querySelectorAll(".about-dot");
    const prevBtn = document.querySelector(".about-nav-left");
    const nextBtn = document.querySelector(".about-nav-right");
    const stageLabel = document.getElementById("about-stage-label");
    const starsCanvas = document.querySelector(".about-stars-canvas");
    const space = document.querySelector(".about-space");

    if (
        aboutSection &&
        railInner &&
        nodes.length > 0 &&
        dots.length > 0 &&
        starsCanvas &&
        space
    ) {
        let currentIndex = 0;

        /* ---------- STARFIELD BACKGROUND ---------- */
        const ctx = starsCanvas.getContext("2d");
        let stars = [];

        function resizeStars() {
            const rect = space.getBoundingClientRect();
            starsCanvas.width = rect.width;
            starsCanvas.height = rect.height;

            const starCount = Math.floor((rect.width * rect.height) / 9000);
            stars = [];
            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: Math.random() * starsCanvas.width,
                    y: Math.random() * starsCanvas.height,
                    z: Math.random() * 1 + 0.2,
                    r: Math.random() * 1.4 + 0.3,
                    speed: Math.random() * 0.4 + 0.15
                });
            }
        }

        function renderStars() {
            ctx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
            ctx.fillStyle = "#38bdf8";

            stars.forEach(star => {
                star.y += star.speed * star.z;
                if (star.y > starsCanvas.height) {
                    star.y = -10;
                    star.x = Math.random() * starsCanvas.width;
                }

                const alpha = 0.25 + star.z * 0.55;
                ctx.globalAlpha = alpha;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.globalAlpha = 1;
            requestAnimationFrame(renderStars);
        }

        window.addEventListener("resize", resizeStars);
        resizeStars();
        renderStars();


        /* ---------- SLIDER LOGIC (DESKTOP + MOBILE) ---------- */

        function applyTransform(index, animate = true) {
            if (animate) {
                railInner.style.transition = "transform 0.6s cubic-bezier(.22,.68,.43,1.1)";
            } else {
                railInner.style.transition = "none";
            }
            railInner.style.transform = `translateX(-${index * 100}%)`;
        }

        function updateStage(index, animate = true) {
            if (index < 0) index = 0;
            if (index >= nodes.length) index = nodes.length - 1;

            currentIndex = index;
            applyTransform(index, animate);

            // active card
            nodes.forEach((node, i) => {
                node.classList.toggle("active", i === index);
            });

            // active dots
            dots.forEach(dot => {
                dot.classList.toggle(
                    "active",
                    parseInt(dot.dataset.index, 10) === index
                );
            });

            // HUD label
            if (stageLabel) {
                const label = nodes[index].dataset.label || "";
                stageLabel.textContent = label;
            }
        }

        function nextStage() {
            const next = (currentIndex + 1) % nodes.length;
            updateStage(next);
        }

        function prevStage() {
            const prev = (currentIndex - 1 + nodes.length) % nodes.length;
            updateStage(prev);
        }

        // buttons
        if (nextBtn) nextBtn.addEventListener("click", nextStage);
        if (prevBtn) prevBtn.addEventListener("click", prevStage);

        // dots
        dots.forEach(dot => {
            dot.addEventListener("click", () => {
                const idx = parseInt(dot.dataset.index, 10);
                if (!isNaN(idx)) updateStage(idx);
            });
        });

        // keyboard (only when About is active)
        window.addEventListener("keydown", e => {
            const aboutActive = aboutSection.classList.contains("active");
            if (!aboutActive) return;

            if (e.key === "ArrowRight") nextStage();
            if (e.key === "ArrowLeft") prevStage();
        });

        /* ---------- SIMPLE TOUCH SWIPE (MOBILE) ---------- */
        let touchStartX = null;

        railInner.addEventListener(
            "touchstart",
            e => {
                if (!e.touches || e.touches.length === 0) return;
                touchStartX = e.touches[0].clientX;
            },
            { passive: true }
        );

        railInner.addEventListener(
            "touchend",
            e => {
                if (touchStartX === null) return;
                const touchEndX = e.changedTouches[0].clientX;
                const diff = touchEndX - touchStartX;
                touchStartX = null;

                // ignore small swipes
                if (Math.abs(diff) < 40) return;

                if (diff < 0) {
                    // swipe left: next
                    nextStage();
                } else {
                    // swipe right: previous
                    prevStage();
                }
            },
            { passive: true }
        );

        /* ---------- PARALLAX (DESKTOP) ---------- */
        space.addEventListener("mousemove", e => {
            const rect = space.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            nodes.forEach(node => {
                const hero = node.querySelector(".card-hero");
                if (!hero) return;
                const intensity = node.classList.contains("active") ? 10 : 4;
                hero.style.transform = `translateX(${-x * intensity}px) translateY(${-y * intensity}px)`;
            });
        });

        space.addEventListener("mouseleave", () => {
            nodes.forEach(node => {
                const hero = node.querySelector(".card-hero");
                if (!hero) return;
                hero.style.transform = "";
            });
        });

        // initial state – no animation on first load
        updateStage(0, false);
    }

});



