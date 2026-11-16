
/* =========================================
   MEDIVISION 2.0 — MAIN JAVASCRIPT
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* 1. MOBILE NAVIGATION */

    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".nav-links");
    const navigationLinks = document.querySelectorAll(".nav-links a");

    function closeMenu() {
        if (!menuButton || !navigation) return;

        navigation.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Ouvrir le menu");
    }

    if (menuButton && navigation) {

        menuButton.addEventListener("click", () => {

            const isOpen = navigation.classList.toggle("open");

            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Fermer le menu" : "Ouvrir le menu"
            );

        });

        // Fermer le menu après avoir choisi une page

        navigationLinks.forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        // Fermer le menu avec la touche Échap

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        // Fermer le menu si l'écran devient plus large

        window.addEventListener("resize", () => {
            if (window.innerWidth > 700) {
                closeMenu();
            }
        });

    }


    /* 2. SCROLL REVEAL ANIMATION */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            (entries, currentObserver) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        currentObserver.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach(element => {
            observer.observe(element);
        });

    } else {

        // Solution de secours pour les anciens navigateurs

        revealElements.forEach(element => {
            element.classList.add("visible");
        });

    }


    /* 3. CURRENT YEAR */

    const yearElement = document.getElementById("current-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    /* 4. IMAGE FALLBACK */

    const images = document.querySelectorAll(".application-card img");

    images.forEach(image => {

        image.addEventListener("error", () => {

            image.style.display = "none";

            const card = image.closest(".application-card");

            if (card) {
                card.style.background =
                    "linear-gradient(145deg, #12334d, #071827)";
            }

        });

    });

});
