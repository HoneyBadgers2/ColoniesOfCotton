import React from 'react';
import ReactDOM from 'react-dom';
import Game from './components/Game.jsx';
import App from './components/App.jsx';

ReactDOM.render(<Game />, document.getElementById('app'));
document.addEventListener('contextmenu', event => event.preventDefault());