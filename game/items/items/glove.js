export default (game) => {
  return {
    name: "glove",
    closed: true,
    points: 1,
    description: "It is a well-worn gray leather work glove. There is nothing otherwise remarkable about it.",
    contents: [],
    examine () {
      game.state.objectMode = false;
      if (this.contents.length) {
        Object.getPrototypeOf(this).examine.call(this);
        const hiddenItem = this.contents.pop();
        game.log.p(`As you examine the glove, a ${hiddenItem.name} falls out, onto the floor.`);
        game.state.currentMapCell.addToEnv(hiddenItem.name);
      }
    }
  }
}