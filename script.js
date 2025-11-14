document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------------
       NAVIGATION BETWEEN SECTIONS
    ----------------------------------------------------------- */
    const links = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".section");

    links.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();

            // Remove all active states
            links.forEach(l => l.classList.remove("active"));
            sections.forEach(s => s.classList.remove("active"));

            // Activate clicked link
            link.classList.add("active");

            // Show the target section
            const targetId = link.dataset.target;
            const targetSection = document.getElementById(targetId);
            if (targetSection) targetSection.classList.add("active");

            // Scroll up
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });

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
            setTimeout(type, 100);
        } else {
            setTimeout(() => {
                charIndex = 0;
                roleIndex = (roleIndex + 1) % roles.length;
                type();
            }, 1600);
        }
    }

    type();

    /* -----------------------------------------------------------
       ACHIEVEMENTS CAROUSEL (INFINITE SCROLL)
    ----------------------------------------------------------- */
    const track = document.querySelector(".carousel-track");
    let position = 0;
    let paused = false;
    const speed = 0.6;

    if (track) {
        // Duplicate items for infinite loop
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

    /* -----------------------------------------------------------
       ABOUT – 3D CUBE SLIDER
    ----------------------------------------------------------- */
    const cubeInner = document.querySelector(".about-cube-inner");
    const faces = document.querySelectorAll(".about-face");
    const arrowLeft = document.querySelector(".about-arrow-left");
    const arrowRight = document.querySelector(".about-arrow-right");

    let aboutIndex = 0;

    if (cubeInner && faces.length) {
        const total = faces.length;
        const step = 360 / total;
        const radius = 430; // Depth of 3D ring

        // Position each face
        faces.forEach((face, i) => {
            const angle = i * step;
            face.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        });

        function updateCube() {
            const rotation = -aboutIndex * step;
            cubeInner.style.transform = `rotateY(${rotation}deg)`;
            faces.forEach((face, i) => {
                face.classList.toggle("active", i === aboutIndex);
            });
        }

        updateCube();

        if (arrowLeft) {
            arrowLeft.addEventListener("click", () => {
                aboutIndex = (aboutIndex - 1 + total) % total;
                updateCube();
            });
        }

        if (arrowRight) {
            arrowRight.addEventListener("click", () => {
                aboutIndex = (aboutIndex + 1) % total;
                updateCube();
            });
        }
    }

}); // END DOMContentLoaded


