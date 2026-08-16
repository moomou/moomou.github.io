/*
 * Outline / scroll-nav sidebar.
 *
 * Builds a right-edge column of ticks from the document's top-level section
 * headings, tracks the active section on scroll, and exposes a small API
 * (window.ScrollNav.setCurrentIndex) so an external "scroll position changed"
 * signal can drive the active tick. Framework-free, desktop only.
 */
(function () {
    "use strict";

    var DESKTOP_MIN = 1024;   // show at >= this width only
    var TICK_PITCH = 14;      // pt, fixed vertical pitch
    var MARGIN_Y = 72;        // top/bottom breathing room within the strip
    var ACTIVE_OFFSET = 120;  // px from top: where "current section" is read

    var prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function ready(fn) {
        if (document.readyState !== "loading") fn();
        else document.addEventListener("DOMContentLoaded", fn);
    }

    // Top-level sections = the shallowest heading level present in the post.
    function collectEntries() {
        var content = document.querySelector(".markdown");
        if (!content) return [];
        var nodes = content.querySelectorAll("h2[id], h3[id], h4[id]");
        if (!nodes.length) return [];

        var minLevel = 6;
        nodes.forEach(function (h) {
            minLevel = Math.min(minLevel, parseInt(h.tagName[1], 10));
        });

        var out = [];
        nodes.forEach(function (h) {
            if (parseInt(h.tagName[1], 10) !== minLevel) return;
            out.push({
                id: h.id,
                title: (h.textContent || "").replace(/#\s*$/, "").trim(),
                el: h
            });
        });
        return out;
    }

    function luminance(rgb) {
        // rgb: [r,g,b] 0-255 -> relative luminance 0..1
        var c = rgb.map(function (v) {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    }

    function bgRgb() {
        // Walk up from content to the first element with a non-transparent bg.
        var el = document.querySelector(".markdown") || document.body;
        while (el) {
            var bg = getComputedStyle(el).backgroundColor;
            var m = bg && bg.match(/rgba?\(([^)]+)\)/);
            if (m) {
                var parts = m[1].split(",").map(function (s) {
                    return parseFloat(s.trim());
                });
                var alpha = parts.length > 3 ? parts[3] : 1;
                if (alpha > 0) return [parts[0], parts[1], parts[2]];
            }
            el = el.parentElement;
        }
        return [255, 255, 255];
    }

    function ScrollNav(entries) {
        this.entries = entries;
        this.current = -1;
        this.ticks = [];
        this.centers = [];
        this._raf = 0;

        var root = document.createElement("nav");
        root.className = "scroll-nav";
        root.setAttribute("aria-label", "Section outline");
        this.root = root;

        var dot = document.createElement("div");
        dot.className = "scroll-nav__dot";
        root.appendChild(dot);
        this.dot = dot;

        var tip = document.createElement("div");
        tip.className = "scroll-nav__tip";
        root.appendChild(tip);
        this.tip = tip;

        var self = this;
        entries.forEach(function (entry, i) {
            var tick = document.createElement("button");
            tick.type = "button";
            tick.className = "scroll-nav__tick";
            tick.setAttribute("aria-label", entry.title);
            tick.dataset.index = String(i);

            var bar = document.createElement("span");
            bar.className = "scroll-nav__bar";
            tick.appendChild(bar);

            tick.addEventListener("click", function (e) {
                e.preventDefault();
                self.navigate(i);
            });
            tick.addEventListener("mouseenter", function () {
                self.showTip(i);
            });
            tick.addEventListener("mousemove", function () {
                self.showTip(i);
            });
            tick.addEventListener("mouseleave", function () {
                self.hideTip();
            });

            root.appendChild(tick);
            self.ticks.push(tick);
        });

        document.body.appendChild(root);

        this.applyTheme();
        this.layout();

        this._onScroll = this.onScroll.bind(this);
        this._onResize = this.onResize.bind(this);
        window.addEventListener("scroll", this._onScroll, { passive: true });
        window.addEventListener("resize", this._onResize);

        this._mq = window.matchMedia("(prefers-color-scheme: dark)");
        var theme = this.applyTheme.bind(this);
        if (this._mq.addEventListener) this._mq.addEventListener("change", theme);
        else if (this._mq.addListener) this._mq.addListener(theme);

        requestAnimationFrame(function () {
            self.syncActiveFromScroll();
            root.classList.add("is-ready");
        });
    }

    ScrollNav.prototype.applyTheme = function () {
        var rgb = bgRgb();
        var dark = luminance(rgb) < 0.5;
        var tick = dark ? "255, 255, 255" : "0, 0, 0";
        this.root.style.setProperty("--sn-tick", "rgba(" + tick + ", 0.55)");
        this.root.style.setProperty("--sn-pitch", TICK_PITCH + "px");
    };

    ScrollNav.prototype.layout = function () {
        var n = this.entries.length;
        var h = window.innerHeight;
        var avail = h - MARGIN_Y * 2;
        var pitch = TICK_PITCH;

        if (n * pitch <= avail) {
            // Fixed pitch, vertically centered.
            var total = n * pitch;
            var startCenter = (h - total) / 2 + pitch / 2;
            this.centers = this.entries.map(function (_, i) {
                return startCenter + i * pitch;
            });
        } else {
            // Overflow: even distribution across the available height.
            var step = avail / n;
            this.centers = this.entries.map(function (_, i) {
                return MARGIN_Y + (i + 0.5) * step;
            });
        }

        var self = this;
        this.ticks.forEach(function (tick, i) {
            tick.style.top = self.centers[i] + "px";
        });

        // Flush to the trailing edge, offset by the scrollbar gutter if any.
        var gutter = window.innerWidth - document.documentElement.clientWidth;
        this.root.style.right = (gutter > 0 ? gutter + 2 : 2) + "px";

        if (this.current >= 0) {
            this.dot.style.top = this.centers[this.current] + "px";
        }
    };

    ScrollNav.prototype.navigate = function (i) {
        var entry = this.entries[i];
        if (!entry) return;
        this.setCurrentIndex(i);
        entry.el.scrollIntoView({
            behavior: prefersReduced ? "auto" : "smooth",
            block: "start"
        });
        if (history.replaceState) {
            history.replaceState(null, "", "#" + entry.id);
        }
    };

    // Public API: drive the active tick from an external scroll signal.
    ScrollNav.prototype.setCurrentIndex = function (i) {
        if (i === this.current || i < 0 || i >= this.entries.length) return;
        if (this.current >= 0) {
            this.ticks[this.current].classList.remove("is-active");
        }
        this.current = i;
        this.ticks[i].classList.add("is-active");
        this.dot.style.top = this.centers[i] + "px";
    };

    ScrollNav.prototype.syncActiveFromScroll = function () {
        var idx = 0;
        for (var i = 0; i < this.entries.length; i++) {
            var top = this.entries[i].el.getBoundingClientRect().top;
            if (top - ACTIVE_OFFSET <= 0) idx = i;
            else break;
        }
        this.setCurrentIndex(idx);
    };

    ScrollNav.prototype.onScroll = function () {
        if (this._raf) return;
        var self = this;
        this._raf = requestAnimationFrame(function () {
            self._raf = 0;
            self.syncActiveFromScroll();
        });
    };

    ScrollNav.prototype.onResize = function () {
        this.layout();
        this.applyTheme();
    };

    ScrollNav.prototype.showTip = function (i) {
        var tip = this.tip;
        tip.textContent = this.entries[i].title;
        tip.style.top = this.centers[i] + "px";
        tip.classList.add("is-visible");
    };

    ScrollNav.prototype.hideTip = function () {
        this.tip.classList.remove("is-visible");
    };

    ready(function () {
        // Build once, even if invoked from multiple ready signals.
        if (window.ScrollNav) return;
        // Auto-hide when the doc has no outline, or below desktop width.
        if (window.innerWidth < DESKTOP_MIN) return;
        var entries = collectEntries();
        if (entries.length < 2) return;
        window.ScrollNav = new ScrollNav(entries);
    });
})();
