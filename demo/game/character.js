import React, { Component, PropTypes } from "react";
import { observer } from "mobx-react";
import Matter from "matter-js";

import { AudioPlayer, Sprite } from "../../src";

@observer
export default class Character extends Component {
  static propTypes = {
    keys: PropTypes.object,
    onEnterBuilding: PropTypes.func,
    store: PropTypes.object,
  };

  static contextTypes = {
    scale: PropTypes.number,
    loop: PropTypes.any,
  };

  handlePlayStateChanged = state => {
    this.setState({
      spritePlaying: state ? true : false,
    });
  };

  move = (deltaX, deltaY) => {
    const newX = this.state.positionX + deltaX;
    const newY = this.state.positionY + deltaY;
    this.setState({
      positionX: newX,
      positionY: newY,
    });
  };

  checkKeys = () => {
    const { keys, store } = this.props;

    let characterState = 2;
    const AmountToMove = 1;

    if (keys.isDown(keys.LEFT)) {
      this.move(-AmountToMove, 0);
    } else if (keys.isDown(keys.DOWN)) {
      this.move(0, AmountToMove);
      characterState = 1;
    } else if (keys.isDown(keys.RIGHT)) {
      this.move(AmountToMove, 0);
      characterState = 0;
    } else if (keys.isDown(keys.UP)) {
      this.move(0, -AmountToMove);
    }

    this.setState({
      characterState,
      repeat: characterState < 2,
    });
  };

  update = () => {
    const { store } = this.props;

    this.checkKeys();
    store.setCharacterPosition({
      x: this.state.positionX,
      y: this.state.positionY,
    });
  };

  constructor(props) {
    super(props);

    this.loopID = null;
    this.isJumping = false;
    this.isPunching = false;
    this.isLeaving = false;

    this.state = {
      positionX: 0,
      positionY: 0,
      characterState: 2,
      loop: false,
      spritePlaying: true,
    };
  }

  componentDidMount() {
    //this.jumpNoise = new AudioPlayer('/assets/jump.wav');
    this.loopID = this.context.loop.subscribe(this.update);
  }

  componentWillUnmount() {
    this.context.loop.unsubscribe(this.loopID);
  }

  getWrapperStyles() {
    const { characterPosition } = this.props.store;
    const { scale } = this.context;
    const { x, y } = characterPosition;

    return {
      position: "absolute",
      transform: `translate(${x}px, ${y}px)`,
    };
  }

  render() {
    const x = this.props.store.characterPosition.x;
    const y = this.props.store.characterPosition.y;

    return (
      <div style={this.getWrapperStyles()}>
        <div
          style={{
            position: "absolute",
            transform: `translate(${x}px, ${y}px)`,
          }}
        />
        <Sprite
          repeat={this.state.repeat}
          onPlayStateChanged={this.handlePlayStateChanged}
          src="assets/character-sprite.png"
          scale={this.context.scale * 2}
          state={this.state.characterState}
          steps={[9, 9, 0, 4, 5]}
        />
      </div>
    );
  }
}
