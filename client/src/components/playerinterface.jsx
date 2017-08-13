import React from 'react';

class Playerinteface extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gamestate: this.props.gamestate,
    }

    this.takeAction = this.takeAction.bind(this);
  }

  componentWillReceiveProps(nextprops) {
    console.log('Playerinterface: compWillReceiveProps:', nextprops);
    this.setState({
      gamestate: nextprops.gamestate,
    });
  }

  takeAction(event) {
    var item = event.target.id;
    if (item === 'buyroad') {
      // console.log('button: player wants to: ', item);
      this.props.buymethod(item);
    } else if (item === 'buysettlement') {
      // console.log('button: player wants to: ', item);
      this.props.buymethod(item);
    } else if (item === 'buycity') {
      // console.log('button: player wants to: ', item);
      this.props.buymethod(item);
    } else if (item === 'buydevcard') {
      // console.log('button: player wants to: ', item);
      this.props.buymethod(item);
    } else if (item === 'offertrade') {
      // console.log('button: player wants to: ', item);
      this.props.offertrademethod();
    } else if (item === 'playcardknight') {
      // console.log('button: player wants to: ', item);
      this.props.playcardmethod(item);
    } else if (item === 'playcardroad') {
      // console.log('button: player wants to: ', item);
      this.props.playcardmethod(item);
    } else if (item === 'playcardmonopoly') {
      // console.log('button: player wants to: ', item);
      this.props.playcardmethod(item);
    } else if (item === 'playcardplenty') {
      // console.log('button: player wants to: ', item);
      this.props.playcardmethod(item);
    } else if (item === 'playcardvictory') {
      // console.log('button: player wants to: ', item);
      this.props.playcardmethod(item);
    }


  }


  render() {
    return (
      <div>
        <h3>Player Actions Menu</h3>
        {(this.state.gamestate.ableToBuyRoad) ? <button type="button" id="buyroad" onClick={this.takeAction}>Buy Road</button> : null}

        {(this.state.gamestate.ableToBuySettlement) ? <button type="button" id="buysettlement" onClick={this.takeAction}>Buy Settlement</button> : null}

        {(this.state.gamestate.ableToBuyCity) ? <button type="button" id="buycity" onClick={this.takeAction}>Buy City</button> : null}

        {(this.state.gamestate.ableToBuyDevelopmentCard) ? <button type="button" id="buydevcard" onClick={this.takeAction}>Buy Development Card</button> : null}

        {(this.state.gamestate.ableToOfferTrade) ? <button type="button" id="offertrade" onClick={this.takeAction}>Offer Trade</button> : null}

        {(this.state.gamestate.ableToPlayCardKnight) ? <button type="button" id="playcardknight" onClick={this.takeAction}>Play Card: Knight</button> : null}

        {(this.state.gamestate.ableToPlayCardRoad) ? <button type="button" id="playcardroad" onClick={this.takeAction}>Play Card: Road Building</button> : null}

        {(this.state.gamestate.ableToPlayCardMonopoly) ? <button type="button" id="playcardmonopoly" onClick={this.takeAction}>Play Card: Monopoly</button> : null}

        {(this.state.gamestate.ableToPlayCardPlenty) ? <button type="button" id="playcardplenty" onClick={this.takeAction}>Play Card: Plenty</button> : null}

        {(this.state.gamestate.ableToPlayCardVictory) ? <button type="button" id="playcardvictory" onClick={this.takeAction}>Play Card: Victory Point</button> : null}

        {(this.state.gamestate.isInMenu) ? <button type="button" id="cancelaction" onClick={this.takeAction}>Cancel Action (isInMenu)</button> : null}

        {(this.state.gamestate.ableToCancelAction) ? <button type="button" id="cancelaction" onClick={this.takeAction}>Cancel Action (ableToCancel)</button> : null}

        {(!this.state.gamestate.hasRolled) ? <button type="button" onClick={this.props.diceRoll}>Roll Dice</button> : null}

        <button type="button" onClick={this.props.endTurn}>End Turn</button>
      </div>
    )
  }

}

export default Playerinteface;
