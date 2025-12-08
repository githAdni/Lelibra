// LELIBRA BILINGUAL GALLERY
const ARTWORK_INFO = {
    1: { title: "Allegoria della Vittoria", date: "2025", materials: "Oil on Canvas", materialsIT: "Olio su Tela", dimensions: '60cm x 90cm', price: "800 EUR", available: false },
    2: { title: "La Dama con l'Ermellino", date: "2025", materials: "Oil on Canvas", materialsIT: "Olio su Tela", dimensions: '50cm x 75cm', price: "900 EUR", available: true },
    3: { title: "Field of Sunflowers", date: "2025", materials: "Oil on Canvas", materialsIT: "Olio su Tela", dimensions: '75cm x 100cm', price: "1100 EUR", available: true },
    4: { title: "Salina", date: "2024", materials: "Watercolor on Paper", materialsIT: "Acquerello su Carta", dimensions: '28cm x 35cm', price: "400 EUR", available: true },
    5: { title: "Green Moro", date: "2024", materials: "Oil on Canvas", materialsIT: "Olio su Tela", dimensions: '60cm x 90cm', price: "750 EUR", available: true },
    6: { title: "One st.Valentine Day", date: "2024", materials: "Oil on Canvas", materialsIT: "Olio su Tela", dimensions: '50cm x 60cm', price: "700 EUR", available: true },
    7: { title: "Cenacolo", date: "2024", materials: "Oil on Canvas", materialsIT: "Olio su Tela", dimensions: '90cm x 120cm', price: "1000 EUR", available: true },
    8: { title: "Poiseidon", date: "2024", materials: "Pencil on Paper", materialsIT: "Matita su Carta", dimensions: '20cm x 25cm', price: "280 EUR", available: true },
    9: { title: "Dillo coi Fiori #1", date: "2024", materials: "Watercolor on Paper", materialsIT: "Acquerello su Carta", dimensions: '23cm x 30cm', price: "350 EUR", available: true },
    10: { title: "The Creator", date: "2024", materials: "Oil on Canvas", materialsIT: "Olio su Tela", dimensions: '75cm x 100cm', price: "850 EUR", available: true },
    11: { title: "Famiglia", date: "2024", materials: "Oil on Canvas", materialsIT: "Olio su Tela", dimensions: '60cm x 90cm', price: "800 EUR", available: false },
    12: { title: "Dillo coi Fiori #2", date: "2024", materials: "Watercolor on Paper", materialsIT: "Acquerello su Carta", dimensions: '23cm x 30cm', price: "350 EUR", available: true },
    13: { title: "Dillo coi Fiori #3", date: "2024", materials: "Watercolor on Paper", materialsIT: "Acquerello su Carta", dimensions: '23cm x 30cm', price: "350 EUR", available: true }
};

const CONFIG = { maxArtworks: 100, imagePath: 'images/', imageFormats: ['jpg', 'jpeg', 'png', 'webp'] };
let artworks = [];
let currentArtworkIndex = 0;
let currentLang = 'en';

const translations = {
    en: { available: 'Available', sold: 'Sold', soldText: 'This piece has been sold', purchase: 'Purchase', inquire: 'Inquire', loading: 'Loading gallery...', viewDetails: 'View Details', purchaseInquiry: 'Purchase Inquiry', inquiryAbout: 'Inquiry About Artwork' },
    it: { available: 'Disponibile', sold: 'Venduto', soldText: 'Questa opera e\' stata venduta', purchase: 'Acquista', inquire: 'Informazioni', loading: 'Caricamento galleria...', viewDetails: 'Vedi Dettagli', purchaseInquiry: 'Richiesta di Acquisto', inquiryAbout: 'Informazioni sull\'Opera' }
};

async function detectArtworks() {
    const detectedArtworks = [];
    for (let i = 1; i <= CONFIG.maxArtworks; i++) {
        let imageFound = false;
        for (const format of CONFIG.imageFormats) {
            const imagePath = CONFIG.imagePath + 'artwork-' + i + '.' + format;
            if (await imageExists(imagePath)) {
                const info = ARTWORK_INFO[i] || { title: 'Artwork ' + i, date: '2024', materials: 'Canvas', materialsIT: 'Tela', dimensions: '', price: 'Contact for Price', available: true };
                detectedArtworks.push({ id: i, image: imagePath, title: info.title, materials: info.materials, materialsIT: info.materialsIT || info.materials, dimensions: info.dimensions, date: info.date, price: info.price, available: info.available, alt: info.title });
                imageFound = true;
                break;
            }
        }
        if (!imageFound && detectedArtworks.length > 0) break;
    }
    return detectedArtworks;
}

function imageExists(url) {
    return new Promise(function(resolve) {
        const img = new Image();
        img.onload = function() { resolve(true); };
        img.onerror = function() { resolve(false); };
        img.src = url;
    });
}

function buildGallery(artworksData) {
    const galleryGrid = document.getElementById('gallery-grid');
    if (artworksData.length === 0) {
        galleryGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem; color: #F5F1E8;"><h3>No Artworks Found</h3></div>';
        return;
    }
    galleryGrid.innerHTML = '';
    artworksData.forEach(function(artwork, index) {
        const card = document.createElement('div');
        card.className = 'artwork-card';
        card.dataset.artwork = artwork.id;
        card.style.animationDelay = (0.1 * (index + 1)) + 's';
        const materials = currentLang === 'it' ? artwork.materialsIT : artwork.materials;
        let details = materials;
        if (artwork.dimensions) details += ' - ' + artwork.dimensions;
        details += ' - ' + artwork.date;
        const badge = artwork.available ? '<span class="availability-badge available">' + translations[currentLang].available + '</span>' : '<span class="availability-badge sold">' + translations[currentLang].sold + '</span>';
        card.innerHTML = '<div class="artwork-image-wrapper"><img src="' + artwork.image + '" alt="' + artwork.alt + '" class="artwork-image" loading="lazy"><div class="artwork-overlay"><span class="view-detail">' + translations[currentLang].viewDetails + '</span></div>' + badge + '</div><div class="artwork-info"><h3 class="artwork-title">' + artwork.title + '</h3><p class="artwork-details">' + details + '</p><p class="artwork-price">' + artwork.price + '</p><div class="artwork-actions-container"></div></div>';
        const actionsContainer = card.querySelector('.artwork-actions-container');
        if (artwork.available) {
            actionsContainer.innerHTML = '<div class="artwork-actions"><button class="btn-purchase">' + translations[currentLang].purchase + '</button><button class="btn-inquire">' + translations[currentLang].inquire + '</button></div>';
            actionsContainer.querySelector('.btn-purchase').addEventListener('click', function(e) { e.stopPropagation(); openPurchaseForm(artwork.id, artwork.title, artwork.price); });
            actionsContainer.querySelector('.btn-inquire').addEventListener('click', function(e) { e.stopPropagation(); openInquiryForm(artwork.id, artwork.title); });
        } else {
            actionsContainer.innerHTML = '<p class="sold-text">' + translations[currentLang].soldText + '</p>';
        }
        card.addEventListener('click', function() { currentArtworkIndex = index; openLightbox(); });
        galleryGrid.appendChild(card);
    });
}

function openPurchaseForm(artworkId, title, price) {
    const modal = document.getElementById('contactModal');
    document.getElementById('contactFormTitle').textContent = translations[currentLang].purchaseInquiry;
    document.getElementById('contactFormSubtitle').textContent = 'Artwork: ' + title + ' - ' + price;
    document.getElementById('inquiryType').value = 'purchase';
    document.getElementById('artworkTitle').value = title;
    document.getElementById('artworkPrice').value = price;
    const purchaseMsg = currentLang === 'it' ? 'Vorrei acquistare "' + title + '" per ' + price + '. Per favore inviatemi i dettagli di pagamento e spedizione.' : 'I would like to purchase "' + title + '" for ' + price + '. Please send me payment details and shipping information.';
    document.getElementById('messageField').value = purchaseMsg;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openInquiryForm(artworkId, title) {
    const modal = document.getElementById('contactModal');
    document.getElementById('contactFormTitle').textContent = translations[currentLang].inquiryAbout;
    document.getElementById('contactFormSubtitle').textContent = 'Artwork: ' + title;
    document.getElementById('inquiryType').value = 'inquiry';
    document.getElementById('artworkTitle').value = title;
    document.getElementById('artworkPrice').value = '';
    const inquiryMsg = currentLang === 'it' ? 'Sono interessato/a a saperne di piu\' su "' + title + '". Potreste fornirmi maggiori informazioni?' : 'I am interested in learning more about "' + title + '". Could you provide more information?';
    document.getElementById('messageField').value = inquiryMsg;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeContactForm() {
    document.getElementById('contactModal').classList.remove('active');
    document.body.style.overflow = '';
}

function submitContactForm(event) {
    event.preventDefault();
    const form = document.getElementById('contactFormElement');
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    const artworkTitle = formData.get('artworkTitle');
    const artworkPrice = formData.get('artworkPrice');
    const inquiryType = formData.get('inquiryType');
    const subject = inquiryType === 'purchase' ? 'Purchase Inquiry: ' + artworkTitle : 'Inquiry About: ' + artworkTitle;
    const body = 'From: ' + name + '\nEmail: ' + email + '\n\nArtwork: ' + artworkTitle + (artworkPrice ? '\nPrice: ' + artworkPrice : '') + '\n\nMessage:\n' + message;
    window.location.href = 'mailto:adniquiz@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    closeContactForm();
    form.reset();
}

function openLightbox() {
    const lightbox = document.getElementById('lightbox');
    const artwork = artworks[currentArtworkIndex];
    const materials = currentLang === 'it' ? artwork.materialsIT : artwork.materials;
    let details = materials;
    if (artwork.dimensions) details += ' - ' + artwork.dimensions;
    details += ' - ' + artwork.date + ' - ' + artwork.price;
    document.getElementById('lightbox-image').src = artwork.image;
    document.getElementById('lightbox-image').alt = artwork.alt;
    document.getElementById('lightbox-title').textContent = artwork.title;
    document.getElementById('lightbox-details').textContent = details;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function showPrevious() { currentArtworkIndex = (currentArtworkIndex - 1 + artworks.length) % artworks.length; openLightbox(); }
function showNext() { currentArtworkIndex = (currentArtworkIndex + 1) % artworks.length; openLightbox(); }

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

function switchLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('.lang-btn').forEach(function(btn) {
        btn.classList.remove('active');
        if (btn.dataset.lang === lang) btn.classList.add('active');
    });
    document.querySelectorAll('[data-en]').forEach(function(el) {
        const text = el.dataset[lang];
        if (text) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                const placeholderKey = 'placeholder' + lang.charAt(0).toUpperCase() + lang.slice(1);
                if (el.dataset[placeholderKey]) el.placeholder = el.dataset[placeholderKey];
            } else {
                el.innerHTML = text;
            }
        }
    });
    if (artworks.length > 0) buildGallery(artworks);
    localStorage.setItem('preferredLanguage', lang);
}

function initLanguageSwitcher() {
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    currentLang = savedLang;
    document.querySelectorAll('.lang-btn').forEach(function(btn) {
        if (btn.dataset.lang === savedLang) btn.classList.add('active');
        btn.addEventListener('click', function() { switchLanguage(btn.dataset.lang); });
    });
}

document.addEventListener('DOMContentLoaded', async function() {
    initLanguageSwitcher();
    document.getElementById('gallery-grid').innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;"><p style="color: #D4AF37; font-size: 1.2rem;">' + translations[currentLang].loading + '</p></div>';
    document.querySelectorAll('[data-en]').forEach(function(el) {
        const text = el.dataset[currentLang];
        if (text && el.tagName !== 'INPUT' && el.tagName !== 'TEXTAREA') el.innerHTML = text;
    });
    artworks = await detectArtworks();
    buildGallery(artworks);
    const lightbox = document.getElementById('lightbox');
    document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
    document.getElementById('lightbox-prev').addEventListener('click', function(e) { e.stopPropagation(); showPrevious(); });
    document.getElementById('lightbox-next').addEventListener('click', function(e) { e.stopPropagation(); showNext(); });
    lightbox.addEventListener('click', function(e) { if (e.target === lightbox) closeLightbox(); });
    const contactModal = document.getElementById('contactModal');
    document.getElementById('contactModalClose').addEventListener('click', closeContactForm);
    contactModal.addEventListener('click', function(e) { if (e.target === contactModal) closeContactForm(); });
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active') && e.key === 'Escape') closeLightbox();
        if (contactModal.classList.contains('active') && e.key === 'Escape') closeContactForm();
        if (lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') showPrevious();
            else if (e.key === 'ArrowRight') showNext();
        }
    });
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
});