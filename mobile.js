//////

(function () {
  'use strict';

  function isMobile() { return window.innerWidth <= 768; }

  /////HAMBURGER TUGMASI 
  function injectHamburger() {
    const navbar = document.getElementById('navbar');
    if (!navbar || document.getElementById('hamburger-btn')) return;

    const btn = document.createElement('button');
    btn.id = 'hamburger-btn';
    btn.setAttribute('aria-label', 'Open menu');
    btn.innerHTML = `
      <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
        <line x1="0" y1="1"  x2="22" y2="1"  stroke="white" stroke-width="2" stroke-linecap="round"/>
        <line x1="0" y1="8"  x2="22" y2="8"  stroke="white" stroke-width="2" stroke-linecap="round"/>
        <line x1="0" y1="15" x2="22" y2="15" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>`;
    navbar.insertBefore(btn, navbar.firstChild);
  }

  /* ── 2. MOBILE MENU ── */
  function injectMobileMenu() {
    if (document.getElementById('mobile-menu')) return;

    const menu = document.createElement('div');
    menu.id = 'mobile-menu';
    menu.innerHTML = `
      <button class="menu-close" aria-label="Close">&#x2715;</button>
      <a href="index.html">Home</a>
      <div class="menu-divider"></div>
      <a href="#">Stays</a>
      <div class="menu-divider"></div>
      <a href="#">Flights</a>
      <div class="menu-divider"></div>
      <a href="#">Packages</a>
      <div class="menu-divider"></div>
      <a href="#">Sign Up</a>`;
    document.body.appendChild(menu);

    function openMenu()  { menu.classList.add('open');    document.body.style.overflow = 'hidden'; }
    function closeMenu() { menu.classList.remove('open'); document.body.style.overflow = ''; }

    document.getElementById('hamburger-btn')?.addEventListener('click', openMenu);
    menu.querySelector('.menu-close')?.addEventListener('click', closeMenu);
    menu.addEventListener('click', e => { if (e.target === menu) closeMenu(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  /* ── 3. MOBILE SEARCH BAR ── */
  function injectMobileSearchBar() {
    ['hero', 'hero-mountains'].forEach(heroId => {
      const heroEl = document.getElementById(heroId);
      if (!heroEl) return;
      if (heroEl.querySelector('.mobile-search-bar')) return;

      // Desktop search bar ni tap
      const desktopBar = heroEl.querySelector('.flex.items-center[style*="backdrop-filter"]')
                      || heroEl.querySelector('.flex.items-center[style*="blur"]');
      if (!desktopBar) return;

      const mobileBar = document.createElement('div');
      mobileBar.className = 'mobile-search-bar';
      mobileBar.innerHTML = `
        <div class="msb-row">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Search destinations, hotels" />
        </div>
        <div class="msb-row-double">
          <div class="msb-row">
            <i class="fa-regular fa-calendar"></i>
            <span>Check in</span>
          </div>
          <div class="msb-row">
            <i class="fa-regular fa-calendar"></i>
            <span>Check out</span>
          </div>
        </div>
        <div class="msb-row">
          <i class="fa-regular fa-user"></i>
          <span>1 room, 2 adults</span>
        </div>
        <button class="msb-btn" onclick="handleSearch ? handleSearch() : null">Search</button>`;
      desktopBar.insertAdjacentElement('afterend', mobileBar);
    });
  }

  /* ── 4. BOTTOM NAVIGATION ── */
  function injectBottomNav() {
    if (document.getElementById('bottom-nav')) return;

    const isMountains = window.location.pathname.includes('mountains');
    const nav = document.createElement('nav');
    nav.id = 'bottom-nav';
    nav.innerHTML = `
      <a href="index.html" class="${!isMountains ? 'active' : ''}">
        <i class="fa-solid fa-house"></i>
        <span>Home</span>
      </a>
      <a href="mountains.html" class="${isMountains ? 'active' : ''}">
        <i class="fa-solid fa-bag-shopping"></i>
        <span>Packages</span>
      </a>
      <a href="#" onclick="return false">
        <i class="fa-solid fa-building"></i>
        <span>Stays</span>
      </a>
      <a href="#" onclick="return false">
        <i class="fa-solid fa-plane"></i>
        <span>Flights</span>
      </a>`;
    document.body.appendChild(nav);

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function () {
        nav.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }

  /* ── 5. OFFERS — class qo'shish ── */
  function fixOffers() {
    if (!isMobile()) return;

    // Grid
    const grid = document.querySelector('section .grid.grid-cols-2');
    if (grid) grid.classList.add('offers-grid');

    // Kartalar
    document.querySelectorAll('div[style*="height:280px"]').forEach(card => {
      card.classList.add('offer-card');
    });
  }

  /* ── 6. PROPERTY CAROUSEL → native scroll mobileda ── */
  function fixPropertyCarousel() {
    if (!isMobile()) return;

    const wrapper = document.getElementById('propertyWrapper');
    const track   = document.getElementById('propertyTrack');
    if (!wrapper || !track) return;

    // Stop JS animation
    if (window._propertyAnimId) cancelAnimationFrame(window._propertyAnimId);

    // Native scroll
    wrapper.style.overflowX       = 'auto';
    wrapper.style.overflowY       = 'hidden';
    wrapper.style.cursor          = 'grab';
    wrapper.style.scrollbarWidth  = 'none';
    wrapper.style.webkitOverflowScrolling = 'touch';

    track.style.transform    = 'none';
    track.style.animation    = 'none';
    track.style.width        = 'max-content';
    track.style.paddingLeft  = '16px';
    track.style.paddingRight = '16px';

    // Touch drag feel
    let isDown = false, startX = 0, scrollLeft = 0;

    wrapper.addEventListener('mousedown', e => {
      isDown = true;
      startX = e.pageX - wrapper.offsetLeft;
      scrollLeft = wrapper.scrollLeft;
      wrapper.style.cursor = 'grabbing';
    });
    window.addEventListener('mouseup',   () => { isDown = false; wrapper.style.cursor = 'grab'; });
    wrapper.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x    = e.pageX - wrapper.offsetLeft;
      const walk = (x - startX) * 1.2;
      wrapper.scrollLeft = scrollLeft - walk;
    });
  }

  /* ── 6. NAVBAR SCROLL ── */
  function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (!isMobile()) return;
      navbar.style.background     = window.scrollY > 80
        ? 'rgba(0,0,0,0.88)'
        : 'rgba(0,0,0,0.30)';
      navbar.style.backdropFilter = 'blur(14px)';
    }, { passive: true });
  }

  /* ── INIT ── */
  function init() {
    injectHamburger();
    injectMobileMenu();
    injectMobileSearchBar();
    injectBottomNav();
    initNavbarScroll();
    if (isMobile()) {
      fixPropertyCarousel();
      fixOffers();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Resize da ham ishga tushirish
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (isMobile()) fixPropertyCarousel();
    }, 200);
  });

})();