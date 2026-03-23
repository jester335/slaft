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
