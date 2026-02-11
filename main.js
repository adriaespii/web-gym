/**
 * Golden Eagle Gym - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollEffects();
    initAnimations();
    initCountdown();
    updateCopyrightYear();
});

/**
 * Initialize Navigation Logic
 * - Mobile menu toggle
 * - Close menu on link click
 * - Sticky navbar effect
 * - Active link highlighting
 */
function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile Menu Toggle
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = menuToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                    const spans = menuToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        });
    });

    // Sticky Navbar Effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Highlight Active Link based on current URL
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (linkPath === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * Initialize Scroll Effects
 * - Smooth scrolling for anchor links
 */
function initScrollEffects() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
}

/**
 * Initialize Animations
 * - Intersection Observer for fade-in elements
 */
function initAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in-up, .card, .pricing-card, .section h2');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

/**
 * Initialize Countdown Timer
 * Only runs if .countdown-container exists
 */
function initCountdown() {
    const countdownContainer = document.getElementById('offerTimer');
    if (!countdownContainer) return;

    // Set duration to 24 hours in seconds (86400)
    const durationInSeconds = 24 * 60 * 60;
    
    // Check for existing end time or set new one
    let storedEndTime = localStorage.getItem('goldenEagleOfferEndTime');
    let now = new Date().getTime();

    if (!storedEndTime || now > parseInt(storedEndTime)) {
        const endTime = now + durationInSeconds * 1000;
        localStorage.setItem('goldenEagleOfferEndTime', endTime);
        storedEndTime = endTime;
    } else {
        storedEndTime = parseInt(storedEndTime);
    }

    function updateTimer() {
        now = new Date().getTime();
        let diff = storedEndTime - now;

        // If timer ends, reset it
        if (diff < 0) {
            const newEndTime = now + (24 * 60 * 60 * 1000); 
            localStorage.setItem('goldenEagleOfferEndTime', newEndTime);
            storedEndTime = newEndTime;
            diff = newEndTime - now;
        }

        let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Format with leading zeros
        const hoursStr = hours < 10 ? "0" + hours : hours;
        const minutesStr = minutes < 10 ? "0" + minutes : minutes;
        const secondsStr = seconds < 10 ? "0" + seconds : seconds;

        // Update DOM
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (hoursEl) hoursEl.textContent = hoursStr;
        if (minutesEl) minutesEl.textContent = minutesStr;
        if (secondsEl) secondsEl.textContent = secondsStr;
    }
    
    updateTimer(); // Initial call
    setInterval(updateTimer, 1000); // Update every second
}

/**
 * Update Copyright Year automatically
 */
function updateCopyrightYear() {
    const yearSpan = document.querySelector('.footer-bottom p');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        if (!yearSpan.textContent.includes(currentYear)) {
            yearSpan.innerHTML = yearSpan.innerHTML.replace(/\d{4}/, currentYear);
        }
    }
}
