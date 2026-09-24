(() => {
  const backdrop = document.getElementById('demo-modal-backdrop');
  const closeButton = document.getElementById('demo-modal-close');
  const form = document.getElementById('demo-modal-form');
  const pageRegions = document.querySelectorAll('body > header, body > main, body > footer');
  let previousFocus = null;
  let previousOverflow = '';

  const openModal = (event) => {
    event.preventDefault();
    previousFocus = event.currentTarget;
    previousOverflow = document.body.style.overflow;
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    pageRegions.forEach((region) => { region.inert = true; });
    backdrop.querySelector('input')?.focus();
  };

  const closeModal = () => {
    backdrop.hidden = true;
    document.body.style.overflow = previousOverflow;
    pageRegions.forEach((region) => { region.inert = false; });
    previousFocus?.focus();
  };

  document.querySelectorAll('.final-copy .button').forEach((button) => button.addEventListener('click', openModal));
  closeButton.addEventListener('click', closeModal);
  backdrop.addEventListener('mousedown', (event) => {
    if (event.target === backdrop) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (backdrop.hidden) return;
    if (event.key === 'Escape') closeModal();
    if (event.key !== 'Tab') return;
    const controls = [...backdrop.querySelectorAll('button:not(:disabled), input, a[href], select, textarea')];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  form.addEventListener('submit', (event) => event.preventDefault());

  const menu = document.querySelector('.mobile-menu');
  const menuToggle = menu.querySelector('summary');
  menu.addEventListener('toggle', () => {
    menuToggle.setAttribute('aria-label', menu.open ? 'Закрыть меню сайта' : 'Открыть меню сайта');
  });
  document.querySelectorAll('.main-nav--mobile a').forEach((link) => {
    link.addEventListener('click', () => { menu.open = false; });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      menuToggle.focus();
    }
  });

  // Keep the no-JavaScript radio gallery; enhance only the mobile chooser.
  const chooser = document.getElementById('scenario-select');
  const radios = [...document.querySelectorAll('.scenario-radio')];
  let scenarioScrollPosition = null;
  const rememberPagePosition = () => {
    scenarioScrollPosition = { left: window.scrollX, top: window.scrollY };
  };
  const preservePagePosition = () => {
    const position = scenarioScrollPosition || { left: window.scrollX, top: window.scrollY };
    scenarioScrollPosition = null;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => window.scrollTo({ ...position, behavior: 'auto' }));
    });
  };
  chooser.addEventListener('pointerdown', rememberPagePosition);
  chooser.addEventListener('focus', rememberPagePosition);
  document.querySelectorAll('.scenario-tab').forEach((tab) => {
    tab.addEventListener('pointerdown', rememberPagePosition);
    tab.addEventListener('keydown', rememberPagePosition);
  });
  const syncChooser = () => {
    chooser.value = radios.find((radio) => radio.checked).id;
  };
  chooser.addEventListener('change', () => {
    preservePagePosition();
    const radio = radios.find((item) => item.id === chooser.value);
    if (radio) radio.checked = true;
  });
  radios.forEach((radio) => radio.addEventListener('change', () => {
    preservePagePosition();
    syncChooser();
  }));
  syncChooser();
  document.documentElement.classList.add('has-scenario-select');
})();
