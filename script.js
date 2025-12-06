// ==========================================
// AUTOMATIC GALLERY LOADER
// ==========================================
// This script automatically detects how many images you have
// Just upload images named: artwork-1.jpg, artwork-2.jpg, etc.
// The gallery will automatically display them all!

// Configuration - Change these to match your setup
const CONFIG = {
    // How many artworks to check for (set this high enough to cover all your images)
    maxArtworks: 100,
    
    // Image folder path
    imagePath: 'images/',
    
    // Supported image formats
    imageFormats: ['jpg', 'jpeg', 'png', 'webp'],
    
    // Default year for artworks
    defaultYear: '2024',
    
    // Default artwork info (you can customize these later in the code below)
    defaultTitle: 'Untitled',
    defaultSize: 'Canvas'
};

// Store detected artworks
let artworks = [];
let currentArtworkIndex = 0;

// ==========================================
// DETECT AND LOAD IMAGES
// ==========================================
async function detectArtworks() {
    const detectedArtworks = [];
    
    // Try to load images from artwork-1 up to maxArtworks
    for (let i = 1; i <= CONFIG.maxArtworks; i++) {
        let imageFound = false;
        
        // Try each image format
        for (const format of CONFIG.imageFormats) {
            const imagePath = `${CONFIG.imagePath}artwork-${i}.${format}`;
            
            // Check if image exists
            if (await imageExists(imagePath)) {
                detectedArtworks.push({
                    id: i,
                    image: imagePath,
                    title: `Artwork ${i}`,
                    details: `${CONFIG.defaultSize}, ${CONFIG.defaultYear}`,
                    alt: `Artwork ${i}`
                });
                imageFound = true;
                break; // Found the image, no need to check other formats
            }
        }
        
        // If we didn't find an image with this number, stop checking
        // (assumes artworks are numbered sequentially)
        if (!imageFound && detectedArtworks.length > 0) {
            break;
        }
    }
    
    return detectedArtworks;
}

// Check if an image exists
function imageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

// ==========================================
// BUILD GALLERY
// ==========================================
function buildGallery(artworksData) {
    const galleryGrid = document.getElementById('gallery-grid');
    
    if (artworksData.length === 0) {
        galleryGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
                <h3 style="font-family: var(--font-display); font-size: 2rem; margin-bottom: 1rem;">No Artworks Found</h3>
                <p style="color: var(--color-secondary); font-size: 1.1rem;">
                    Upload your artwork photos to the <strong>images/</strong> folder.<br>
                    Name them: <strong>artwork-1.jpg</strong>, <strong>artwork-2.jpg</strong>, etc.
                </p>
            </div>
        `;
        return;
    }
    
    // Clear existing content
    galleryGrid.innerHTML = '';
    
    // Create artwork cards
    artworksData.forEach((artwork, index) => {
        const card = document.createElement('div');
        card.className = 'artwork-card';
        card.dataset.artwork = artwork.id;
        card.style.animationDelay = `${0.1 * (index + 1)}s`;
        
        card.innerHTML = `
            <div class="artwork-image-wrapper">
                <img src="${artwork.image}" alt="${artwork.alt}" class="artwork-image" loading="lazy">
                <div class="artwork-overlay">
                    <span class="view-detail">View</span>
                </div>
            </div>
            <div class="artwork-info">
                <h3 class="artwork-title">${artwork.title}</h3>
                <p class="artwork-details">${artwork.details}</p>
            </div>
        `;
        
        // Add click event to open lightbox
        card.addEventListener('click', () => {
            currentArtworkIndex = index;
            openLightbox();
        });
        
        galleryGrid.appendChild(card);
    });
}

// ==========================================
// LIGHTBOX FUNCTIONALITY
// ==========================================
function openLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDetails = document.getElementById('lightbox-details');
    
    const artwork = artworks[currentArtworkIndex];
    
    lightboxImage.src = artwork.image;
    lightboxImage.alt = artwork.alt;
    lightboxTitle.textContent = artwork.title;
    lightboxDetails.textContent = artwork.details;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function showPrevious() {
    currentArtworkIndex = (currentArtworkIndex - 1 + artworks.length) % artworks.length;
    openLightbox();
}

function showNext() {
    currentArtworkIndex = (currentArtworkIndex + 1) % artworks.length;
    openLightbox();
}

// ==========================================
// INITIALIZE
// ==========================================
document.addEventListener('DOMContentLoaded', async function() {
    // Show loading message
    const galleryGrid = document.getElementById('gallery-grid');
    galleryGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
            <p style="color: var(--color-secondary); font-size: 1.2rem;">Loading gallery...</p>
        </div>
    `;
    
    // Detect and load artworks
    artworks = await detectArtworks();
    
    // Build the gallery
    buildGallery(artworks);
    
    // Set up lightbox controls
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    lightboxPrev.addEventListener('click', function(e) {
        e.stopPropagation();
        showPrevious();
    });
    
    lightboxNext.addEventListener('click', function(e) {
        e.stopPropagation();
        showNext();
    });
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevious();
                break;
            case 'ArrowRight':
                showNext();
                break;
        }
    });
    
    // Smooth scroll for internal links
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
    
    // Add subtle parallax effect to header
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.site-header');
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.5}px)`;
            header.style.opacity = Math.max(0.3, 1 - (scrolled / 500));
        }
    });
});

// ==========================================
// OPTIONAL: CUSTOMIZE ARTWORK INFO
// ==========================================
// If you want to add custom titles, sizes, or years for specific artworks,
// you can do it here. This runs after artworks are detected.
//
// Example:
// window.addEventListener('DOMContentLoaded', function() {
//     setTimeout(() => {
//         // Wait a bit for artworks to load, then customize
//         if (artworks.length > 0) {
//             artworks[0].title = "Sunset Dreams";
//             artworks[0].details = "Acrylic on Canvas, 2024 • 24\" × 36\"";
//             
//             artworks[1].title = "Ocean Waves";
//             artworks[1].details = "Oil on Canvas, 2023 • 30\" × 40\"";
//             
//             // Rebuild gallery with new info
//             buildGallery(artworks);
//         }
//     }, 1000);
// });