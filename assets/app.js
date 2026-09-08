// Shared interactivity for the First Light preview: theme toggle, nav, reveal.
document.documentElement.classList.add('js');

// Sticky-glass nav on scroll
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 24);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });
}

// Mobile menu
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navlinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.addEventListener('click', e => {
    if (e.target.tagName === 'A') { navLinks.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); }
  });
}

// Day / night theme — default follows system; toggle cycles system → day → night.
const themeBtn = document.getElementById('themeToggle');
if (themeBtn) {
  const icons = {
    system: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>',
    dark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/></svg>'
  };
  const order = ['system', 'light', 'dark'];
  const getTheme = () => { try { return localStorage.getItem('nbr-theme') || 'system'; } catch (e) { return 'system'; } };
  const paintTheme = v => { themeBtn.innerHTML = icons[v]; themeBtn.title = 'Theme: ' + v + ' (click to change)'; };
  const applyTheme = v => {
    if (v === 'light' || v === 'dark') document.documentElement.setAttribute('data-theme', v);
    else document.documentElement.removeAttribute('data-theme');
    try { v === 'system' ? localStorage.removeItem('nbr-theme') : localStorage.setItem('nbr-theme', v); } catch (e) {}
    paintTheme(v);
  };
  themeBtn.addEventListener('click', () => { const c = getTheme(); applyTheme(order[(order.indexOf(c) + 1) % order.length]); });
  paintTheme(getTheme());
}

// Scroll reveal (progressive enhancement)
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
if (!reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
}
