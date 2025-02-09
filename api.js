// api.js

// API key for OMDB (Open Movie Database)
const OMDB_API_KEY = 'de6c2127';
// API key for TMDB (The Movie Database)
const TMDB_API_KEY = '45dcdb1c6ade2700c095f118c63a3f48';

/**
 * Fetches movies from OMDB based on the movie title.
 * @param {string} movieTitle 
 * @returns {Promise<Array<Object>>}
 * @throws {Error}
 */
async function fetchMoviesFromOMDB(movieTitle) {
    try {
        // Construct the OMDB API URL with the API key and movie title
        let omdbUrl = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(movieTitle)}`;
        const omdbResponse = await fetch(omdbUrl);
        const omdbData = await omdbResponse.json();

        if (omdbData.Response === 'False') {
            throw new Error(omdbData.Error || 'No movies found');
        }

        return omdbData.Search;
    } catch (error) {
        // Throw any errors that occur during the API request or data processing
        throw error;
    }
}

/**
 * Fetches movies from TMDB based on the genre ID.
 * @param {number} genreId 
 * @returns {Promise<Array<Object>>} 
 * @throws {Error} 
 */
async function fetchMoviesFromTMDB(genreId) {
    try {
        // Construct the TMDB API URL with the API key and genre ID
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error('No movies found for this genre');
        }

        return data.results;
    } catch (error) {
        // Throw any errors that occur during the API request or data processing
        throw error;
    }
}

/**
 * Fetches the list of movie genres from TMDB.
 * @returns {Promise<Array<Object>>} 
 * @throws {Error} 
 */
async function getGenres() {
    // Construct the TMDB API URL to fetch the list of movie genres
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`;
    try {
        // Make a fetch request to the TMDB API
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.genres;
    } catch (error) {
        // Log any errors that occur during the API request
        console.error('Error fetching genres:', error);
        return [];
    }
}
