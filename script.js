// Gallery data structure
const artworks = [
    {
        id: 1,
        image: 'images/artwork-1.jpg',
        title: 'Artwork Title 1',
        details: 'Canvas, 2024 • 24" × 36"',
        alt: 'Artwork Title 1'
    },
    {
        id: 2,
        image: 'images/artwork-2.jpg',
        title: 'Artwork Title 2',
        details: 'Canvas, 2024 • 18" × 24"',
        alt: 'Artwork Title 2'
    },
    {
        id: 3,
        image: 'images/artwork-3.jpg',
        title: 'Artwork Title 3',
        details: 'Canvas, 2024 • 30" × 40"',
        alt: 'Artwork Title 3'
    },
    {
        id: 4,
        image: 'images/artwork-4.jpg',
        title: 'Artwork Title 4',
        details: 'Canvas, 2024 • 20" × 20"',
        alt: 'Artwork Title 4'
    },
    {
        id: 5,
        image: 'images/artwork-5.jpg',
        title: 'Artwork Title 5',
        details: 'Canvas, 2024 • 16" × 20"',
        alt: 'Artwork Title 5'
    },
    {
        id: 6,
        image: 'images/artwork-6.jpg',
        title: 'Artwork Title 6',
        details: 'Canvas, 2024 • 24" × 30"',
        alt: 'Artwork Title 6'
    }
];

// Current artwork index for lightbox navigation
let currentArtworkIndex = 0;

// Initialize lightbox functionality
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDetails = document.getElementById('lightbox-details');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const artworkCards = document.querySelectorAll('.artwork-card');

    // Open lightbox when clicking on artwork card
    artworkCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            currentArtworkIndex = index;
            openLightbox();
        });
    });

    // Open lightbox function
    function openLightbox() {
        const artwork = artworks[currentArtworkIndex];
        lightboxImage.src = artwork.image;
        lightboxImage.alt = artwork.alt;
        lightboxTitle.textContent = artwork.title;
        lightboxDetails.textContent = artwork.details;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close lightbox function
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Show previous artwork
    function showPrevious() {
        currentArtworkIndex = (currentArtworkIndex - 1 + artworks.length) % artworks.length;
        openLightbox();
    }

    // Show next artwork
    function showNext() {
        currentArtworkIndex = (currentArtworkIndex + 1) % artworks.length;
        openLightbox();
    }

    // Event listeners for lightbox controls
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

    // Smooth scroll for internal links (if you add navigation later)
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

    // Add subtle parallax effect to header (optional enhancement)
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.site-header');
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.5}px)`;
            header.style.opacity = 1 - (scrolled / 500);
        }
    });
});