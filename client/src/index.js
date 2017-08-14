import React from 'react';
import ReactDOM from 'react-dom';
import Game from './components/game.jsx';
import App from './components/App.jsx';
import Temporary from './components/temp.jsx';

ReactDOM.render(<Temporary/>, document.getElementById('app'));
document.addEventListener('contextmenu', event => event.preventDefault());