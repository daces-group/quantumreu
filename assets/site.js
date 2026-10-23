/* Progressive enhancement: all research content is present in the HTML. */
'use strict';
document.documentElement.classList.add('js-enabled');
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('#primary-nav');
if (menuButton && nav) {
  const mobile = window.matchMedia('(max-width: 800px)');
  const setMenu = (open) => { menuButton.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); };
  const syncMenu = () => { menuButton.hidden = !mobile.matches; setMenu(false); };
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { setMenu(false); menuButton.focus(); } });
  mobile.addEventListener('change', syncMenu);
  syncMenu();
}
const controls = document.querySelector('.project-controls');
if (controls) {
  const cards = Array.from(document.querySelectorAll('[data-project]'));
  const buttons = Array.from(document.querySelectorAll('[data-filter]'));
  const search = document.querySelector('#project-search');
  const count = document.querySelector('#result-count');
  const empty = document.querySelector('#empty-results');
  let current = 'all';
  const validFilters = new Set(buttons.map(b => b.dataset.filter));
  const normalize = text => text.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  const update = (saveUrl = true) => {
    const query = normalize(search.value.trim());
    let visible = 0;
    cards.forEach(card => { const match = (current === 'all' || card.dataset.thrust === current) && normalize(card.textContent).includes(query); card.hidden = !match; if (match) visible += 1; });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === current)));
    count.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}`;
    empty.hidden = visible !== 0;
    if (saveUrl && location.protocol !== 'file:') {
      const url = new URL(location.href);
      current === 'all' ? url.searchParams.delete('thrust') : url.searchParams.set('thrust', current);
      search.value.trim() ? url.searchParams.set('q', search.value.trim()) : url.searchParams.delete('q');
      history.replaceState(null, '', url);
    }
  };
  const restore = () => { const params = new URLSearchParams(location.search); current = validFilters.has(params.get('thrust')) ? params.get('thrust') : 'all'; search.value = params.get('q') || ''; update(false); };
  buttons.forEach(button => button.addEventListener('click', () => { current = button.dataset.filter; update(); }));
  search.addEventListener('input', () => update());
  document.querySelector('#reset-search').addEventListener('click', () => { current = 'all'; search.value = ''; update(); search.focus(); });
  window.addEventListener('popstate', restore);
  controls.hidden = false;
  restore();
}
