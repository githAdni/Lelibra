// ==========================================
// AUTOMATIC GALLERY LOADER WITH CUSTOM INFO
// ==========================================

// ==========================================
// 🎨 CUSTOMIZE YOUR ARTWORK INFO HERE
// ==========================================
// Add title, date, and materials for each artwork
// Just change the number to match your image (artwork-1.jpg = artwork 1, etc.)

const ARTWORK_INFO = {
    1: {
        title: "Allegoria della Vittoria",
        date: "2025",
        materials: "Oil on Canvas"
    },
    2: {
        title: "La Dama con l'ermellino",
        date: "2025",
        materials: "Oil on Canvas"
    },
    3: {
        title: "Field of sunflowers",
        date: "2025",
        materials: "Oil on Canvas"
    },
    4: {
        title: "Salina",
        date: "2024",
        materials: "Watercolor on Paper"
    },
    5: {
        title: "Green Moro",
        date: "2024",
        materials: "Oil on Canvas"
    },
    6: {
        title: "One st.Valentine day",
        date: "2024",
        materials: "Oil on Canvas"
    },
    7: {
        title: "Cenacolo",
        date: "2024",
        materials: "Oil on Canvas"
    },
    8: {
        title: "Poiseidon",
        date: "2024",
        materials: "Pencil on Paper"
    },
    9: {
        title: "Dillo coi Fiori #1",
        date: "2024",
        materials: "Watercolor on Paper"
    },
    10: {
        title: "The Creator",
        date: "2024",
        materials: "Oil on Canvas"
    },
    11: {
        title: "Famiglia",
        date: "2024",
        materials: "Oil on Canvas"
    },
    12: {
        title: "Dillo coi Fiori #2",
        date: "2024",
        materials: "Watercolor on Paper"
    },
    13: {
        title: "Dillo coi Fiori #3",
        date: "2024",
        materials: "Watercolor on Paper"
    
};

// Configuration
const CONFIG = {
    maxArtworks: 100,
    imagePath: 'images/',
    imageFormats: ['jpg', 'jpeg', 'png', 'webp']
};

// Store detected artworks
let artworks = [];
let currentArtworkIndex = 0;

// ==========================================
// DETECT AND LOAD IMAGES
// ==========================================
async function detectArtworks() {
    const detectedArtworks = [];
    
    for (let i = 1; i <= CONFIG.maxArtworks; i++) {
        let imageFound = false;
        
        for (const format of CONFIG.imageFormats) {
            const imagePath = `${CONFIG.imagePath}artwork-${i}.${format}`;
            
            if (await imageExists(imagePath)) {
                // Get custom info or use defaults
                const info = ARTWORK_INFO[i] || {
                    title: `Artwork ${i}`,
                    date: '2024',
                    materials: 'Canvas'
                };
                
                detectedArtworks.push({
                    id: i,
                    image: imagePath,
                    title: info.title,
                    details: `${info.materials} • ${info.date}`,
                    alt: info.title
                });
                imageFound = true;
                break;
            }
        }
        
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
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; color: #F5F1E8;">
                <h3 style="font-family: 'Playfair Display', serif; font-size: 2rem; margin-bottom: 1rem;">No Artworks Found</h3>
                <p style="color: #D4AF37; font-size: 1.1rem;">
                    Upload your artwork photos to the <strong>images/</strong> folder.<br>
                    Name them: <strong>artwork-1.jpg</strong>, <strong>artwork-2.jpg</strong>, etc.
                </p>
            </div>
        `;
        return;
    }
    
    galleryGrid.innerHTML = '';
    
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
    const galleryGrid = document.getElementById('gallery-grid');
    galleryGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
            <p style="color: #D4AF37; font-size: 1.2rem;">Loading gallery...</p>
        </div>
    `;
    
    artworks = await detectArtworks();
    buildGallery(artworks);
    
    // Set up lightbox controls
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrevious();
    });
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        showNext();
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
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
    
    // Smooth scroll
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
});
