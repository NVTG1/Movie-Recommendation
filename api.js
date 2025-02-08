// api.js

// API key for OMDB (Open Movie Database)
const OMDB_API_KEY = 'de6c2127';
// API key for TMDB (The Movie Database)
const TMDB_API_KEY = '45dcdb1c6ade2700c095f118c63a3f48';

/**
 * Fetches movies from OMDB based on the movie title.
 * @param {string} movieTitle - The title of the movie to search for.
 * @returns {Promise<Array<Object>>} - A promise that resolves with an array of movie objects from OMDB.
 * @throws {Error} - Throws an error if the API request fails or no movies are found.
 */
async function fetchMoviesFromOMDB(movieTitle) {
    try {
        // Construct the OMDB API URL with the API key and movie title
        let omdbUrl = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${encodeURIComponent(movieTitle)}`;
        // Make a fetch request to the OMDB API
        const omdbResponse = await fetch(omdbUrl);
        // Parse the JSON response from OMDB
        const omdbData = await omdbResponse.json();

        // Check if the response from OMDB indicates an error
        if (omdbData.Response === 'False') {
            throw new Error(omdbData.Error || 'No movies found');
        }

        // Return the search results from OMDB
        return omdbData.Search;
    } catch (error) {
        // Throw any errors that occur during the API request or data processing
        throw error;
    }
}

/**
 * Fetches movies from TMDB based on the genre ID.
 * @param {number} genreId - The ID of the genre to search for.
 * @returns {Promise<Array<Object>>} - A promise that resolves with an array of movie objects from TMDB.
 * @throws {Error} - Throws an error if the API request fails or no movies are found for the specified genre.
 */
async function fetchMoviesFromTMDB(genreId) {
    try {
        // Construct the TMDB API URL with the API key and genre ID
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}`;
        // Make a fetch request to the TMDB API
        const response = await fetch(url);
        // Parse the JSON response from TMDB
        const data = await response.json();

        // Check if the response from TMDB contains no results
        if (!data.results || data.results.length === 0) {
            throw new Error('No movies found for this genre');
        }

        // Return the movie results from TMDB
        return data.results;
    } catch (error) {
        // Throw any errors that occur during the API request or data processing
        throw error;
    }
}

/**
 * Fetches the list of movie genres from TMDB.
 * @returns {Promise<Array<Object>>} - A promise that resolves with an array of genre objects from TMDB.
 * @throws {Error} - Throws an error if the API request fails.
 */
async function getGenres() {
    // Construct the TMDB API URL to fetch the list of movie genres
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`;
    try {
        // Make a fetch request to the TMDB API
        const response = await fetch(url);
        // Check if the response status is not OK (e.g., 404, 500)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse the JSON response from TMDB
        const data = await response.json();
        // Return the array of genre objects
        return data.genres;
    } catch (error) {
        // Log any errors that occur during the API request
        console.error('Error fetching genres:', error);
        // Return an empty array if an error occurs
        return [];
    }
}
