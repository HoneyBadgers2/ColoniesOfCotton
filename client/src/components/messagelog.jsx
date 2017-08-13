import React from 'react';
const style = {
  overflow: 'scroll',
  height: "150px"
}

class Messagelog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gamestate: this.props.gamestate
    }
  }

  componentWillReceiveProps(nextprops) { }


  render() {
    return (<div >
      <h2 > MESSAGE LOG </h2> <div style={
        style
      } > {
          this.props.messages.map((message, index) => {
            return (<div key={
              index
            } > {
                message.user
              }: {
                message.text
              } </div>)
          })
        } </div> <input style={
          {
            width: '100%'
          }
        }
          type='text'
          placeholder="Write a message!"
          onKeyUp={
            this.props.handleSubmitMessage
          }
      /> </div>
    )
  }

}

export default Messagelog;
