// Données des films
const movies = [
    {
        id: 1,
        title: "Inception",
        year: 2010,
        rating: 8.8,
        category: "Science-Fiction",
        image: "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
        description: "Un voleur qui pénètre dans les rêves des autres pour y dérober leurs secrets se voit offrir une chance de rédemption : implanter une idée dans l'esprit d'une cible."
    },
    {
        id: 2,
        title: "The Dark Knight",
        year: 2008,
        rating: 9.0,
        category: "Action",
        image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
        description: "Batman affronte le Joker, un criminel sadique qui veut plonger Gotham City dans le chaos."
    },
    {
        id: 3,
        title: "Interstellar",
        year: 2014,
        rating: 8.6,
        category: "Science-Fiction",
        image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        description: "Un groupe d'explorateurs utilise une faille spatiale pour parcourir de grandes distances et sauver l'humanité."
    },
    {
        id: 4,
        title: "The Matrix",
        year: 1999,
        rating: 8.7,
        category: "Science-Fiction",
        image: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
        description: "Un informaticien découvre la vérité sur la réalité et son rôle dans la guerre contre ses contrôleurs."
    },
    {
        id: 5,
        title: "Pulp Fiction",
        year: 1994,
        rating: 8.9,
        category: "Crime",
        image: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
        description: "Les vies de deux tueurs à gages, d'un boxeur et d'un couple de braqueurs s'entremêlent dans une série d'histoires violentes."
    },
    {
        id: 6,
        title: "The Godfather",
        year: 1972,
        rating: 9.2,
        category: "Drame",
        image: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
        description: "Le patriarche vieillissant d'une dynastie du crime organise le transfert de son empire à son fils réticent."
    },
    {
        id: 7,
        title: "Avatar",
        year: 2009,
        rating: 7.9,
        category: "Science-Fiction",
        image: "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
        description: "Un marine paraplégique est envoyé sur la lune Pandora pour une mission unique."
    },
    {
        id: 8,
        title: "Gladiator",
        year: 2000,
        rating: 8.5,
        category: "Action",
        image: "https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg",
        description: "Un général romain trahi cherche à se venger de l'empereur corrompu qui a assassiné sa famille."
    },
    {
        id: 9,
        title: "The Shawshank Redemption",
        year: 1994,
        rating: 9.3,
        category: "Drame",
        image: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
        description: "Deux hommes emprisonnés forgent une amitié au fil des années, trouvant réconfort et rédemption."
    }
];

// État de l'application
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentTheme = localStorage.getItem('theme') || 'dark';

// Éléments DOM
const filmsGrid = document.getElementById('filmsGrid');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');
const exploreBtn = document.getElementById('exploreBtn');
const modal = document.getElementById('filmModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalRating = document.getElementById('modalRating');
const modalDescription = document.getElementById('modalDescription');

// Initialisation
function init() {
    applyTheme();
    renderMovies(movies);
    setupEventListeners();
}

// Rendre les films
function renderMovies(moviesToRender) {
    filmsGrid.innerHTML = moviesToRender.map(movie => `
        <div class="film-card" data-id="${movie.id}">
            <div class="film-image-container">
                <img class="film-image" src="${movie.image}" alt="${movie.title}">
                <div class="film-overlay">
                    <button class="favorite-btn ${favorites.includes(movie.id) ? 'active' : ''}" data-id="${movie.id}">
                        <i class="fas ${favorites.includes(movie.id) ? 'fa-heart' : 'fa-heart'}"></i>
                    </button>
                </div>
            </div>
            <div class="film-info">
                <h3 class="film-title">${movie.title}</h3>
                <div class="film-rating">
                    ${generateStars(movie.rating)}
                    <span class="rating-value">${movie.rating}/10</span>
                </div>
                <div style="margin-top: 0.5rem; color: var(--text-secondary); font-size: 0.85rem;">
                    ${movie.category}
                </div>
            </div>
        </div>
    `).join('');
    
    // Ajouter les événements aux cartes
    document.querySelectorAll('.film-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.favorite-btn')) {
                const movieId = parseInt(card.dataset.id);
                openModal(movieId);
            }
        });
    });
    
    // Ajouter les événements aux boutons favoris
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const movieId = parseInt(btn.dataset.id);
            toggleFavorite(movieId);
        });
    });
}

// Générer les étoiles de notation
function generateStars(rating) {
    const fullStars = Math.floor(rating / 2);
    const hasHalfStar = (rating / 2) % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Ouvrir le modal
function openModal(movieId) {
    const movie = movies.find(m => m.id === movieId);
    if (movie) {
        modalImage.src = movie.image;
        modalTitle.textContent = `${movie.title} (${movie.year})`;
        modalRating.innerHTML = generateStars(movie.rating);
        modalDescription.textContent = movie.description;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Fermer le modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Basculer les favoris
function toggleFavorite(movieId) {
    const index = favorites.indexOf(movieId);
    if (index === -1) {
        favorites.push(movieId);
    } else {
        favorites.splice(index, 1);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    filterMovies();
}

// Filtrer les films
function filterMovies() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredMovies = movies.filter(movie => 
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.category.toLowerCase().includes(searchTerm)
    );
    renderMovies(filteredMovies);
}

// Appliquer le thème
function applyTheme() {
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.body.classList.remove('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Basculer le thème
function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    applyTheme();
}

// Scroll smooth vers les films
function scrollToFilms() {
    const filmsSection = document.getElementById('filmsSection');
    filmsSection.scrollIntoView({ behavior: 'smooth' });
}

// Configuration des événements
function setupEventListeners() {
    searchInput.addEventListener('input', filterMovies);
    themeToggle.addEventListener('click', toggleTheme);
    exploreBtn.addEventListener('click', scrollToFilms);
    modalCloseBtn.addEventListener('click', closeModal);
    
    // Fermer le modal en cliquant en dehors
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Fermer le modal avec la touche Echap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Démarrer l'application
init();