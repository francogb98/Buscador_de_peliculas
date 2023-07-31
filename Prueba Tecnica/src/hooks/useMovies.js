import { useRef, useState, useMemo, useCallback } from "react";

import { getMovies } from "../services/moviesFetch";

export function useMovies({ search, sort }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const previousSearch = useRef(search);

  //se ejecutara solo cuando cmabie el search, si por ejemplo hacemos un sort esto no se ejecutara
  const searchMovies = useMemo(() => {
    //al pasarle los valores por parametros directamente a la funcion y no al hook, esto permitira que solo cambie cuando ejecutemos la funcion en el submit
    return async ({ search }) => {
      //con esto hacemos que no se haga la busqueda de un mismo valor 2 veces
      if (search === previousSearch.current) return;
      try {
        setLoading(true);
        setError(null);
        previousSearch.current = search;
        const newMovies = await getMovies({ search });
        setMovies(newMovies);
      } catch (error) {
        setError(error.message);
      } finally {
        //se ejecuta tanto como si el try o catch se ejecutara
        setLoading(false);
      }
    };
  }, []);

  //usecallback es para facilitar el tema de los return etc.... solo le pasamos la funcion y la dependencias, en usememo tenemos que retornar una funcion
  const searchMovies2 = useCallback(async (search) => {
    if (search === previousSearch.current) return;
    try {
      setLoading(true);
      setError(null);
      previousSearch.current = search;
      const newMovies = await getMovies({ search });
      setMovies(newMovies);
    } catch (error) {
      setError(error.message);
    } finally {
      //se ejecuta tanto como si el try o catch se ejecutara
      setLoading(false);
    }
  }, []);

  //el use memo es para poder hacer que las funciones se ejecuten solo si cambain las dependencias que le cambiamos
  const sortedMovies = useMemo(() => {
    return sort
      ? [...movies].sort((a, b) => a.title.localeCompare(b.title)) //el local compare compara con acentos incluidos
      : movies;
  }, [sort, movies]);

  return { movies: sortedMovies, searchMovies, loading, error };
}
