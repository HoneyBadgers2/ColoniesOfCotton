import React from 'react';
import {Input} from 'semantic-ui-react';


class Messagelog extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        gamestate: this.props.gamestate
      }
    }

    componentWillReceiveProps(nextprops) {}


    render() {
      return ( <div className="compMessageLog">
        <div style={{margin: "10px"}}>
        <br></br><br></br><br></br>
        <div style={{height: "400px", overflowY: "scroll", overflowWrap: "break-word"}}> {
          this.props.messages.map((message, index) => {
              return (<div key={index} className="messageLine"> {message.user}: {message.text} </div>)
          })
        }

        </div>
        <Input className="messageEntryBox" type="text" onKeyUp={this.props.handleSubmitMessage} placeholder="Write a message..."/>
        
        </div>
        </div> )
      }

    }

export default Messagelog;
