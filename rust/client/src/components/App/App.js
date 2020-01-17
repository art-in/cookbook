import React from 'react';

import './global.css';

import RecipeList from '../RecipeList';
import classes from './App.css';

export default function App() {
  return (
    <div className={classes.root}>
      <RecipeList />
    </div>
  );
}
