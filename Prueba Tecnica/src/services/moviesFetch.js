const API_KEY = "a7e85bc9";
export const getMovies = async ({ search }) => {
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`
    );
    const json = await response.json();

    const movies = json.Search;

    //para no depender del contrato de la pai hacemos esto
    const mappedMovies = movies?.map((movie) => ({
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
    }));
    console.log(mappedMovies);
    return mappedMovies;
  } catch (e) {
    throw new Error("Error searching movies");
  }
};
