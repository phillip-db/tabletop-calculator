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
      currentRound: 1,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.gameList = [
      {
        name: "Oh Hell",
        game: <GameOhHell />,
      },
    ];
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
    console.log(gameName);
    const newGame = this.gameList.filter((entry) => entry.name === gameName)[0];
    console.log(newGame);
    this.setState({
      currentGame: newGame,
      currentRound: 1,
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

  updateAllScores(intValues, boolValues) {
    for (var i = 0; i < this.state.players.length; i++) {
      const id = this.state.players[i].id;
      const int = intValues[i] ? parseInt(intValues[i]) : 0;
      const bool = boolValues[i] ? boolValues[i] : false;
      const roundScore = int === 0 ? 5 + this.state.currentRound : 10 + int;
      console.log(intValues + " " + boolValues);
      this.updateScore(id, bool ? roundScore : 0);
    }
  }

  incrementRound() {
    this.setState({ currentRound: this.state.currentRound + 1 });
  }

  render() {
    const currentGameName = this.state.currentGame
      ? this.state.currentGame.name + " || Round: " + this.state.currentRound
      : "No game selected";
    const scoreboard = (
      <Scoreboard
        players={this.state.players}
        updateScore={(id, amount) => this.updateScore(id, amount)}
        updateAllScores={(intValues, boolValues) =>
          this.updateAllScores(intValues, boolValues)
        }
        currentGame={this.state.currentGame}
        incrementRound={() => this.incrementRound()}
        currentRound={this.state.currentRound}
      />
    );
    const scoreboardRender = this.state.currentGame ? scoreboard : null;

    return (
      <div className="container">
        <h3>Player List</h3>
        <PlayerList
          players={this.state.players}
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
          gameList={this.gameList}
          changeGame={(newGame) => this.changeGame(newGame)}
        />
        <h3>Current Game</h3>
        <h4>{currentGameName}</h4>
        {scoreboardRender}
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
  constructor(props) {
    super(props);
    this.state = { intValues: [], boolValues: [] };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  updateIntValues(i, amount) {
    let intValues = [...this.state.intValues];
    intValues[i] = (intValues[i] ? parseInt(intValues[i]) : 0) + amount;
    this.setState({ intValues });
  }

  handleIntChange(i, e) {
    let intValues = [...this.state.intValues];
    intValues[i] = e.target.value;
    this.setState({ intValues });
  }

  handleBoolChange(i, e) {
    let boolValues = [...this.state.boolValues];
    boolValues[i] = e.target.checked;
    this.setState({ boolValues });
    console.log(
      "Bool change " + this.state.boolValues[i] + " " + e.target.value
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("Submit!");

    this.props.updateAllScores(this.state.intValues, this.state.boolValues);
    this.setState({
      intValues: [],
      boolValues: [],
    });
    this.props.incrementRound();
  }

  render() {
    const players = this.props.players;

    const playerList = players.map((player, i) => (
      <div key={player.id} className="grid-item">
        <span className="scoreboard-player-name">{player.text}</span>
        <button
          className="round-button"
          type="button"
          onClick={() => this.updateIntValues(i, -1)}
        >
          -1
        </button>
        <input
          className="input-numerical"
          type="number"
          min="0"
          value={this.state.intValues[i] || 0}
          onChange={this.handleIntChange.bind(this, i)}
        ></input>
        <button
          className="round-button"
          type="button"
          onClick={() => this.updateIntValues(i, 1)}
        >
          +1
        </button>
        <input
          className="input-bool"
          type="checkbox"
          checked={this.state.boolValues[i] || false}
          onChange={this.handleBoolChange.bind(this, i)}
        ></input>
      </div>
    ));

    const scoreList = players.map((player) => (
      <div key={player.id} className="grid-item">
        <button
          className="round-button"
          onClick={() => this.props.updateScore(player.id, -1)}
          type="button"
        >
          -1
        </button>
        {"\t"}
        {player.score}
        {"\t"}
        <button
          className="round-button"
          onClick={() => this.props.updateScore(player.id, 1)}
          type="button"
        >
          +1
        </button>
      </div>
    ));

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="grid-container">
          <div className="grid-col">
            <div className="grid-item grid-header">Player</div>
            {playerList}
          </div>
          <div className="grid-col">
            <div className="grid-item grid-header">Score</div>
            {scoreList}
            <button className="button-submit-round">Submit</button>
          </div>
        </div>
      </form>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<CalculatorApp />);
