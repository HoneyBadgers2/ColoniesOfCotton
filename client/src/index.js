import React from 'react';
import ReactDOM from 'react-dom';
import Lobby from './components/Lobby.jsx';
import App from './components/App.jsx';

ReactDOM.render(<Lobby />, document.getElementById('app'));
document.addEventListener('contextmenu', event => event.preventDefault());