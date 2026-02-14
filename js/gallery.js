// ===========================
// Gallery Image Data
// ===========================
/*const galleryImages = [
    { before: 'assets/woman_1_before.png', after: 'assets/woman_1_after.JPG', title: 'Portrait Enhancement 1' },
    { before: 'assets/woman_2_before.png', after: 'assets/woman_2_after.JPG', title: 'Portrait Enhancement 2' },
    { before: 'assets/woman_3_before.png', after: 'assets/woman_3_after.JPG', title: 'Portrait Enhancement 3' },
    { before: 'assets/woman_5_before.png', after: 'assets/woman_5_after.JPG', title: 'Portrait Enhancement 4' },
    { before: 'assets/couple_2_before.png', after: 'assets/couple_2_after.JPG', title: 'Couple Portrait 1' },
    { before: 'assets/couple_3_before.jpg', after: 'assets/couple_3_after.JPG', title: 'Couple Portrait 2' }
];*/

const galleryImages = [
    { after: 'assets/woman_1_before.png', before: 'assets/woman_1_after.JPG', title: 'Portrait Enhancement 1' },
    { after: 'assets/woman_2_before.png', before: 'assets/woman_2_after.JPG', title: 'Portrait Enhancement 2' },
    { after: 'assets/woman_3_before.png', before: 'assets/woman_3_after.JPG', title: 'Portrait Enhancement 3' },
    { after: 'assets/woman_5_before.png', before: 'assets/woman_5_after.JPG', title: 'Portrait Enhancement 4' },
    { after: 'assets/couple_2_before.png', before: 'assets/couple_2_after.JPG', title: 'Couple Portrait 1' },
    { after: 'assets/couple_3_before.jpg', before: 'assets/couple_3_after.JPG', title: 'Couple Portrait 2' }
];

let currentModalImage = 0;

// ===========================
// Initialize Gallery Grid
// ===========================
function initGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    galleryImages.forEach((item, index) => {
        const galleryItem = createGalleryItem(item, index);
        galleryGrid.appendChild(galleryItem);
    });
}

// ===========================
// Create Gallery Item
// ===========================
function createGalleryItem(item, index) {
    const container = document.createElement('div');
    container.className = 'gallery-item bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden reveal';
    container.setAttribute('data-index', index);
    
    // Create comparison container
    const comparisonDiv = document.createElement('div');
    comparisonDiv.className = 'comparison-container relative';
    comparisonDiv.style.height = '400px';
    
    // Before image
    const beforeDiv = document.createElement('div');
    beforeDiv.className = 'comparison-before';
    const beforeImage = document.createElement('img');
    beforeImage.src = item.before;
    beforeImage.alt = 'Before correction';
    beforeImage.className = 'w-full h-full object-cover';
    beforeDiv.appendChild(beforeImage);
    
    // After image
    const afterDiv = document.createElement('div');
    afterDiv.className = 'comparison-after';
    afterDiv.id = `gallery-after-${index}`;
    const afterImage = document.createElement('img');
    afterImage.src = item.after;
    afterImage.alt = 'After correction';
    afterImage.className = 'w-full h-full object-cover';
    afterDiv.appendChild(afterImage);
    
    // Slider handle
    const slider = document.createElement('div');
    slider.className = 'comparison-slider';
    slider.id = `gallery-slider-${index}`;
    
    // Labels
    const beforeLabel = document.createElement('div');
    beforeLabel.className = 'comparison-label before';
    beforeLabel.textContent = 'Before';
    
    const afterLabel = document.createElement('div');
    afterLabel.className = 'comparison-label after';
    afterLabel.textContent = 'After';
    
    comparisonDiv.appendChild(beforeDiv);
    comparisonDiv.appendChild(afterDiv);
    comparisonDiv.appendChild(slider);
    comparisonDiv.appendChild(beforeLabel);
    comparisonDiv.appendChild(afterLabel);
    
    // Make slider interactive
    makeGallerySliderInteractive(comparisonDiv, afterDiv, slider);
    
    // Info section
    const infoDiv = document.createElement('div');
    infoDiv.className = 'p-6';
    
    const title = document.createElement('h3');
    title.className = 'font-display text-xl font-semibold text-slate-900 mb-2';
    title.textContent = item.title;
    
    const description = document.createElement('p');
    description.className = 'text-sm text-slate-600 mb-4';
    description.textContent = 'Click to view in full size with interactive comparison';
    
    const viewButton = document.createElement('button');
    viewButton.className = 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all';
    viewButton.textContent = 'View Full Size';
    viewButton.addEventListener('click', (e) => {
        e.stopPropagation();
        openImageModal(index);
    });
    
    infoDiv.appendChild(title);
    infoDiv.appendChild(description);
    infoDiv.appendChild(viewButton);
    
    container.appendChild(comparisonDiv);
    container.appendChild(infoDiv);
    
    // Click anywhere on card to open modal
    container.addEventListener('click', () => openImageModal(index));
    
    return container;
}

// ===========================
// Gallery Slider Interaction
// ===========================
function makeGallerySliderInteractive(container, afterDiv, slider) {
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
        e.stopPropagation();
    });
    
    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.stopPropagation();
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
        e.stopPropagation();
    });
    
    container.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.stopPropagation();
        const touch = e.touches[0];
        updateSlider(touch.clientX);
    });
    
    container.addEventListener('touchend', () => {
        isDragging = false;
    });
}

// ===========================
// Image Modal
// ===========================
function openImageModal(index) {
    currentModalImage = index;
    const modal = document.getElementById('imageModal');
    const modalTitle = document.getElementById('modalTitle');
    const imageContainer = document.getElementById('modalImageContainer');
    
    if (!modal || !modalTitle || !imageContainer) return;
    
    const item = galleryImages[index];
    
    // Update title
    modalTitle.textContent = item.title;
    
    // Clear previous content
    imageContainer.innerHTML = '';
    
    // Create comparison slider
    const comparisonDiv = document.createElement('div');
    comparisonDiv.className = 'comparison-container relative w-full';
    comparisonDiv.style.height = '600px';
    
    // Before image
    const beforeDiv = document.createElement('div');
    beforeDiv.className = 'comparison-before';
    const beforeImage = document.createElement('img');
    beforeImage.src = item.before;
    beforeImage.alt = 'Before correction';
    beforeImage.className = 'w-full h-full object-contain bg-slate-900';
    beforeDiv.appendChild(beforeImage);
    
    // After image
    const afterDiv = document.createElement('div');
    afterDiv.className = 'comparison-after';
    afterDiv.id = 'modal-after';
    const afterImage = document.createElement('img');
    afterImage.src = item.after;
    afterImage.alt = 'After correction';
    afterImage.className = 'w-full h-full object-contain bg-slate-900';
    afterDiv.appendChild(afterImage);
    
    // Slider handle
    const slider = document.createElement('div');
    slider.className = 'comparison-slider';
    slider.id = 'modal-slider';
    
    // Labels
    const beforeLabel = document.createElement('div');
    beforeLabel.className = 'comparison-label before';
    beforeLabel.textContent = 'Before';
    
    const afterLabel = document.createElement('div');
    afterLabel.className = 'comparison-label after';
    afterLabel.textContent = 'After';
    
    comparisonDiv.appendChild(beforeDiv);
    comparisonDiv.appendChild(afterDiv);
    comparisonDiv.appendChild(slider);
    comparisonDiv.appendChild(beforeLabel);
    comparisonDiv.appendChild(afterLabel);
    
    imageContainer.appendChild(comparisonDiv);
    
    // Make slider interactive
    makeModalSliderInteractive(comparisonDiv, afterDiv, slider);
    
    // Show modal
    modal.classList.remove('hidden');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (!modal) return;
    
    modal.classList.add('hidden');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function makeModalSliderInteractive(container, afterDiv, slider) {
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
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        updateSlider(e.clientX);
    });
    
    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Touch events
    slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        e.preventDefault();
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const touch = e.touches[0];
        updateSlider(touch.clientX);
    });
    
    document.addEventListener('touchend', () => {
        isDragging = false;
    });
    
    // Click to position
    container.addEventListener('click', (e) => {
        if (e.target !== slider) {
            updateSlider(e.clientX);
        }
    });
}

// ===========================
// Modal Navigation
// ===========================
function navigateModal(direction) {
    currentModalImage = (currentModalImage + direction + galleryImages.length) % galleryImages.length;
    openImageModal(currentModalImage);
}

// ===========================
// Contact Modal (Gallery Page)
// ===========================
function initContactModal() {
    const modal = document.getElementById('contactModal');
    const openButton = document.getElementById('galleryGetTrialBtn');
    const closeButton = document.getElementById('closeModal');
    
    if (!modal) return;
    
    if (openButton) {
        openButton.addEventListener('click', () => {
            modal.classList.remove('hidden');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
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
}

// ===========================
// Scroll Animations
// ===========================
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn('GSAP or ScrollTrigger not loaded');
        return;
    }
    
    gsap.registerPlugin(ScrollTrigger);
    
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
}

// ===========================
// Initialize Everything
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    initGallery();
    initContactModal();
    
    // Modal controls
    const closeModalBtn = document.getElementById('closeImageModal');
    const prevBtn = document.getElementById('modalPrev');
    const nextBtn = document.getElementById('modalNext');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeImageModal);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => navigateModal(-1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigateModal(1));
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const modal = document.getElementById('imageModal');
        if (!modal || !modal.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeImageModal();
        } else if (e.key === 'ArrowLeft') {
            navigateModal(-1);
        } else if (e.key === 'ArrowRight') {
            navigateModal(1);
        }
    });
    
    // Close on backdrop click
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                closeImageModal();
            }
        });
    }
    
    // Initialize GSAP animations
    setTimeout(() => {
        initScrollAnimations();
    }, 100);
});