// app.js

// Event listener to initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initialize);

// Global variable to store all available genres
let allGenres = [];

/**
 * Initializes the application by fetching genres and attaching event listeners.
 */
async function initialize() {
    try {
        // Fetch all available genres from the API
        allGenres = await getGenres();
        console.log("All Genres Initialized:", allGenres); 
        populateGenreNav(allGenres);
    } catch (error) {
        // Handle errors during initialization, such as failing to load genres
        console.error("Error during initialization:", error);
        showError("Failed to load genres.");
        return;
    }

    // Get the genre list element from the DOM
    const genreList = document.getElementById('genreList');
    if (genreList) {
        genreList.addEventListener('click', handleGenreClick);
        console.log("Event listener attached to genreList"); // Confirmation
    } else {
        // Log an error if the genre list element is not found
        console.error("genreList element not found!"); // Check if element exists
    }
}

/**
 * Searches for movies based on the movie title entered in the search input.
 */
async function searchMovies() {
    const movieTitle = document.getElementById('movieTitle').value.trim();
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const movieGrid = document.getElementById('movieGrid');

    // Display the loading indicator
    loadingElement.style.display = 'block';
    // Hide the error message
    errorElement.style.display = 'none';
    // Clear the movie grid
    movieGrid.innerHTML = '';

    try {
        // Fetch movies from OMDB based on the movie title
        const movies = await fetchMoviesFromOMDB(movieTitle);
        displayMovies(movies);
        scrollToMovieGrid();
    } catch (error) {
        showError(error.message);
    } finally {
        // Hide the loading indicator after the search is complete
        loadingElement.style.display = 'none';
    }
}

/**
 * Searches for movies by genre using the TMDB API.
 * @param {string} genreId - The ID of the genre to search for.
 */
async function searchMoviesByGenre(genreId) {
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const movieGrid = document.getElementById('movieGrid');

    loadingElement.style.display = 'block';
    errorElement.style.display = 'none';
    movieGrid.innerHTML = '';

    try {
        // Fetch movies from TMDB based on the genre ID
        const movies = await fetchMoviesFromTMDB(genreId);
        displayMoviesFromTMDB(movies);
        scrollToMovieGrid();
    } catch (error) {
        showError(error.message);
    } finally {
        loadingElement.style.display = 'none';
    }
}

/**
 * Populates the genre navigation with a list of genres.
 * @param {Array<Object>} genres - An array of genre objects.
 */
function populateGenreNav(genres) {
    const genreList = document.getElementById('genreList');
    genreList.innerHTML = '';

    // Iterate over each genre and create a list item for it
    genres.forEach(genre => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = "#";

        // Determine the appropriate icon class based on the genre name
        let iconClass = "fas fa-question-circle";
        switch (genre.name.toLowerCase()) {
            case "action":
                iconClass = "fas fa-bomb";
                break;
            case "comedy":
                iconClass = "fas fa-laugh-squint";
                break;
            case "thriller":
                iconClass = "fas fa-exclamation-triangle";
                break;
            case "horror":
                iconClass = "fas fa-ghost";
                break;
            case "sci-fi":
                iconClass = "fas fa-rocket";
                break;
            case "romance":
                iconClass = "fas fa-heart";
                break;
            case "animation":
                iconClass = "fas fa-child";
                break;
            case "documentary":
                iconClass = "fas fa-file-alt";
                break;
            default:
                iconClass = "fas fa-film";
        }

        // Set the inner HTML of the link to include the genre icon and name
        link.innerHTML = `<i class="${iconClass}"></i> ${genre.name}`;
        link.dataset.genre = genre.id;
        listItem.appendChild(link);
        genreList.appendChild(listItem);
    });
}

/**
 * Creates a fallback poster element when no poster is available.
 * @param {string} title - The title of the movie.
 * @returns {string} - HTML string representing the fallback poster.
 */
function createFallbackPoster(title) {
    return `
        <div class="fallback-poster">
            <div>
                <h3>${title}</h3>
                <p>No poster available</p>
            </div>
        </div>
    `;
}

/**
 * Handles image loading errors by replacing the image with a fallback poster.
 * @param {HTMLImageElement} img - The image element that failed to load.
 * @param {string} title - The title of the movie.
 */
function handleImageError(img, title) {
    img.parentElement.innerHTML = createFallbackPoster(title);
}

/**
 * Displays movies in the movie grid.
 * @param {Array<Object>} movies - An array of movie objects from OMDB.
 */
function displayMovies(movies) {
    const movieGrid = document.getElementById('movieGrid');
    movieGrid.innerHTML = '';

    // Display a "no results" message if no movies are found
    if (!movies || movies.length === 0) {
        movieGrid.innerHTML = `
            <div class="no-results">
                <h3>No movies found</h3>
                <p>Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }

    // Iterate over each movie and create a movie card for it
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        const hasPoster = movie.Poster && movie.Poster !== 'N/A';
        const posterHtml = hasPoster
            ? `<div class="poster-container">
                     <a href="https://www.imdb.com/find/?q=${encodeURIComponent(movie.Title)}" target="_blank">
                     <img
                        src="${movie.Poster}"
                        alt="${movie.Title} Poster"
                        class="movie-poster"
                        onerror="handleImageError(this, '${movie.Title.replace(/'/g, "\\'")}')"
                     >
                     </a>
                   </div>`
            : `<div class="poster-container">${createFallbackPoster(movie.Title)}</div>`;
        movieCard.innerHTML = `
                ${posterHtml}
                <div class="movie-info">
                    <h2>${movie.Title} (${movie.Year})</h2>
                    <p><strong>Type:</strong> ${movie.Type}</p>
                    <p><strong>Genre:</strong> ${movie.Genre || 'N/A'}</p>
                </div>
            `;
        movieGrid.appendChild(movieCard);
    });
}

/**
 * Displays movies in the movie grid from TMDB.
 * @param {Array<Object>} movies - An array of movie objects from TMDB.
 */
function displayMoviesFromTMDB(movies) {
    const movieGrid = document.getElementById('movieGrid');
    movieGrid.innerHTML = '';

    // Display a "no results" message if no movies are found
    if (!movies || movies.length === 0) {
        movieGrid.innerHTML = `
            <div class="no-results">
                <h3>No movies found for this genre</h3>
                <p>Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }

    // Iterate over each movie and create a movie card for it
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';

        const hasPoster = movie.poster_path;
        const posterUrl = hasPoster ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '';
        const posterHtml = hasPoster
            ? `<div class="poster-container">
                <a href="https://www.themoviedb.org/search?query=${encodeURIComponent(movie.title)}" target="_blank">
                <img
                    src="${posterUrl}"
                    alt="${movie.title} Poster"
                    class="movie-poster"
                    onerror="handleImageError(this, '${movie.title.replace(/'/g, "\\'")}')"
                >
                </a>
            </div>`
            : `<div class="poster-container">${createFallbackPoster(movie.title)}</div>`;

        movieCard.innerHTML = `
            ${posterHtml}
            <div class="movie-info">
                <h2>${movie.title} (${movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'})</h2>
                <p><strong>Overview:</strong> ${movie.overview || 'N/A'}</p>
            </div>
        `;
        movieGrid.appendChild(movieCard);
    });
}

/**
 * Displays an error message on the page.
 * @param {string} message - The error message to display.
 */
function showError(message) {
    const errorElement = document.getElementById('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

/**
 * Handles the click event on a genre link.
 * @param {Event} event - The click event object.
 */
function handleGenreClick(event) {
    console.log("handleGenreClick called");
    // Check if the clicked element is a link
    if (event.target.tagName === 'A') {
        // Prevent the default link behavior
        event.preventDefault();

        const genreId = event.target.dataset.genre;
        console.log("Genre ID:", genreId);
        document.getElementById('movieTitle').value = '';

        searchMoviesByGenre(genreId);
    }
}

/**
 * Handles the "Enter" key press event in the search input field.
 * @param {Event} event - The key press event object.
 */
function handleEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchMovies();
    }
}

/**
 * Scrolls the window to the movie grid element.
 */
function scrollToMovieGrid() {
    const movieGrid = document.getElementById('movieGrid');
    movieGrid.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}
