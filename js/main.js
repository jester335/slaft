(function () {
    var header = document.querySelector(".header");
    var burger = document.querySelector(".header__burger");
    var panel = document.getElementById("header-panel");
    var yearEl = document.getElementById("footer-year");

    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    if (!header || !burger || !panel) {
        return;
    }

    function setOpen(open) {
        header.classList.toggle("header--nav-open", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
        burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    }

    burger.addEventListener("click", function () {
        setOpen(!header.classList.contains("header--nav-open"));
    });

    panel.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            if (window.matchMedia("(max-width: 959px)").matches) {
                setOpen(false);
            }
        });
    });

    window.addEventListener("resize", function () {
        if (window.matchMedia("(min-width: 960px)").matches) {
            setOpen(false);
        }
    });
})();

(function () {
    if (typeof Swiper === "undefined") {
        return;
    }

    var root = document.querySelector(".trust__swiper");
    if (!root) {
        return;
    }

    new Swiper(".trust__swiper", {
        slidesPerView: 2,
        spaceBetween: 28,
        loop: false,
        rewind: true,
        speed: 600,
        centerInsufficientSlides: true,
        navigation: {
            prevEl: ".trust__nav--prev",
            nextEl: ".trust__nav--next",
        },
        autoplay: false,
        breakpoints: {
            480: {
                slidesPerView: 2,
                spaceBetween: 32,
            },
            640: {
                slidesPerView: 3,
                spaceBetween: 36,
            },
            900: {
                slidesPerView: 4,
                spaceBetween: 40,
            },
            1200: {
                slidesPerView: 5,
                spaceBetween: 44,
            },
        },
        a11y: {
            enabled: true,
            containerMessage: "Компании, которым доверяют",
        },
    });
})();
