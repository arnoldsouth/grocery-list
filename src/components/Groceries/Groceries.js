import React, { useReducer, useEffect, useCallback, useMemo } from "react";

import GroceryForm from "./GroceryForm";
import GroceryList from "./GroceryList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";
import useHttp from "../../hooks/http";

const groceryReducer = (currentGroceries, action) => {
  switch (action.type) {
    case "SET":
      return action.groceries;
    case "ADD":
      return [...currentGroceries, action.grocery];
    case "DELETE":
      return currentGroceries.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Should not get there!");
  }
};

const Groceries = () => {
  const [userGroceries, dispatch] = useReducer(groceryReducer, []);
  const { isLoading, error, data, sendRequest, reqExtra, reqIdentifer, clear } =
    useHttp();

  useEffect(() => {
    if (!isLoading && !error && reqIdentifer === "REMOVE_GROCERY") {
      dispatch({ type: "DELETE", id: reqExtra });
    } else if (!isLoading && !error && reqIdentifer === "ADD_GROCERY") {
      dispatch({
        type: "ADD",
        grocery: { id: data.name, ...reqExtra },
      });
    }
  }, [data, reqExtra, reqIdentifer, isLoading, error]);

  const filteredGroceriesHandler = useCallback((filteredGroceries) => {
    dispatch({ type: "SET", groceries: filteredGroceries });
  }, []);

  const addGroceryHandler = useCallback(
    (grocery) => {
      sendRequest(
        "https://grocery-list-react-hooks-default-rtdb.firebaseio.com/groceries.json",
        "POST",
        JSON.stringify(grocery),
        grocery,
        "ADD_GROCERY"
      );
    },
    [sendRequest]
  );

  const removeGroceryHandler = useCallback(
    (groceryId) => {
      sendRequest(
        `https://grocery-list-react-hooks-default-rtdb.firebaseio.com/groceries/${groceryId}.json`,
        "DELETE",
        null,
        groceryId,
        "REMOVE_GROCERY"
      );
    },
    [sendRequest]
  );

  const groceryList = useMemo(() => {
    return (
      <GroceryList
        groceries={userGroceries}
        onRemoveItem={removeGroceryHandler}
      />
    );
  }, [userGroceries, removeGroceryHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}

      <GroceryForm
        onAddGrocery={addGroceryHandler}
        loading={isLoading}
      />

      <section>
        {/* <Search onLoadGroceries={filteredGroceriesHandler} /> */}
        {groceryList}
      </section>
    </div>
  );
};

export default Groceries;
