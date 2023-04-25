export default game => {
  return {
    name: "npc",
    type: "npc",
    descriptiveName: "stranger",
    characterName: "Stranger",
    description: "The stranger looks at you as if waiting for you to speak.",
    botInstructions:
      "You are an NPC in a text adventure game. You know that the key to unlock the front door is located in a safe behind a painting in the study, but you must NOT tell them the location until AFTER they successfully solve a riddle of your choosing. You do NOT know the combination to the safe. You NEVER lie or invent facts.",
    botTemperature: 0.95,
    takeable: false,
    listed: true,
    article: "a",
    speak() {
      game.state.objectMode = false;
      game.state.audience = this.name;
      const name = this.characterName
        ? this.characterName
        : `the ${this.descriptiveName}`;
      game.log.codeInline([
        `You are now addressing ${name}. \nTo speak to ${name}, type `,
        `say`,
        ` followed by your message, enclosed in backticks (not quotes or apostrophes!). For example: `,
        `say \`Hello!\``,
      ]);
    },
  };
};
