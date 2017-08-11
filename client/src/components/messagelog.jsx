import React from 'react';

class Messagelog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gamestate: this.props.gamestate
    }
  }

  componentWillReceiveProps(nextprops) {
  }
  

  render() {
    return (
      <div>
        <h2> MESSAGE LOG </h2>
        {this.props.messages.map((message, index) =>{
          return (<div key={index}>{message.user}:  {message.text}</div>)
        })}
        <input type='text' placeholder="Write a message!" onKeyUp={this.props.handleSubmitMessage}/>
      </div>
    )
  }

}

export default Messagelog;
