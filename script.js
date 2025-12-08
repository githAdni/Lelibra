// ==========================================
// LELIBRA GALLERY WITH MONETIZATION
// ==========================================

// 🎨 EDIT PRICES AND AVAILABILITY HERE
const ARTWORK_INFO = {
    1: { 
        title: "Allegoria della Vittoria", 
        date: "2025", 
        materials: "Oil on Canvas", 
        price: "$850", 
        available: true 
    },
    2: { 
        title: "La Dama con l'Ermellino", 
        date: "2025", 
        materials: "Oil on Canvas", 
        price: "$950", 
        available: true 
    },
    3: { 
        title: "Field of Sunflowers", 
        date: "2025", 
        materials: "Oil on Canvas", 
        price: "$1,200", 
        available: true 
    },
    4: { 
        title: "Salina", 
        date: "2024", 
        materials: "Watercolor on Paper", 
        price: "$450", 
        available: true 
    },
    5: { 
        title: "Green Moro", 
        date: "2024", 
        materials: "Oil on Canvas", 
        price: "$800", 
        available: true 
    },
    6: { 
        title: "One st.Valentine Day", 
        date: "2024", 
        materials: "Oil on Canvas", 
        price: "$750", 
        available: true 
    },
    7: { 
        title: "Cenacolo", 
        date: "2024", 
        materials: "Oil on Canvas", 
        price: "$1,100", 
        available: true 
    },
    8: { 
        title: "Poiseidon", 
        date: "2024", 
        materials: "Pencil on Paper", 
        price: "$300", 
        available: false    // ← MARKED AS SOLD FOR TESTING!
    },
    9: { 
        title: "Dillo coi Fiori #1", 
        date: "2024", 
        materials: "Watercolor on Paper", 
        price: "$400", 
        available: true 
    },
    10: { 
        title: "The Creator", 
        date: "2024", 
        materials: "Oil on Canvas", 
        price: "$900", 
        available: true 
    },
    11: { 
        title: "Famiglia", 
        date: "2024", 
        materials: "Oil on Canvas", 
        price: "$850", 
        available: true 
    },
    12: { 
        title: "Dillo coi Fiori #2", 
        date: "2024", 
        materials: "Watercolor on Paper", 
        price: "$400", 
        available: true 
    },
    13: { 
        title: "Dillo coi Fiori #3", 
        date: "2024", 
        materials: "Watercolor on Paper", 
        price: "$400", 
        available: true 
    }
};

// Configuration
const CONFIG = { 
    maxArtworks: 100, 
    imagePath: 'images/', 
    imageFormats: ['jpg', 'jpeg', 'png', 'webp'] 
};

let artworks = [];
let currentArtworkIndex = 0;

// Detect artworks
async function detectArtworks() {
    const detectedArtworks = [];
    for (let i = 1; i <= CONFIG.maxArtworks; i++) {
        let imageFound = false;
        for (const format of CONFIG.imageFormats) {
            const imagePath = `${CONFIG.imagePath}artwork-${i}.${format}`;
            if (await imageExists(imagePath)) {
                const info = ARTWORK_INFO[i] || { 
                    title: `Artwork ${i}`, 
                    date: '2024', 
                    materials: 'Canvas', 
                    price: 'Contact for Price', 
                    available: true 
                };
                detectedArtworks.push({ 
                    id: i, 
                    image: imagePath, 
                    title: info.title, 
                    details: `${info.materials} • ${info.date}`, 
                    price: info.price, 
                    available: info.available, 
                    alt: info.title 
                });
                imageFound = true;
                break;
            }
        }
        if (!imageFound && detectedArtworks.length > 0) break;
    }
    return detectedArtworks;
}

function imageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

// Build gallery
function buildGallery(artworksData) {
    const galleryGrid = document.getElementById('gallery-grid');
    
    if (artworksData.length === 0) {
        galleryGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; color: #F5F1E8;"><h3>No Artworks Found</h3></div>';
        return;
    }
    
    galleryGrid.innerHTML = '';
    
    artworksData.forEach((artwork, index) => {
        const card = document.createElement('div');
        card.className = 'artwork-card';
        card.dataset.artwork = artwork.id;
        card.style.animationDelay = `${0.1 * (index + 1)}s`;
        
        // Create badge
        const badge = artwork.available 
            ? '<span class="availability-badge available">Available</span>' 
            : '<span class="availability-badge sold">Sold</span>';
        
        // Build card
        card.innerHTML = `
            <div class="artwork-image-wrapper">
                <img src="${artwork.image}" alt="${artwork.alt}" class="artwork-image" loading="lazy">
                <div class="artwork-overlay">
                    <span class="view-detail">View Details</span>
                </div>
                ${badge}
            </div>
            <div class="artwork-info">
                <h3 class="artwork-title">${artwork.title}</h3>
                <p class="artwork-details">${artwork.details}</p>
                <p class="artwork-price">${artwork.price}</p>
                <div class="artwork-actions-container"></div>
            </div>
        `;
        
        // Add buttons or sold message
        const actionsContainer = card.querySelector('.artwork-actions-container');
        if (artwork.available) {
            actionsContainer.innerHTML = `
                <div class="artwork-actions">
                    <button class="btn-purchase">Purchase</button>
                    <button class="btn-inquire">Inquire</button>
                </div>
            `;
            actionsContainer.querySelector('.btn-purchase').addEventListener('click', function(e) { 
                e.stopPropagation(); 
                purchaseArtwork(artwork.id, artwork.title, artwork.price); 
            });
            actionsContainer.querySelector('.btn-inquire').addEventListener('click', function(e) { 
                e.stopPropagation(); 
                inquireArtwork(artwork.id, artwork.title); 
            });
        } else {
            actionsContainer.innerHTML = '<p class="sold-text">This piece has been sold</p>';
        }
        
        card.addEventListener('click', function() { 
            currentArtworkIndex = index; 
            openLightbox(); 
        });
        
        galleryGrid.appendChild(card);
    });
}

// Purchase & Inquire functions
function purchaseArtwork(artworkId, title, price) {
    window.location.href = 'mailto:adniquiz@gmail.com?subject=' + encodeURIComponent('Purchase Inquiry: ' + title) + '&body=' + encodeURIComponent('Hi,\n\nI would like to purchase:\n\nArtwork: ' + title + '\nPrice: ' + price + '\n\nPlease send me payment details.\n\nThank you!');
}

function inquireArtwork(artworkId, title) {
    window.location.href = 'mailto:adniquiz@gmail.com?subject=' + encodeURIComponent('Inquiry About: ' + title) + '&body=' + encodeURIComponent('Hi,\n\nI am interested in learning more about:\n\nArtwork: ' + title + '\n\nCould you provide more information?\n\nThank you!');
}

// Lightbox functions
function openLightbox() {
    const lightbox = document.getElementById('lightbox');
    const artwork = artworks[currentArtworkIndex];
    document.getElementById('lightbox-image').src = artwork.image;
    document.getElementById('lightbox-image').alt = artwork.alt;
    document.getElementById('lightbox-title').textContent = artwork.title;
    document.getElementById('lightbox-details').textContent = artwork.details + ' • ' + artwork.price;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
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

// Commission form
function submitCommission(event) {
    event.preventDefault();
    const form = document.getElementById('commissionForm');
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const artworkType = formData.get('artworkType');
    const size = formData.get('size') || 'Not specified';
    const description = formData.get('description');
    const budget = formData.get('budget') || 'Not specified';
    window.location.href = 'mailto:adniquiz@gmail.com?subject=' + encodeURIComponent('Commission Request from ' + name) + '&body=' + encodeURIComponent('Commission Request Details:\n\nName: ' + name + '\nEmail: ' + email + '\nArtwork Type: ' + artworkType + '\nSize: ' + size + '\nBudget: ' + budget + '\n\nDescription:\n' + description + '\n\nPlease respond with pricing and timeline information.');
    form.reset();
}

// Initialize
document.addEventListener('DOMContentLoaded', async function() {
    document.getElementById('gallery-grid').innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;"><p style="color: #D4AF37; font-size: 1.2rem;">Loading gallery...</p></div>';
    
    artworks = await detectArtworks();
    buildGallery(artworks);
    
    const lightbox = document.getElementById('lightbox');
    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.getElementById('lightbox-prev').addEventListener('click', function(e) { e.stopPropagation(); showPrevious(); });
    document.getElementById('lightbox-next').addEventListener('click', function(e) { e.stopPropagation(); showNext(); });
    lightbox.addEventListener('click', function(e) { if (e.target === lightbox) closeLightbox(); });
    
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        else if (e.key === 'ArrowLeft') showPrevious();
        else if (e.key === 'ArrowRight') showNext();
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
});