(function () {
    var content = document.getElementById("hero-content");
    var img = document.querySelector(".hero__img");
    var catalogLink = document.querySelector(".hero__catalog-link");

    if (content) {
        function revealHeroContent() {
            content.classList.add("hero__content--visible");
            content.setAttribute("aria-hidden", "false");
        }

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            revealHeroContent();
        } else if (!img) {
            revealHeroContent();
        } else if (img.complete && img.naturalWidth > 0) {
            requestAnimationFrame(function () {
                requestAnimationFrame(revealHeroContent);
            });
        } else {
            img.addEventListener("load", revealHeroContent, { once: true });
            img.addEventListener("error", revealHeroContent, { once: true });
        }
    }

    if (catalogLink) {
        catalogLink.addEventListener("click", function (e) {
            var target = document.getElementById("catalog-teaser");
            if (!target) {
                return;
            }
            e.preventDefault();
            var smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
        });
    }
})();

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

(function () {
    var viewport = document.querySelector(".slogan-strip__viewport");
    var track = document.querySelector(".slogan-strip__track");
    var prevEl = document.querySelector(".slogan-strip__nav--prev");
    var nextEl = document.querySelector(".slogan-strip__nav--next");
    if (!viewport || !track || !prevEl || !nextEl) {
        return;
    }

    var slides = track.querySelectorAll(".slogan-strip__slide");
    var suppressLinkClick = false;
    var maxPointerDelta = 0;
    var frame = viewport.closest(".slogan-strip__frame");

    function getGapPx() {
        var w = window.innerWidth;
        if (w >= 1024) {
            return 20;
        }
        if (w >= 640) {
            return 16;
        }
        return 12;
    }

    /* Широкий экран — три фото в ряд; узкий — одно (свайп/листание как у Swiper) */
    function getSlidesPerView() {
        return window.innerWidth >= 768 ? 3 : 1;
    }

    function updateScrollableState() {
        if (!frame) {
            return;
        }
        var canScroll = viewport.scrollWidth > viewport.clientWidth + 2;
        frame.classList.toggle("slogan-strip__frame--no-scroll", !canScroll);
        prevEl.setAttribute("aria-disabled", canScroll ? "false" : "true");
        nextEl.setAttribute("aria-disabled", canScroll ? "false" : "true");
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
        window.requestAnimationFrame(updateScrollableState);
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

    viewport.addEventListener(
        "click",
        function (e) {
            var a = e.target.closest("a.slogan-strip__link");
            if (!a || !suppressLinkClick) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            suppressLinkClick = false;
        },
        true
    );

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

    /* Тач: нативный горизонтальный скролл (импульс на iOS). Мышь/стилус: перетаскивание */
    viewport.addEventListener("pointerdown", function (e) {
        if (e.pointerType === "touch") {
            return;
        }
        if (e.button !== 0) {
            return;
        }
        if (viewport.scrollWidth <= viewport.clientWidth) {
            return;
        }
        dragging = true;
        suppressLinkClick = false;
        maxPointerDelta = 0;
        dragStartX = e.clientX;
        dragScrollStart = viewport.scrollLeft;
        viewport.classList.add("slogan-strip__viewport--dragging");
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
        maxPointerDelta = Math.max(maxPointerDelta, Math.abs(e.clientX - dragStartX));
        viewport.scrollLeft = dragScrollStart - (e.clientX - dragStartX);
    });

    function endDrag(e) {
        if (!dragging) {
            return;
        }
        dragging = false;
        viewport.classList.remove("slogan-strip__viewport--dragging");
        if (maxPointerDelta > 12) {
            suppressLinkClick = true;
        }
        try {
            viewport.releasePointerCapture(e.pointerId);
        } catch (err) {
            /* ignore */
        }
    }

    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
})();
