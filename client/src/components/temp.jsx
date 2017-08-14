import React, { Component } from 'react';
import { HashRouter as Router, Link, Route  } from 'react-router-dom'
import Lobby from './Lobby';
import Game from './game'


class Temporary extends Component {
    render() {
        return (
                <Router>
                        <div>
                        <div> THIS IS IN THE ROUTER </div>
                        <Route exact path="/" component={Lobby}/>
                        <Route path="/game/:room" component= {Game}/>
                        </div>
                </Router>
        );
    }
}

export default Temporary;