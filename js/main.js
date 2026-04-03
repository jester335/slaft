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
    var viewport = document.querySelector(".trust__viewport");
    var track = document.querySelector(".trust__track");
    var prevEl = document.querySelector(".trust__nav--prev");
    var nextEl = document.querySelector(".trust__nav--next");
    if (!viewport || !track || !prevEl || !nextEl) {
        return;
    }

    var slides = track.querySelectorAll(".trust__slide");

    function getGapPx() {
        var w = window.innerWidth;
        if (w >= 1024) {
            return 40;
        }
        if (w >= 900) {
            return 36;
        }
        if (w >= 640) {
            return 32;
        }
        return 28;
    }

    function getSlidesPerView() {
        var w = window.innerWidth;
        if (w >= 1024) {
            return 5;
        }
        if (w >= 900) {
            return 4;
        }
        if (w >= 640) {
            return 3;
        }
        return 2;
    }

    function applySlideWidths() {
        var vw = viewport.clientWidth;
        var n = getSlidesPerView();
        var g = getGapPx();
        var slideW = (vw - g * (n - 1)) / n;
        if (slideW < 0) {
            slideW = 0;
        }
        for (var i = 0; i < slides.length; i++) {
            slides[i].style.width = slideW + "px";
        }
        track.style.gap = g + "px";
    }

    function scrollStep(dir) {
        var vw = viewport.clientWidth;
        var n = getSlidesPerView();
        var g = getGapPx();
        var slideW = (vw - g * (n - 1)) / n;
        var step = slideW + g;
        var behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
        viewport.scrollBy({ left: dir * step, behavior: behavior });
    }

    applySlideWidths();
    if (typeof ResizeObserver !== "undefined") {
        new ResizeObserver(applySlideWidths).observe(viewport);
    }
    window.addEventListener("resize", applySlideWidths);
    window.addEventListener("load", applySlideWidths);

    prevEl.addEventListener("click", function (e) {
        e.preventDefault();
        scrollStep(-1);
    });
    nextEl.addEventListener("click", function (e) {
        e.preventDefault();
        scrollStep(1);
    });

    /* Тач: нативный горизонтальный скролл. Мышь: drag + колесо → горизонталь */
    var dragStartX = 0;
    var dragScrollStart = 0;
    var dragging = false;

    viewport.addEventListener(
        "wheel",
        function (e) {
            if (viewport.scrollWidth <= viewport.clientWidth) {
                return;
            }
            if (e.deltaX === 0 && e.deltaY === 0) {
                return;
            }
            e.preventDefault();
            viewport.scrollLeft += e.deltaY + e.deltaX;
        },
        { passive: false }
    );

    viewport.addEventListener("pointerdown", function (e) {
        if (e.pointerType === "touch") {
            return;
        }
        if (e.button !== 0) {
            return;
        }
        dragging = true;
        dragStartX = e.clientX;
        dragScrollStart = viewport.scrollLeft;
        viewport.classList.add("trust__viewport--dragging");
        try {
            viewport.setPointerCapture(e.pointerId);
        } catch (err) {
            /* ignore */
        }
    });

    viewport.addEventListener("pointermove", function (e) {
        if (!dragging || e.pointerType === "touch") {
            return;
        }
        viewport.scrollLeft = dragScrollStart - (e.clientX - dragStartX);
    });

    function endDrag(e) {
        if (!dragging) {
            return;
        }
        dragging = false;
        viewport.classList.remove("trust__viewport--dragging");
        try {
            viewport.releasePointerCapture(e.pointerId);
        } catch (err) {
            /* ignore */
        }
    }

    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
})();
