// Données complètes des destinations (incluant l'offre spéciale id: 7)
const destinations = [
    {
        id: 1,
        name: "Nosy Be, Madagascar",
        category: "plage",
        price: 850,
        duration: "7 jours",
        rating: "4.9",
        description: "Eaux turquoise, plages de sable blanc, plongée sous-marine et parfum d'ylang-ylang.",
        image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        name: "Kyoto, Japon",
        category: "culture",
        price: 1450,
        duration: "10 jours",
        rating: "4.8",
        description: "Temples millénaires, jardins zen, forêts de bambous et gastronomie traditionnelle.",
        image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        name: "Allée des Baobabs, Morondava",
        category: "nature",
        price: 620,
        duration: "5 jours",
        rating: "4.9",
        description: "Admirez des couchers de soleil spectaculaires au milieu des baobabs géants.",
        image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        name: "Santorin, Grèce",
        category: "plage",
        price: 1120,
        duration: "6 jours",
        rating: "4.7",
        description: "Maisons blanches aux dômes bleus surplombant la mer Égée et villages pittoresques.",
        image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        name: "Parc National de l'Isalo",
        category: "nature",
        price: 540,
        duration: "4 jours",
        rating: "4.8",
        description: "Canyons majestueux, piscines naturelles et randonnées au cœur des massifs ruiniformes.",
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        name: "Rome, Italie",
        category: "culture",
        price: 920,
        duration: "5 jours",
        rating: "4.7",
        description: "Plongez dans l'histoire antique entre le Colisée, le Vatican et les places animées.",
        image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 7,
        name: "Île Sainte-Marie (Offre Spéciale)",
        category: "plage",
        price: 600,
        duration: "5 jours",
        rating: "5.0",
        description: "Séjour tout compris avec observation des baleines, lagons paisibles et excursions.",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80"
    }
];

// Sélection des éléments DOM
const grid = document.getElementById("destinationsGrid");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const filterButtons = document.querySelectorAll(".filter-btn");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

// Éléments de la modale
const bookingModal = document.getElementById("bookingModal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalPrice = document.getElementById("modalPrice");
const selectedDestinationInput = document.getElementById("selectedDestination");
const travelersCountInput = document.getElementById("travelersCount");
const travelDateInput = document.getElementById("travelDate");
const totalPriceEl = document.getElementById("totalPrice");
const bookingForm = document.getElementById("bookingForm");
const bookingConfirmation = document.getElementById("bookingConfirmation");

let currentCategory = "all";
let currentUnitPrice = 0;

// Définir la date minimale de réservation à aujourd'hui
const today = new Date().toISOString().split("T")[0];
if (travelDateInput) travelDateInput.setAttribute("min", today);

// Afficher et filtrer les destinations
function renderDestinations() {
    const query = searchInput.value.toLowerCase().trim();
    const sortBy = sortSelect.value;

    let filtered = destinations.filter(dest => {
        const matchesCategory = currentCategory === "all" || dest.category === currentCategory;
        const matchesSearch = dest.name.toLowerCase().includes(query) || dest.description.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
    });

    if (sortBy === "price-asc") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
        filtered.sort((a, b) => b.price - a.price);
    }

    if (filtered.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 30px 0;">Aucune destination ne correspond à votre recherche.</p>`;
        return;
    }

    grid.innerHTML = filtered.map(dest => `
        <article class="card">
            <div class="card-img-wrapper">
                <img src="${dest.image}" alt="${dest.name}" class="card-img" loading="lazy">
                <span class="card-rating">&#9733; ${dest.rating}</span>
            </div>
            <div class="card-body">
                <span class="card-badge">${dest.category} • ${dest.duration}</span>
                <h3 class="card-title">${dest.name}</h3>
                <p class="card-desc">${dest.description}</p>
                <div class="card-footer">
                    <div class="price">${dest.price} € <span>/ pers.</span></div>
                    <button class="btn btn-primary" onclick="openBookingModal(${dest.id})">Réserver</button>
                </div>
            </div>
        </article>
    `).join("");
}

// Ouvrir la modale de réservation
window.openBookingModal = function(id) {
    const dest = destinations.find(d => d.id === id);
    if (!dest) return;

    currentUnitPrice = dest.price;
    modalTitle.textContent = `Réserver : ${dest.name}`;
    modalPrice.textContent = `Tarif : ${dest.price} € / personne (${dest.duration})`;
    selectedDestinationInput.value = dest.name;
    bookingConfirmation.classList.add("hidden");
    bookingForm.reset();
    travelersCountInput.value = 2;
    updateTotalPrice();

    bookingModal.classList.add("show");
};

// Mettre à jour le prix total
function updateTotalPrice() {
    const count = Math.max(1, parseInt(travelersCountInput.value, 10) || 1);
    totalPriceEl.textContent = `${currentUnitPrice * count} €`;
}

// Écouteurs d'événements
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.dataset.category;
        renderDestinations();
    });
});

searchInput.addEventListener("input", renderDestinations);
sortSelect.addEventListener("change", renderDestinations);

// Menu mobile responsive
menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => navLinks.classList.remove("active"));
});

// Modale
closeModal.addEventListener("click", () => bookingModal.classList.remove("show"));
window.addEventListener("click", (e) => {
    if (e.target === bookingModal) bookingModal.classList.remove("show");
});

travelersCountInput.addEventListener("input", updateTotalPrice);

bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("travelerName").value;
    const email = document.getElementById("travelerEmail").value;
    const date = travelDateInput.value;
    const count = travelersCountInput.value;
    const dest = selectedDestinationInput.value;
    const total = totalPriceEl.textContent;

    bookingConfirmation.innerHTML = `
        <strong>Réservation confirmée !</strong><br>
        Merci <strong>${name}</strong>, votre demande pour <strong>${dest}</strong> (${count} pers. - ${total}) prévue le <strong>${date}</strong> a été envoyée à <em>${email}</em>.
    `;
    bookingConfirmation.classList.remove("hidden");
});

// Formulaire de contact
document.getElementById("contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const feedback = document.getElementById("contactFeedback");
    feedback.textContent = "Votre message a bien été envoyé ! Notre équipe vous répondra sous 24h.";
    e.target.reset();
});

// Newsletter
document.getElementById("newsletterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("newsletterFeedback").textContent = "Inscription réussie ! Merci.";
    e.target.reset();
});

// Initialisation
renderDestinations();
