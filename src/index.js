import React, { useState, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import CharacterList from './CharacterList';
import endpoint from './endpoint';
import './styles.scss';

const initialState = {
  result: null,
  loading: true,
  error: null,
};

const fetchReducer = (state, action) => {
  if (action.type === 'LOADING') {
    return {
      result: null,
      loading: true,
      error: null,
    };
  }
  if (action.type === 'SUCCESS') {
    return {
      result: action.payload.response,
      loading: false,
      error: null,
    };
  }
  if (action.type === 'ERROR') {
    return {
      result: null,
      loading: false,
      error: action.payload.error,
    };
  }
};

const useFetch = (url) => {
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  React.useEffect(() => {
    dispatch({
      type: 'LOADING',
    });
    fetch(url)
      .then((response) => response.json())

      .then((response) => {
        dispatch({
          type: 'SUCCESS',
          payload: { response },
        });
      })
      .catch((error) => {
        dispatch({
          type: 'ERROR',
          payload: { error },
        });
      });
  }, []);
  return [state.result, state.loading, state.error];

  /* Using explicit async await function inside the useEffect */
  /* const fetchUrl = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setResponse(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }; 
    
    fetchUrl() */
};

const Application = () => {
  const [response, loading, error] = useFetch(endpoint + '/characters');
  const characters = (response && response.characters) || [];
  return (
    <div className="Application">
      <header>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <section className="sidebar">
          {loading ? (
            <p>Loading ...</p>
          ) : (
            <CharacterList characters={characters} />
          )}
          {error && <p className="error">{error.message}</p>}
        </section>
      </main>
    </div>
  );
};

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Router>
    <Application />
  </Router>,
  rootElement,
);
