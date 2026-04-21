(function () {
    /* ---------- Tabs ---------- */
    var tabsEl = document.getElementById('product-tabs');
    if (tabsEl) {
        var tabs = tabsEl.querySelectorAll('.product-tabs__tab');
        var panels = tabsEl.querySelectorAll('.product-tabs__panel');

        function activateTab(index) {
            tabs.forEach(function (t, i) {
                var on = i === index;
                t.classList.toggle('product-tabs__tab--active', on);
                t.setAttribute('aria-selected', String(on));
                t.tabIndex = on ? 0 : -1;
            });
            panels.forEach(function (p, i) {
                p.classList.toggle('product-tabs__panel--hidden', i !== index);
            });
        }

        tabs.forEach(function (tab, index) {
            tab.addEventListener('click', function () { activateTab(index); });
            tab.addEventListener('keydown', function (e) {
                var next = index;
                if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
                else if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
                else return;
                e.preventDefault();
                activateTab(next);
                tabs[next].focus();
            });
        });
    }

    /* ---------- Qty stepper ---------- */
    var qtyInput = document.querySelector('.product-qty__input');
    if (qtyInput) {
        document.querySelectorAll('.product-qty__btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var delta = btn.getAttribute('aria-label').indexOf('Уменьшить') !== -1 ? -1 : 1;
                qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) + delta);
            });
        });
    }

    /* ---------- Question modal ---------- */
    var modal = document.getElementById('product-question-modal');
    var form  = document.getElementById('product-question-form');
    if (!modal) return;

    var lastFocus = null;

    function focusable() {
        return Array.prototype.slice.call(
            modal.querySelectorAll('a[href],button:not([disabled]),textarea,input,select')
        ).filter(function (el) { return el.getAttribute('tabindex') !== '-1'; });
    }

    function openModal() {
        lastFocus = document.activeElement;
        modal.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
        var first = document.getElementById('product-q-name');
        if (first) setTimeout(function () { first.focus(); }, 0);
    }

    function closeModal() {
        modal.setAttribute('hidden', '');
        document.body.style.overflow = '';
        if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    /* All "Задать вопрос" buttons on the page */
    document.querySelectorAll('[data-product-question-open]').forEach(function (btn) {
        btn.addEventListener('click', openModal);
    });

    modal.querySelectorAll('[data-product-question-close]').forEach(function (el) {
        el.addEventListener('click', closeModal);
    });

    modal.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { e.preventDefault(); closeModal(); return; }
        if (e.key !== 'Tab') return;
        var list = focusable();
        if (!list.length) return;
        var first = list[0], last = list[list.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else if (document.activeElement === last) {
            e.preventDefault(); first.focus();
        }
    });

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            closeModal();
            form.reset();
        });
    }
})();
