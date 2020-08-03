import React, { useState, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import CharacterList from './CharacterList';
import CharacterView from './CharacterView';
import endpoint from './endpoint';
import './styles.scss';
import isFunction from 'lodash/isFunction';

const reducer = (state, action) => {
  if (action.type === 'LOADING') {
    return {
      characters: [],
      loading: true,
      error: null,
    };
  }
  if (action.type === 'SUCCESS') {
    return {
      characters: action.payload.characters,
      loading: false,
      error: null,
    };
  }
  if (action.type === 'ERROR') {
    return {
      characters: [],
      loading: false,
      error: action.payload.error,
    };
  }
  return state;
};

const fetchCharacters = (dispatch) => {
  dispatch({ type: 'LOADING' });
  fetch(endpoint + '/characters')
    .then((res) => res.json())
    .then((res) =>
      dispatch({ type: 'SUCCESS', payload: { characters: res.characters } }),
    )
    .catch((error) => {
      dispatch({ type: 'ERROR', payload: { error: error.message } });
    });
};

const initialState = {
  characters: [],
  loading: true,
  error: null,
};

const useThunkReducer = (reducer, initialState) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const enhancedDispatch = (action) => {
    if (isFunction(action)) {
      action(dispatch);
    } else {
      dispatch(action);
    }
  };

  return [state, enhancedDispatch];
};

const Application = () => {
  const [state, dispatch] = useThunkReducer(reducer, initialState);
  const { characters } = state;

  useEffect(() => {
    dispatch((dispatch) => {});
  }, []);

  return (
    <div className="Application">
      <header>
        <h1>Star Wars Characters</h1>
      </header>
      <main>
        <section className="sidebar">
          <button
            onClick={() => {
              dispatch(fetchCharacters);
            }}
          >
            Fetch Characters
          </button>
          <CharacterList characters={characters} />
        </section>
        <section className="CharacterView">
          <Route path="/characters/:id" component={CharacterView} />
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

/* This is without Thunk reducer (custom hook that fetches all the data that we need) */
/* const useFetch = (url) => {
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

  // Using explicit async await function inside the useEffect
  const fetchUrl = async () => {
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

  fetchUrl();
}; */
