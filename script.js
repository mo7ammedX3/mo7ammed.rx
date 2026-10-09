(function () {
  'use strict';

  var root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };

  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }

  var META = {
    en: {
      title: 'Mohammed H. F. Alafifi | Pharmacy & Biotechnology · Research · Digital Health',
      desc: 'Portfolio of Mohammed H. F. Alafifi, a Pharmacy and Biotechnology undergraduate from Gaza, Palestine, working across pharmaceutical sciences, public health research, digital health and community leadership.',
      ogTitle: 'Mohammed H. F. Alafifi | Portfolio',
      ogDesc: 'Pharmacy and Biotechnology undergraduate. Research, digital health, community leadership.'
    },
    ar: {
      title: 'محمد حسن العفيفي | الصيدلة والتقنية الحيوية · البحث العلمي · الصحة الرقمية',
      desc: 'المعرض الشخصي لمحمد حسن العفيفي، طالب في الصيدلة والتقنية الحيوية من غزة، فلسطين، يعمل في العلوم الصيدلانية وأبحاث الصحة العامة والصحة الرقمية والقيادة المجتمعية.',
      ogTitle: 'محمد حسن العفيفي | المعرض الشخصي',
      ogDesc: 'طالب في الصيدلة والتقنية الحيوية. بحث علمي، وصحة رقمية، وقيادة مجتمعية.'
    }
  };

  function setMeta(sel, val) {
    var el = document.querySelector(sel);
    if (el) el.setAttribute('content', val);
  }

  /* ---------- Language ---------- */
  var menuBtn = $('menuBtn');
  var menu = $('menu');
  var lbCap = $('lbCap');
  var lbImg = $('lbImg');
  var lb = $('lightbox');
  var openBtn = null; // certificate button currently shown in the viewer

  function lang() { return root.getAttribute('data-lang') === 'ar' ? 'ar' : 'en'; }

  function applyLang(l, persist) {
    root.setAttribute('data-lang', l);
    root.setAttribute('lang', l);
    root.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
    if (persist) store('lang', l);

    document.title = META[l].title;
    setMeta('meta[name="description"]', META[l].desc);
    setMeta('meta[property="og:title"]', META[l].ogTitle);
    setMeta('meta[property="og:description"]', META[l].ogDesc);

    Array.prototype.forEach.call(document.querySelectorAll('[data-aria-en]'), function (el) {
      el.setAttribute('aria-label', el.getAttribute('data-aria-' + l));
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-alt-en]'), function (el) {
      el.setAttribute('alt', el.getAttribute('data-alt-' + l));
    });
    syncMenuLabel();
    if (openBtn && !lb.hidden) {
      lbCap.textContent = openBtn.getAttribute('data-title-' + l) || '';
      lbImg.setAttribute('alt', openBtn.querySelector('img').getAttribute('alt') || '');
    }
  }

  $('langBtn').addEventListener('click', function () {
    applyLang(lang() === 'ar' ? 'en' : 'ar', true);
  });

  /* ---------- Theme ---------- */
  function applyTheme(th, persist) {
    root.setAttribute('data-theme', th);
    if (persist) store('theme', th);
    setMeta('meta[name="theme-color"]', th === 'light' ? '#f8f5ee' : '#0b1220');
  }
  $('themeBtn').addEventListener('click', function () {
    applyTheme(root.getAttribute('data-theme') === 'light' ? 'dark' : 'light', true);
  });

  /* ---------- Year ---------- */
  var yr = $('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  function syncMenuLabel() {
    var open = menu.classList.contains('open');
    var l = lang();
    var label = open
      ? (l === 'ar' ? 'إغلاق القائمة' : 'Close menu')
      : (l === 'ar' ? 'فتح القائمة' : 'Open menu');
    menuBtn.setAttribute('aria-label', label);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  function closeMenu() { menu.classList.remove('open'); syncMenuLabel(); }
  menuBtn.addEventListener('click', function () {
    menu.classList.toggle('open');
    syncMenuLabel();
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('a')) closeMenu();
  });

  /* ---------- Certificate filters ---------- */
  var filters = document.querySelectorAll('.filter');
  var certs = Array.prototype.slice.call(document.querySelectorAll('.cert'));
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-filter');
      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      certs.forEach(function (c) {
        c.hidden = !(key === 'all' || c.getAttribute('data-cat') === key);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  var lbClose = $('lbClose');
  var lbPrev = $('lbPrev');
  var lbNext = $('lbNext');
  var current = -1;

  function visibleButtons() {
    return certs
      .filter(function (c) { return !c.hidden; })
      .map(function (c) { return c.querySelector('.cert-btn'); });
  }
  function show(btns, i) {
    current = (i + btns.length) % btns.length;
    openBtn = btns[current];
    lbImg.src = openBtn.getAttribute('data-full');
    lbImg.setAttribute('alt', openBtn.querySelector('img').getAttribute('alt') || '');
    lbCap.textContent = openBtn.getAttribute('data-title-' + lang()) || '';
    var single = btns.length < 2;
    lbPrev.hidden = single;
    lbNext.hidden = single;
  }
  function openLb(btn) {
    var btns = visibleButtons();
    var i = btns.indexOf(btn);
    if (i < 0) return;
    show(btns, i);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }
  function closeLb() {
    lb.hidden = true;
    lbImg.removeAttribute('src');
    document.body.style.overflow = '';
    if (openBtn) openBtn.focus();
  }
  function step(d) { show(visibleButtons(), current + d); }

  $('certGrid').addEventListener('click', function (e) {
    var btn = e.target.closest('.cert-btn');
    if (btn) openLb(btn);
  });
  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click', function () { step(-1); });
  lbNext.addEventListener('click', function () { step(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });

  document.addEventListener('keydown', function (e) {
    if (lb.hidden) {
      if (e.key === 'Escape') closeMenu();
      return;
    }
    var rtl = root.getAttribute('dir') === 'rtl';
    if (e.key === 'Escape') closeLb();
    else if (e.key === 'ArrowLeft') step(rtl ? 1 : -1);
    else if (e.key === 'ArrowRight') step(rtl ? -1 : 1);
    else if (e.key === 'Tab') {
      var f = [lbClose, lbPrev, lbNext].filter(function (x) { return !x.hidden; });
      var idx = f.indexOf(document.activeElement);
      e.preventDefault();
      var n = e.shiftKey ? idx - 1 : idx + 1;
      f[(n + f.length) % f.length].focus();
    }
  });

  /* ---------- Scroll reveal (progressive enhancement) ---------- */
  if ('IntersectionObserver' in window) {
    var targets = document.querySelectorAll('.section .wrap > *, .hero-text, .hero-photo');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
    Array.prototype.forEach.call(targets, function (t) {
      t.classList.add('reveal');
      io.observe(t);
    });
  }

  /* ---------- Init (state was set by the inline script in <head>) ---------- */
  applyLang(lang(), false);
  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark', false);
})();
