import React, { useState, useEffect, useRef } from 'react';
import useHttp from '../../hooks/http';
import Card from '../UI/Card';
import './Search.css';
import ErrorModal from '../UI/ErrorModal'

const Search = React.memo(props => {
  const [enterdFilter, setEnteredFilter] = useState('')
  const inputRef = useRef()
  const { onLoadIngs } = props
  const { isLoading, data, error, sendRequest,clear } = useHttp();
  useEffect(() => {

    const timer = setTimeout(() => {

      if (enterdFilter === inputRef.current.value) {
        const queryParam = enterdFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enterdFilter}"`;

        // fetch('https://react-hook-f8d6e.firebaseio.com/ings.json' + queryParam)
        //   .then(res => res.json())
        //   .then(resData => {
        //     const loadedIngs = [];
        //     for (const key in resData) {
        //       loadedIngs.push({
        //         id: key,
        //         title: resData[key].title,
        //         amount: resData[key].amount
        //       });
        //     }
        //     onLoadIngs(loadedIngs)
        //   })
        sendRequest('https://react-hook-f8d6e.firebaseio.com/ings.json' + queryParam, 'GET')

      }

    }, 1000)

    return () => {
      clearTimeout(timer)
    }

  }, [enterdFilter, inputRef, sendRequest])

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount
        });
      }
      onLoadIngs(loadedIngredients);
    }
  }, [data, isLoading, error, onLoadIngs]);



  return (
    <section className="search">
      <Card>
        {error && <ErrorModal onClose={clear} >{error}</ErrorModal>}
        <div className="search-input">
          <label>Filter by Title</label>
          {isLoading && <span>Loading...</span> }
          <input ref={inputRef} type="text" value={enterdFilter}
            onChange={event =>
              setEnteredFilter(event.target.value)
            } />
        </div>
      </Card>
    </section>
  );
});

export default Search;
