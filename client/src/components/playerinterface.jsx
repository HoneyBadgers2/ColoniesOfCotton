import React from 'react';

class Playerinteface extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gamestate: this.props.gamestate
    }
  }

  componentWillReceiveProps(nextprops) {
    console.log('Playerinterface: compWillReceiveProps:', nextprops);
    this.setState({
      // slotnumber: this.props.number,
      gamestate: nextprops.gamestate
    });
  }
  
  buy(event) {
    var item = event.target.id;
    if (item === 'buyroad') {
      console.log('buy: player wants to buy: ', item);
      this.props.buymethod(item);
    } else if (item === 'buysettlement') {
      console.log('buy: player wants to buy: ', item);
    } else if (item === 'buycity') {
      console.log('buy: player wants to buy: ', item);
    } else if (item === 'buydevcard') {
      console.log('buy: player wants to buy: ', item);
    } 

  }


  render() {
    return (
      <div>
        <h3>Player Actions Menu</h3>
        <button type="button" id="buyroad" onClick={this.buy}>Buy Road</button>
        <button type="button" id="buysettlement" onClick={this.buy}>Buy Settlement</button>
        <button type="button" id="buycity" onClick={this.buy}>Buy City</button>
        <button type="button" id="buydevcard" onClick={this.buy}>Buy Development Card</button>
        <button type="button" onClick={this.props.diceRoll}>Roll Dice</button>
        <button type="button" onClick={this.props.endTurn}>End Turn</button>
      </div>
    )
  }

}

export default Playerinteface;