import React from 'react';

class Playerinteface extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gamestate: this.props.gamestate,
    }
  }

  componentWillReceiveProps(nextprops) {
    console.log('Playerinterface: compWillReceiveProps:', nextprops);
    this.setState({
      gamestate: nextprops.gamestate,
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
        {(this.state.gamestate.ableToBuyRoad) ? <button type="button" id="buyroad" onClick={this.buy}>Buy Road</button> : null}

        {(this.state.gamestate.ableToBuySettlement) ? <button type="button" id="buysettlement" onClick={this.buy}>Buy Settlement</button> : null}

        {(this.state.gamestate.ableToBuyCity) ? <button type="button" id="buycity" onClick={this.buy}>Buy City</button> : null}

        {(this.state.gamestate.ableToBuyDevelopmentCard) ? <button type="button" id="buydevcard" onClick={this.buy}>Buy Development Card</button> : null}

        {(this.state.gamestate.ableToOfferTrade) ? <button type="button" id="offertrade" onClick={console.log('button: offerTrade pressed')}>Offer Trade</button> : null}

        {(this.state.gamestate.ableToPlayCardKnight) ? <button type="button" id="playcardknight" onClick={console.log('button: playcardknight pressed')}>Play Card: Knight</button> : null}

        {(this.state.gamestate.ableToPlayCardRoad) ? <button type="button" id="playcardroad" onClick={console.log('button: playcardroad pressed')}>Play Card: Road Building</button> : null}

        {(this.state.gamestate.ableToPlayCardMonopoly) ? <button type="button" id="playcardmonopoly" onClick={console.log('button: playcardmonopoly pressed')}>Play Card: Monopoly</button> : null}

        {(this.state.gamestate.ableToPlayCardPlenty) ? <button type="button" id="playcardplenty" onClick={console.log('button: playcardplenty pressed')}>Play Card: Plenty</button> : null}

        {(this.state.gamestate.ableToPlayCardVictory) ? <button type="button" id="playcardvictory" onClick={console.log('button: playcardvictory pressed')}>Play Card: Victory Point</button> : null}

        {(this.state.gamestate.isInMenu) ? <button type="button" id="cancelaction" onClick={console.log('button: cancel action pressed')}>Cancel Action</button> : null}

        {(this.state.gamestate.ableToCancelAction) ? <button type="button" id="cancelaction" onClick={console.log('button: cancel action pressed')}>Cancel Action</button> : null}

        {(!this.state.gamestate.hasRolled) ? <button type="button" onClick={this.props.diceRoll}>Roll Dice</button> : null}

        <button type="button" onClick={this.props.endTurn}>End Turn</button>
      </div>
    )
  }

}

export default Playerinteface;
