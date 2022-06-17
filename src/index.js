import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

class CalculatorApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      text: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.text.length === 0) return;

    const newPlayer = {
      text: this.state.text,
      id: Date.now(),
    };

    this.setState((state) => ({
      players: state.players.concat(newPlayer),
      text: "",
    }));
  }

  handleRemove(id) {
    this.setState({
      players: this.state.players.filter((player) => player.id !== id),
    });
  }

  render() {
    const players = this.state.players;

    return (
      <div>
        <h3>Player List</h3>
        <PlayerList
          players={players}
          handleRemove={(id) => this.handleRemove(id)}
        />
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="new-player">Player Name: </label>
          <input
            id="new-player"
            onChange={this.handleChange}
            value={this.state.text}
          />
          <button>Add Player</button>
        </form>
      </div>
    );
  }
}

class PlayerList extends React.Component {
  render() {
    const players = this.props.players;

    const list = players.map((player) => (
      <li key={player.id}>
        {player.text}
        {"\t"}
        <button onClick={() => this.props.handleRemove(player.id)}>X</button>
      </li>
    ));

    return <ol>{list}</ol>;
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<CalculatorApp />);
