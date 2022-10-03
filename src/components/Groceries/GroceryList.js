import React from "react";

import "./GroceryList.css";

const GroceryList = (props) => {
  console.log("RENDERING GROCERY LIST");
  return (
    <section className="grocery-list">
      <h2>Current Item List</h2>
      <ul>
        {props.groceries.map((grocery) => (
          <li
            key={grocery.id}
            onClick={props.onRemoveItem.bind(this, grocery.id)}
          >
            <span>{grocery.title}</span>
            <span>{grocery.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default GroceryList;
