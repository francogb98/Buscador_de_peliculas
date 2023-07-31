import { useCallback, useEffect, useRef, useState } from "react";
//usereff: permite rear uuna referencia mutable que persistre duraten todo el ciclo de ivda de un componenete(persiste entre renderizados), cada vez que cambia no vuelve a renderizar el componenete, a adifrenecia del usestat
import "./App.css";

import { Movies } from "./components/Movies";
import { useMovies } from "./hooks/useMovies";

import debounce from "just-debounce-it";

function useSearch() {
  const [search, updateSearch] = useState("");
  const [error, setError] = useState(null);

  const isFirstInput = useRef(true); //no abusar del useref

  //usamos el useref para que al cargar la pagina no tire el error de que el input esta vacio
  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === "";
      return;
    }

    if (!search) {
      setError("No se puede buscar una pelicula vacia");
      return;
    }
    if (search.match(/^\d+$/)) {
      setError("No se puede buscar una CON un numero");
      return;
    }
    if (search.length < 3) {
      setError("La busqueda debe tener al menos 3 caracteres");
      return;
    }

    setError(null);
  }, [search, isFirstInput.current]);

  return { search, updateSearch, error };
}

function App() {
  const [sort, setSort] = useState(false);
  const { search, updateSearch, error } = useSearch();
  const { movies, searchMovies, loading } = useMovies({ search, sort });

  //forma NO CONTROLADA para un formaulario
  const handleSubmitNoControlado = (e) => {
    e.preventDefault();
    //forma use ref ----->
    // const value = inputRef.current.value;
    // console.log(value);

    //forma fomr data---->
    // const fields = new window.FormData(e.target);
    // const query = fields.get("query");
    // console.log(query);

    //si tuvieramos muchos inputs------>
    // const { query, prueba1, prueba2 } = Object.fromEntries(
    //   new window.FormData(e.target)
    // );
    // console.log(query, prueba1, prueba2);

    // const { query } = Object.fromEntries(new window.FormData(e.target));
    // if (query === "") {
    //   setError("No se ingreso ninguna Pleicula");
    // }
  };

  //form CONTROLADA

  //lo que hace el debonce es que cada vez que cambiamos el input osea escibimos se ejecutara una funcion, en este cada cada 300 milisegundos
  const debouncedGetMovies = useCallback(
    debounce(({ search }) => {
      searchMovies({ search });
    }, 300),
    [searchMovies]
  );

  const handleChange = (e) => {
    const newSeatch = e.target.value;
    updateSearch(newSeatch);
    debouncedGetMovies({ search: newSeatch });
  };

  const handleSort = () => {
    setSort(!sort);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchMovies({ search });
  };

  return (
    <div className="page">
      <header>
        <h1>Buscador de peliculas</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={search}
            onChange={handleChange}
            placeholder="Avengerse,Starwars, Matrix..."
          />
          <input type="checkbox" onChange={handleSort} checked={sort} />

          <button type="submit">Buscar</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </header>

      <main>{loading ? <h2>Cargando...</h2> : <Movies movies={movies} />}</main>
    </div>
  );
}

export default App;
