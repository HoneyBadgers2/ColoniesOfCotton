import React, {Component} from 'react';
import Game from './game.jsx'; 
import LandingPage from './LandingPage.jsx';
import { Redirect } from 'react-router';
import { HashRouter, Route } from 'react-router-dom';


export default class App extends Component {

    constructor(props) {
        super(props);
      
    }



    render() {

        return (
            <HashRouter>
                <div>
                    <Route exact path='/' component={LandingPage}/>                  
                    <Route path="/game/:room" component= {Game}/>
                    <Route path="/lobby" component={Lobby}/>
                </div>
            </HashRouter>
        )

    }
}
