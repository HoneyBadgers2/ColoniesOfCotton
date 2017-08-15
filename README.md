# ColoniesOfCotton

> A clone of the Settlers of Catan board game

## Team

  - __Product Owner__: Timothy Yoon
  - __Scrum Master__: Jeffrey Lee
  - __Development Team Members__: Aren Rostamian, Michael Nguyen

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> After installing dependencies:

> To run on localhost:
> 
> under client/src/components/Auth.js:
> update the AuthLock section for localhost port (or whatever url to deploy).
> In the browser, navigate to localhost. Landing page will open first. Login through auth0 to proceed to the Lobby page. Select a lobby to join, and once 4 players join the same lobby (you can open 4 tabs for 4 player instances), game will start.

## Requirements

- "auth0": "^2.7.0",
- "auth0-js": "^8.9.1",
- "auth0-lock": "^10.20.0",
- "axios": "^0.16.2",
- "babel": "^6.23.0",
- "babel-core": "^6.25.0",
- "babel-loader": "^7.1.1",
- "babel-preset-es2015": "^6.24.1",
- "babel-preset-react": "^6.24.1",
- "babylonjs": "^3.1.0-alpha1",
- "body-parser": "^1.17.2",
- "dotenv": "^4.0.0",
- "express": "^4.15.3",
- "history": "^4.6.3",
- "lock": "^0.1.4",
- "mongoose": "^4.11.6",
- "nodemon": "^1.11.0",
- "path": "^0.12.7",
- "prop-types": "^15.5.10",
- "react": "^15.6.1",
- "react-babylonjs": "0.0.8",
- "react-dom": "^15.6.1",
- "react-router": "^4.1.2",
- "react-router-dom": "^4.1.2",
- "semantic-ui-react": "^0.71.4",
- "sequelize": "^4.4.2",
- "socket.io": "^2.0.3",
- "webpack": "^3.4.1"

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install
```

### Roadmap

View the project roadmap [here](LINK_TO_PROJECT_ISSUES)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## Ideas for Contributions
- Complete the missing functionalities of the game (discard on roll = 7, longest road)
- Debug game functionality (overall needs more playtesting)
- Implement working Auth0 or other authentication
- Player stats in database
- Saved instances of games to database
- Tracking of additional data in game (turn order)
- Additional game features (dynamic board (unlikely), variable players (instead of being fixed at 4 players), turn timers)


## Known Bugs
- Robber Steal: state is not updated correctly when stealing. It's possible to continuously steal by clicking on that player.
