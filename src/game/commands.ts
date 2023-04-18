import { pStyle } from "./utils/prefs";
import thesaurus from "./utils/thesaurus";
import maps from "./maps/maps";
import { cases, formatList, aliasString } from "./utils/helpers";
import { GameType } from "./Game";
import { ItemType } from "./items/Item";

export type CommandAlias = [(command: string) => void, string];

// Command functions
const initCommandAliases = function (game: GameType): CommandAlias[] {
  // Change player's location on the map, given a direction
  const movePlayer = (direction: string) => {
    game.state.objectMode = false;
    let newPosition = {
      x: game.state.position.x,
      y: game.state.position.y,
      z: game.state.position.z,
    };
    switch (direction) {
      case "north":
        newPosition.y = newPosition.y - 1;
        break;
      case "south":
        newPosition.y = newPosition.y + 1;
        break;
      case "east":
        newPosition.x = newPosition.x + 1;
        break;
      case "west":
        newPosition.x = newPosition.x - 1;
        break;
      case "up":
        newPosition.z = newPosition.z + 1;
        break;
      case "down":
        newPosition.z = newPosition.z - 1;
        break;
      default:
        break;
    }
    const newCell = maps[newPosition.z][newPosition.y][newPosition.x];
    // Exit function if movement in given direction is not possible due to map boundary
    if (newCell === "*") {
      game.log.p("You can't go that direction.");
      game.state.abortMode = true; // don't count failed move as a turn; don't increment timers
      return;
    }
    // Display message and exit function if path to next space is blocked by a locked or closed door or analagous item
    if (game.mapKey[newCell].locked || game.mapKey[newCell].closed) {
      game.log.p("The way is blocked.");
      game.log.p(
        game.mapKey[newCell].lockText &&
          (game.mapKey[newCell].locked || game.mapKey[newCell].closed)
          ? game.mapKey[newCell].lockText
          : ""
      );
      return;
    }
    // If movement in direction is possible, update player position
    game.log.p(`You walk ${direction}...`);
    game.state.position = {
      x: newPosition.x,
      y: newPosition.y,
      z: newPosition.z,
    };
    // End by describing new environment after move
    return game.describeSurroundings();
  };

  // Describe environment and movement options in current location
  const look = (command: string) => {
    return game.describeSurroundings();
  };

  const smell = (command: string) => {
    game.log.p(game.state.currentMapCell.smell);
    return;
  };

  const listen = (command: string) => {
    game.log.p(game.state.currentMapCell.sound);
    return;
  };

  // Handles commands that require an object. Sets pendingAction to the present command, and objectMode so that next command is interpreted as the object of the pending command.
  const act_upon = (command: string) => {
    game.state.objectMode = true;
    game.state.pendingAction = command;
    game.log.p(`What would you like to ${command}?`);
  };

  // none function is bound to commands that should do nothing at all
  const none = () => {}; // do nothing

  const wait = () => {
    game.log.p("Time passes...");
  };

  const go = () => {
    game.log.p("Which direction do you want to go?");
  };

  // Displays items in the player's inventory.
  const inventory = (command: string) => {
    let items: string[] = [],
      itemsPlusArticles: string[] = [];
    game.state.inventory.forEach((item: ItemType) => {
      if (item.listed) {
        items.push(item.name);
        const itemWithArticle = item.article
          ? `${item.article} ${item.name}`
          : item.name;
        itemsPlusArticles.push(itemWithArticle);
      }
    });

    let segments = `You are carrying ${formatList(itemsPlusArticles)}`.split(
      " "
    );

    let itemStyle = `font-size:120%;color:cyan;font-style:italic;`;

    let styles = segments.map(word => {
      let style = pStyle;
      items.map(thing => {
        if (word.includes(thing)) {
          style = itemStyle;
        }
      });
      return style;
    });

    segments = segments.map((word, i) => {
      return i === segments.length - 1 ? `${word}.` : `${word} `;
    });
    return game.log.inline(segments, styles);
  };

  // Displays inventory as a table.
  const inventoryTable = (command: string) => {
    const table = game.state.inventory.map((item: ItemType) => {
      const { name, description } = item;
      return { name, description };
    });
    return game.log.table(table, ["name", "description"]);
  };

  // Handles commands that are item names.
  const items = (itemName: string) => {
    // Exit function with error message if previous command does not require an object
    if (!game.state.objectMode && itemName !== "maps") {
      game.log.invalid("Invalid command.");
      return;
    }
    // Exit function with error message if item is not available in player inventory or current location.
    const item = game.inEnvironment(itemName) || game.inInventory(itemName);
    if (!item) {
      game.state.objectMode = false;
      game.log.p(`The ${itemName} is unavailable.`);
      return;
    }
    const action = game.state.pendingAction;
    // invoke the item's method that corresponds to the selected action
    item[action]();
  };

  const yell = () => {
    game.log.scream("Aaaarrgh!!!!");
  };

  const verbose = () => {
    if (game.state.verbose) {
      game.state.verbose = false;
      game.log.p("Verbose mode off.");
      return;
    }
    game.state.verbose = true;
    game.log.p("Maximum verbosity.");
  };

  const score = () => {
    game.log.p(
      `Your score is ${game.state.score} in ${game.state.turn} turns.`
    );
  };

  const commands = () => {
    const commandAliases = game.commandList.map(
      ([_, aliases]: CommandAlias) => aliases
    );
    const commandTable = commandAliases.reduce((map, aliases) => {
      const [commandName, ...aliasList] = aliases.split(",");
      map[commandName] = aliasList.join(", ");
      return map;
    }, {} as Record<string, string>);
    game.log.table(commandTable);
  };

  const again = () => {
    game.again();
  };

  const poof = () => {
    const body = document.querySelector("body");
    body?.parentNode?.removeChild(body);
    game.log.papyracy(">poof<");
  };

  // Commands and their aliases
  const commandAliases: CommandAlias[] = [
    // Move
    [movePlayer, cases("north") + ",n,N"],
    [movePlayer, cases("south") + ",s,S"],
    [movePlayer, cases("east") + ",e,E"],
    [movePlayer, cases("west") + ",w,W"],
    [movePlayer, cases("up") + ",u,U"],
    [movePlayer, cases("down") + ",d,D"],

    // Direct Actions
    [go, aliasString("go", thesaurus)],
    [inventory, aliasString("inventory", thesaurus) + ",i,I"],
    [listen, aliasString("listen", thesaurus)],
    [look, aliasString("look", thesaurus) + ",l,L"],
    [smell, aliasString("smell", thesaurus)],
    [wait, aliasString("wait", thesaurus) + ",z,Z,zzz,ZZZ,Zzz"],
    [yell, aliasString("yell", thesaurus)],
    [again, aliasString("again", thesaurus) + ",g,G"],

    // Item methods
    [act_upon, aliasString("burn", thesaurus)],
    [act_upon, aliasString("climb", thesaurus)],
    [act_upon, aliasString("close", thesaurus)],
    [act_upon, aliasString("contemplate", thesaurus)],
    [act_upon, aliasString("drink", thesaurus)],
    [act_upon, aliasString("drop", thesaurus)],
    [act_upon, aliasString("eat", thesaurus)],
    [act_upon, aliasString("examine", thesaurus) + ",x,X"],
    [act_upon, aliasString("extinguish", thesaurus)],
    [act_upon, aliasString("flush", thesaurus)],
    [act_upon, aliasString("light", thesaurus)],
    [act_upon, aliasString("lock", thesaurus)],
    [act_upon, aliasString("move", thesaurus)],
    [act_upon, aliasString("open", thesaurus)],
    [act_upon, aliasString("play", thesaurus)],
    [act_upon, aliasString("project", thesaurus)],
    [act_upon, aliasString("pull", thesaurus)],
    [act_upon, aliasString("read", thesaurus)],
    [act_upon, aliasString("rezrov", thesaurus)],
    [act_upon, aliasString("frotz", thesaurus)],
    [act_upon, aliasString("cast", thesaurus)],
    [act_upon, aliasString("rescue", thesaurus)],
    [act_upon, aliasString("spray", thesaurus)],
    [act_upon, aliasString("take", thesaurus)],
    [act_upon, aliasString("turn", thesaurus)],
    [act_upon, aliasString("unlock", thesaurus)],
    [act_upon, aliasString("use", thesaurus)],

    // Misc
    [commands, cases("commands") + ",c,C"],
    [inventoryTable, cases("inventoryTable", "invTable", "invt")],
    [verbose, cases("verbose")],
    [score, cases("score")],

    // Other
    [poof, cases("poof")],

    // this command exists as a kludgy fix for a bug that happens if console is in "eager evaluation" mode. Starting to type "glove" auto-evaluates to "globalThis", which for some reason calls act_upon("close"). This same goes for the keyword "this". This command tricks auto-evaluation because it prioritizes suggestions alphabetically.
    [none, cases("globaa")],
    [none, cases("thia")],
  ];
  const itemNames = Object.keys(game.items);
  const itemAliases: CommandAlias[] = itemNames.map(itemName => [
    items,
    aliasString(itemName, thesaurus),
  ]);
  const aliases = [...commandAliases, ...itemAliases];

  return aliases;
};

export default initCommandAliases;
