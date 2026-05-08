// Mobile Navigation Toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  
  // Animate hamburger to X
  const spans = menuBtn.querySelectorAll('span');
  if (navLinks.classList.contains('active')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
  } else {
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    const spans = menuBtn.querySelectorAll('span');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
  });
});

// Theme Toggle
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = themeToggleBtn.querySelector('.icon');

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeIcon.textContent = savedTheme === 'light' ? '🌙' : '🌞';
}

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  let targetTheme = 'light';
  
  if (currentTheme === 'light') {
    targetTheme = 'dark';
    themeIcon.textContent = '🌞';
  } else {
    themeIcon.textContent = '🌙';
  }
  
  document.documentElement.setAttribute('data-theme', targetTheme);
  localStorage.setItem('theme', targetTheme);
});

// Sticky Header Effect
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Scroll Reveal Animations using Intersection Observer
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      return;
    } else {
      entry.target.classList.add('active');
      observer.unobserve(entry.target);
    }
  });
}, revealOptions);

revealElements.forEach(el => {
  revealOnScroll.observe(el);
});



// Add subtle cursor trail or glow effect (optional playful interaction)
// Here we just add a dynamic subtle glow to cards when mouse moves over them
const cards = document.querySelectorAll('.soft-card');
cards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Set CSS variables for the mouse position
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});
// Project Slider Logic (Infinite Loop)
const projectGrid = document.getElementById('project-slider-grid');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const projectContainer = document.querySelector('.project-slider-container');

if (projectGrid && prevBtn && nextBtn) {
  let cards = Array.from(projectGrid.querySelectorAll('.project-card'));
  const cardCount = cards.length;
  
  // Clone cards for infinite effect
  cards.forEach(card => {
    const cloneBefore = card.cloneNode(true);
    const cloneAfter = card.cloneNode(true);
    projectGrid.appendChild(cloneAfter);
    projectGrid.insertBefore(cloneBefore, projectGrid.firstChild);
  });

  let currentIndex = cardCount; // Start at the first original card
  let isTransitioning = false;

  function getStep() {
    const firstCard = projectGrid.querySelector('.project-card');
    return firstCard.offsetWidth + 32; // card width + gap
  }

  function updateSlider(animate = true) {
    const step = getStep();
    if (!animate) {
      projectGrid.style.transition = 'none';
    } else {
      projectGrid.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
    }
    
    projectGrid.style.transform = `translateX(-${currentIndex * step}px)`;
  }

  function handleLoop() {
    const step = getStep();
    if (currentIndex >= cardCount * 2) {
      currentIndex = cardCount;
      updateSlider(false);
    } else if (currentIndex < cardCount) {
      currentIndex = cardCount * 2 - 1;
      updateSlider(false);
    }
    isTransitioning = false;
  }

  nextBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    updateSlider();
  });

  prevBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex--;
    updateSlider();
  });

  projectGrid.addEventListener('transitionend', handleLoop);

  // Initial position
  window.addEventListener('load', () => updateSlider(false));
  window.addEventListener('resize', () => updateSlider(false));
}

