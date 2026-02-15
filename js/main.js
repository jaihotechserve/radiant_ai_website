// ===========================
// Image Data Configuration
// ===========================


const imageData = [
    { after: 'assets/woman_1_before.png', before: 'assets/woman_1_after.JPG', title: 'Portrait Enhancement 1' },
    { after: 'assets/woman_2_before.png', before: 'assets/woman_2_after.JPG', title: 'Portrait Enhancement 2' },
    { after: 'assets/woman_3_before.png', before: 'assets/woman_3_after.JPG', title: 'Portrait Enhancement 3' },
    { after: 'assets/woman_5_before.png', before: 'assets/woman_5_after.JPG', title: 'Portrait Enhancement 4' },
    { after: 'assets/couple_2_before.png', before: 'assets/couple_2_after.JPG', title: 'Couple Portrait 1' },
    { after: 'assets/couple_3_before.jpg', before: 'assets/couple_3_after.JPG', title: 'Couple Portrait 2' }
];

// ===========================
// Hero Slider Initialization
// ===========================
let currentHeroSlide = 0;
let heroSlideInterval;

function initHeroSlider() {
    const sliderContainer = document.getElementById('heroSlider');
    const indicatorsContainer = document.getElementById('heroIndicators');
    
    if (!sliderContainer || !indicatorsContainer) return;
    
    // Create slides
    imageData.forEach((item, index) => {
        const slide = document.createElement('div');
        slide.className = `slider-slide ${index === 0 ? 'active' : ''}`;
        
        const comparisonContainer = createComparisonSlider(item.before, item.after, index);
        slide.appendChild(comparisonContainer);
        
        sliderContainer.appendChild(slide);
        
        // Create indicator
        const indicator = document.createElement('button');
        indicator.className = `slide-indicator ${index === 0 ? 'active' : ''}`;
        indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
        indicator.addEventListener('click', () => goToHeroSlide(index));
        indicatorsContainer.appendChild(indicator);
    });
    
    // Navigation buttons
    document.getElementById('heroPrev').addEventListener('click', () => changeHeroSlide(-1));
    document.getElementById('heroNext').addEventListener('click', () => changeHeroSlide(1));
    
    // Auto-advance slides
    startHeroSlider();
    
    // Pause on hover
    sliderContainer.addEventListener('mouseenter', stopHeroSlider);
    sliderContainer.addEventListener('mouseleave', startHeroSlider);
}

function createComparisonSlider(beforeImg, afterImg, index) {
    const container = document.createElement('div');
    container.className = 'comparison-container relative w-full h-full';
    container.style.minHeight = '400px';
    
    // Before image (full)
    const beforeDiv = document.createElement('div');
    beforeDiv.className = 'comparison-before';
    const beforeImage = document.createElement('img');
    beforeImage.src = beforeImg;
    beforeImage.alt = 'Before correction';
    beforeImage.className = 'w-full h-full object-cover';
    beforeDiv.appendChild(beforeImage);
    
    // After image (clipped)
    const afterDiv = document.createElement('div');
    afterDiv.className = 'comparison-after';
    afterDiv.id = `comparison-after-${index}`;
    const afterImage = document.createElement('img');
    afterImage.src = afterImg;
    afterImage.alt = 'After correction';
    afterImage.className = 'w-full h-full object-cover';
    afterDiv.appendChild(afterImage);
    
    // Slider handle
    const slider = document.createElement('div');
    slider.className = 'comparison-slider';
    slider.id = `comparison-slider-${index}`;
    
    // Labels
    const beforeLabel = document.createElement('div');
    beforeLabel.className = 'comparison-label before';
    beforeLabel.textContent = 'Before';
    
    const afterLabel = document.createElement('div');
    afterLabel.className = 'comparison-label after';
    afterLabel.textContent = 'After';
    
    container.appendChild(beforeDiv);
    container.appendChild(afterDiv);
    container.appendChild(slider);
    container.appendChild(beforeLabel);
    container.appendChild(afterLabel);
    
    // Make slider interactive
    makeSliderInteractive(container, afterDiv, slider, index);
    
    return container;
}

function makeSliderInteractive(container, afterDiv, slider, index) {
    let isDragging = false;
    
    const updateSlider = (clientX) => {
        const rect = container.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        
        afterDiv.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
        slider.style.left = `${percentage}%`;
    };
    
    // Mouse events
    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
    });
    
    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updateSlider(e.clientX);
    });
    
    container.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    container.addEventListener('mouseleave', () => {
        isDragging = false;
    });
    
    // Touch events
    slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        e.preventDefault();
    });
    
    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        updateSlider(touch.clientX);
    });
    
    container.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    // Click to position
    container.addEventListener('click', (e) => {
        if (e.target !== slider) {
            updateSlider(e.clientX);
        }
    });
}

function changeHeroSlide(direction) {
    const slides = document.querySelectorAll('#heroSlider .slider-slide');
    const indicators = document.querySelectorAll('#heroIndicators .slide-indicator');
    
    slides[currentHeroSlide].classList.remove('active');
    indicators[currentHeroSlide].classList.remove('active');
    
    currentHeroSlide = (currentHeroSlide + direction + slides.length) % slides.length;
    
    slides[currentHeroSlide].classList.add('active');
    indicators[currentHeroSlide].classList.add('active');
}

function goToHeroSlide(index) {
    const slides = document.querySelectorAll('#heroSlider .slider-slide');
    const indicators = document.querySelectorAll('#heroIndicators .slide-indicator');
    
    slides[currentHeroSlide].classList.remove('active');
    indicators[currentHeroSlide].classList.remove('active');
    
    currentHeroSlide = index;
    
    slides[currentHeroSlide].classList.add('active');
    indicators[currentHeroSlide].classList.add('active');
}

function startHeroSlider() {
    stopHeroSlider();
    heroSlideInterval = setInterval(() => {
        changeHeroSlide(1);
    }, 5000);
}

function stopHeroSlider() {
    if (heroSlideInterval) {
        clearInterval(heroSlideInterval);
    }
}

// ===========================
// GSAP Scroll Animations
// ===========================
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded');
        return;
    }
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Reveal elements on scroll
    const revealElements = document.querySelectorAll('.reveal');
    
    revealElements.forEach((element, index) => {
        gsap.fromTo(element, 
            {
                opacity: 0,
                y: 30
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                delay: (index % 3) * 0.1
            }
        );
    });
    
    // Parallax effect for hero section
    const heroGradient = document.querySelector('.hero-gradient .absolute');
    if (heroGradient) {
        gsap.to(heroGradient, {
            yPercent: 50,
            ease: "none",
            scrollTrigger: {
                trigger: ".hero-gradient",
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }
}

// ===========================
// Navbar Scroll Effect
// ===========================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('shadow-md');
            navbar.classList.remove('bg-white/80');
            navbar.classList.add('bg-white/95');
        } else {
            navbar.classList.remove('shadow-md');
            navbar.classList.remove('bg-white/95');
            navbar.classList.add('bg-white/80');
        }
        
        lastScroll = currentScroll;
    });
}

// ===========================
// Smooth Scroll for Links
// ===========================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===========================
// Feature Card Hover Effects
// ===========================
function initFeatureCards() {
    if (typeof gsap === 'undefined') return;
    
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
}

// ===========================
// Contact Modal
// ===========================
function initContactModal() {
    const modal = document.getElementById('contactModal');
    const openButtons = document.querySelectorAll('#getAccessBtn, #getTrialBtn');
    const closeButton = document.getElementById('closeModal');
    
    if (!modal) return;
    
    openButtons.forEach(button => {
        button.addEventListener('click', () => {
            modal.classList.remove('hidden');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
    
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.classList.add('hidden');
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.add('hidden');
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===========================
// Mobile Menu Toggle
// ===========================
function initMobileMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');

        // Optional: Animate hamburger to X
        menuBtn.classList.toggle('open');
        const spans = menuBtn.querySelectorAll('span');

        if (menuBtn.classList.contains('open')) {
            spans[0].classList.add('rotate-45', 'translate-y-2');
            spans[1].classList.add('opacity-0');
            spans[2].classList.add('-rotate-45', '-translate-y-2');
        } else {
            spans[0].classList.remove('rotate-45', 'translate-y-2');
            spans[1].classList.remove('opacity-0');
            spans[2].classList.remove('-rotate-45', '-translate-y-2');
        }
    });
}


// ===========================
// Initialize Everything
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();
    initNavbar();
    initSmoothScroll();
    initContactModal();
    initMobileMenu();
    
    // Initialize GSAP animations after a short delay to ensure DOM is ready
    setTimeout(() => {
        initScrollAnimations();
        initFeatureCards();
    }, 100);
});

// ===========================
// Page Load Animation
// ===========================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
