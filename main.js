// 

// 

// 1. Navbar scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.style.background = 'rgba(0,0,0,0.80)';
      navbar.style.backdropFilter = 'blur(14px)';
    } else {
      navbar.style.background = 'rgba(255,255,255,0.02)';
      navbar.style.backdropFilter = 'blur(4px)';
    }
  });
}

// 2. Search button
function handleSearch() {
  const input = document.querySelector('.search-input');
  const query = input ? input.value.trim() : '';
  if (query) {
    console.log('Searching:', query);
  } else {
    input && input.focus();
  }
}

// 3. Category navigation
function navigate(event, category) {
  event.preventDefault();
  console.log('Category:', category);
}

// 4. Infinite carousel factory
function initCarousel(trackId, wrapperId, speed) {
  const track = document.getElementById(trackId);
  const wrapper = wrapperId ? document.getElementById(wrapperId) : track?.parentElement;
  if (!track || !wrapper) return;

  let x = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragScrollX = 0;
  let animId = null;
  let paused = false;

  function halfWidth() {
    return track.scrollWidth / 2;
  }

  function tick() {
    if (!isDragging && !paused) {
      x += speed;
      if (x >= halfWidth()) x -= halfWidth();
      track.style.transform = `translateX(-${x}px)`;
    }
    animId = requestAnimationFrame(tick);
  }

  animId = requestAnimationFrame(tick);

  // Pause when tab is hidden
  document.addEventListener('visibilitychange', () => {
    paused = document.hidden;
  });

  // Mouse drag
  wrapper.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    dragScrollX = x;
    wrapper.style.cursor = 'grabbing';
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const delta = dragStartX - e.clientX;
    x = dragScrollX + delta;
    const h = halfWidth();
    if (x < 0) x += h;
    if (x >= h) x -= h;
    track.style.transform = `translateX(-${x}px)`;
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    wrapper.style.cursor = 'grab';
  });

  // Touch drag
  wrapper.addEventListener('touchstart', (e) => {
    isDragging = true;
    dragStartX = e.touches[0].clientX;
    dragScrollX = x;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const delta = dragStartX - e.touches[0].clientX;
    x = dragScrollX + delta;
    const h = halfWidth();
    if (x < 0) x += h;
    if (x >= h) x -= h;
    track.style.transform = `translateX(-${x}px)`;
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

// Init carousels
initCarousel('carouselTrack', 'destWrapper', 0.6);




initCarousel('propertyTrack', 'propertyWrapper', 0.6);