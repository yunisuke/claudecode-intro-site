(() => {
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => Array.from(p.querySelectorAll(s));

  // Theme toggle
  const toggle = $('.theme-toggle');
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved === 'light') root.dataset.theme = 'light';
  if (saved === 'dark') root.dataset.theme = 'dark';
  const applyTheme = (t) => {
    if (!t) delete root.dataset.theme; else root.dataset.theme = t;
    localStorage.setItem('theme', t || '');
  };
  toggle?.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : root.dataset.theme === 'light' ? '' : 'dark';
    applyTheme(next);
  });

  // Footer year
  const y = $('#y'); if (y) y.textContent = new Date().getFullYear();

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) e.target.classList.add('in');
  }, { threshold: .12 });
  $$('.reveal').forEach(el => observer.observe(el));

  // Smooth scroll for internal links
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const t = $(id);
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  // Terminal typing demo
  const terminal = $('#terminal');
  const replay = $('#demo-replay');
  const lines = [
    '$ codex plan',
    '1. Add CLI entry',
    '2. Parse Markdown',
    '3. Apply HTML template',
    '4. Handle images/links',
    '',
    '$ codex run --dry',
    '• Checking repo... OK',
    '• Running tests... 12 passed',
    '• Building... OK',
    'Ready to apply ✓',
    '',
    '$ codex apply --safe',
    'Diff: src/site.ts +123 −12',
    'Patched in 8.3s ✓'
  ];

  let typing = false;
  function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }
  async function typeText(target, text){
    for (const ch of text){
      target.textContent += ch;
      await sleep(18 + Math.random()*20);
    }
    target.textContent += '\n';
  }
  async function play(){
    if (!terminal || typing) return;
    typing = true;
    terminal.textContent = '';
    for (const l of lines){
      await typeText(terminal, l);
      await sleep(120);
    }
    typing = false;
  }
  replay?.addEventListener('click', play);
  // Auto play once
  setTimeout(play, 300);

  // Copy buttons
  $$('button[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const sel = btn.getAttribute('data-copy');
      const el = sel ? $(sel) : null;
      if (!el) return;
      try{
        await navigator.clipboard.writeText(el.textContent || '');
        btn.textContent = 'Copied';
        setTimeout(() => btn.textContent = 'Copy', 1200);
      }catch{
        btn.textContent = 'Copy failed';
        setTimeout(() => btn.textContent = 'Copy', 1200);
      }
    });
  });
})();

