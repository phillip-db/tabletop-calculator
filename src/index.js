import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

class CalculatorApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      text: "",
      currentGame: null,
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
      score: 0,
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

  changeGame(gameName) {
    this.setState({
      currentGame: gameName,
    });
  }

  updateScore(id, amount) {
    const isMatchingId = (player) => player.id === id;
    const playerIndex = this.state.players.findIndex(isMatchingId);
    const newPlayer = this.state.players[playerIndex];
    newPlayer.score += amount;

    const updatedPlayers = this.state.players.map((player, index) => {
      return index === playerIndex ? newPlayer : player;
    });

    this.setState({
      players: updatedPlayers,
    });
  }

  render() {
    const players = this.state.players;
    const currentGame = this.state.currentGame
      ? this.state.currentGame
      : "No game selected";
    const gameList = [
      { name: "Oh Hell" },
      { name: "Spades" },
      { name: "Hearts" },
    ];

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
        <h3>Game List</h3>
        <GameList
          gameList={gameList}
          changeGame={(newGame) => this.changeGame(newGame)}
        />
        <h3>Current Game</h3>
        <h4>{currentGame}</h4>
        <Scoreboard
          players={players}
          updateScore={(id, amount) => this.updateScore(id, amount)}
        />
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
        <button
          className="round-button"
          onClick={() => this.props.handleRemove(player.id)}
        >
          X
        </button>
      </li>
    ));

    return <ol>{list}</ol>;
  }
}

class GameList extends React.Component {
  handleClick(gameName) {
    this.props.changeGame(gameName);
  }

  render() {
    const gameList = this.props.gameList.map((game) => (
      <button key={game.name} onClick={() => this.handleClick(game.name)}>
        {game.name}
      </button>
    ));
    return <div>{gameList}</div>;
  }
}

class GameOhHell extends React.Component {}

class Scoreboard extends React.Component {
  render() {
    const players = this.props.players;

    const playerList = players.map((player) => (
      <div key={player.id} className="grid-item">
        {player.text}
      </div>
    ));

    const scoreList = players.map((player) => (
      <div key={player.id} className="grid-item">
        <button
          className="round-button"
          onClick={() => this.props.updateScore(player.id, -1)}
        >
          -1
        </button>
        {"\t"}
        {player.score}
        {"\t"}
        <button
          className="round-button"
          onClick={() => this.props.updateScore(player.id, 1)}
        >
          +1
        </button>
      </div>
    ));

    return (
      <div className="grid-container">
        <div className="grid-col">
          <div className="grid-item grid-header">Player</div>
          {playerList}
        </div>
        <div className="grid-col">
          <div className="grid-item grid-header">Score</div>
          {scoreList}
        </div>
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<CalculatorApp />);
