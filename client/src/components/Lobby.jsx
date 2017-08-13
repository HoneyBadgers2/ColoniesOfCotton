import React, { Component } from 'react';
import { Form, Input, Button, Dropdown, Table, Divider } from 'semantic-ui-react';
import data from '../../../data.json';
import axios from 'axios';



class Lobby extends Component {
  constructor(props){
    super(props)
    this.state = {
      newRoomName: '',
      newRoomDescription: '',
      joinRoomName: '',
      roomsList: [],
    }
    this.addNewGameToState = this.addNewGameToState.bind(this);
    this.createNewRoom = this.createNewRoom.bind(this);
    this.getGameList = this.getGameList.bind(this);
    this.addNewRoomDescription = this.addNewRoomDescription.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.changeJoinRoom = this.changeJoinRoom.bind(this);
  }

componentDidMount(){
  this.getGameList()
}

getGameList(){
  axios.get('/games')
  .then((data) => {
      let tempArr = [];
      data.data.forEach(function (stuff){
        tempArr.push({
          key: stuff.game_session_id,
          text: stuff.game_session_id,
          value: stuff.game_session_id
        });
      })
      this.setState({
        roomsList: tempArr
      })
    }).catch((err) => {
      return console.log(err)
    })
}

addNewGameToState(e) {
  console.log('text ', this.state.newRoomName)
  this.setState({ newRoomName: e.target.value })
}

addNewRoomDescription(e) {
  console.log('text ', this.state.newRoomDescription)
  this.setState({ newRoomDescription: e.target.value })
}

createNewRoom(){
  axios.post('/newGame', {
    game_session_id: this.state.newRoomName,
    game_description: this.state.newRoomDescription,
    players: data.players,
    settlements: data.settlements,
    tiles: data.tiles,
    roads: data.roads
  })
  .then(this.getGameList())
}

joinRoom(){
  console.log('joining room', this.state.joinRoom);
}

changeJoinRoom(e, option){
  this.setState({joinRoom: option.value});
}

  render() {
    return (
      <div>
      <Form>
        <Form.Field>
          <label>Create A New Room</label>
          <input value={this.state.newRoomName} onChange={this.addNewGameToState} />
        </Form.Field>
          <Button.Group>
            <Button>Cancel</Button>
            <Button.Or/>
            <Button positive onClick={this.createNewRoom}>Save</Button>
          </Button.Group>
      </Form>
      <Divider />
      <Dropdown
        placeholder='Select Room'
        search
        floating
        labeled
        button
        selection
        className='icon'
        icon='game'
        onChange={this.changeJoinRoom}
        options={this.state.roomsList}/>
        <Button positive onClick={this.joinRoom} value={this.state.joinRoom}>Join Room</Button>
      <Divider />
      <Table fixed>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Room Name</Table.HeaderCell>
            <Table.HeaderCell>Players</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {this.state.roomsList.map(function (room, i){
            console.log
            return(
              <Table.Row key={i}>
                <Table.Cell>{room.game_session_id}</Table.Cell>
                <Table.Cell>0</Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table>
    </div>
    );
  }
}

export default Lobby;