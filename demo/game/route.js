import React, { Component, PropTypes } from "react";
import { autorun } from "mobx";
import GameStore from "./stores/game-store";

class RoutePoint extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    const { position } = this.props;
    return (
      <div
        style={{
          position: "absolute",
          transform: `translate(${position.x}px, ${position.y}px)`,
          width: 1,
          height: 1,
          backgroundColor: "#fff",
        }}
      />
    );
  }
}

export default class Route extends Component {
  static contextTypes = {
    scale: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.state = {
      routePositions: [],
    };
  }

  componentDidMount() {
    this.characterWatcher = autorun(() => {
      const { x, y } = GameStore.characterPosition;
      const positionExists = this.state.routePositions.find(p => {
        return p.x === x && p.y === y;
      });
      if (positionExists) {
        return;
      }
      this.setState({
        routePositions: [...this.state.routePositions, { x, y }],
      });
    });
  }

  componentWillUnmount() {
    this.characterWatcher();
  }

  getWrapperStyles() {
    return {
      position: "absolute",
      transform: `translate(${this.state.stageX}px, 0px) translateZ(0)`,
      transformOrigin: "top left",
    };
  }

  render() {
    return (
      <div style={this.getWrapperStyles()}>
        {this.state.routePositions.map(position => (
          <RoutePoint position={position} />
        ))}
      </div>
    );
  }
}
