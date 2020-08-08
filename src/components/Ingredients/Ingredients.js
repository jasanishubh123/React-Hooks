import React, { useCallback, useReducer ,useMemo, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList'
import ErrorModal from '../UI/ErrorModal'
import useHttp from '../../hooks/http'



const ingReducer = (currentIngs, action) => {
  switch (action.type) {
    case 'SET':
      return action.ings
    case 'ADD':
      return [...currentIngs, action.ings]
    case 'DELETE':
      return currentIngs.filter(ing => ing.id !== action.id)
    default:
      throw new Error("should not get there")
  }
}



const Ingredients = () => {


 

  const {clear, isLoading,error,data,sendRequest ,reqExtra ,reqIdentifier} =useHttp();
  const [ingredients, dispatch] = useReducer(ingReducer, []);


  useEffect(()=>{
    if(!isLoading && !error && reqIdentifier==='REMOVE_INGS'){
      dispatch({type:'DELETE', id:reqExtra})
    }else if( !isLoading && !error && reqIdentifier==='ADD_INGS'){
      dispatch({ type: 'ADD', ings: { id: data.name, ...reqExtra } })
    }
     
  },[data,reqExtra,reqIdentifier,isLoading,error])


  const filterIngs = useCallback(filteredIngs => {
   
    dispatch({ type: 'SET', ings: filteredIngs })
  }, [])

  const addIngredientHandler = useCallback(ingredient => {

    sendRequest('https://react-hook-f8d6e.firebaseio.com/ings.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGS'
    )

  },[sendRequest])

  const removeIngredient = useCallback(id => {
    sendRequest(`https://react-hook-f8d6e.firebaseio.com/ings/${id}.json`,
        'DELETE',
        null,
        id,
        'REMOVE_INGS'
    )

  },[sendRequest])



 

  const ingList=useMemo(()=>{
    return(
      <IngredientList
      ingredients={ingredients} 
      onRemoveItem={removeIngredient} />
    )
  },[ingredients,removeIngredient])

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear} >{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} loading={isLoading} />

      <section>
        <Search onLoadIngs={filterIngs} />
       {ingList}
      </section>
    </div>
  );
}

export default Ingredients;
