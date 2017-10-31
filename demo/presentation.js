import React, { Component } from "react";

import Intro from "./intro";
import Game from "./game";

export default class Presentation extends Component {
  handleStart = () => {
    this.setState({
      gameState: 1,
    });
  };

  handleDone = () => {
    this.setState({
      gameState: 1,
    });
  };

  handleLeave = index => {
    this.setState({
      gameState: 2,
    });
  };

  constructor(props) {
    super(props);

    this.state = {
      gameState: 1,
    };
  }
  render() {
    this.gameStates = [
      <Intro onStart={this.handleStart} />,
      <Game onLeave={this.handleLeave} />,
    ];
    return <Game onLeave={this.handleLeave} />;
  }
}
