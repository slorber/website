import React from 'react';
import { hydrate, render } from 'react-dom';
import './index.css';
import initializeHighlighter from 'lib-react/language';
import App from './App';

initializeHighlighter();

const rootElement = document.getElementById('root');
if (rootElement == null) {
  throw new Error('We messed up the DOM tree!');
}
if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}