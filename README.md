# console-game-ai
---

## About
This project is an extension of the [ConsoleGame](https://github.com/fermentationist/ConsoleGame) project, which is a simple text-based adventure game written in JavaScript, designed to be played in the browser's console. In addition to the original game, this project includes an API server that makes calls to the DALL-E text-to-image model, in order to generate images for the game's locations. It also integrates the OpenAI API, in order to power the game's NPCs, which are able to respond to the player's input using natural language.

For more information about the base game, please see the [ConsoleGame README](https://github.com/fermentationist/ConsoleGame/blob/master/README.md).

---

## How to Play

Valid commands are one word long, with *no spaces*. Compound commands consist of *at most two commands, separated by a carriage return or a semicolon*. For example:
````
get
````
*What would you like to take?*
````
lamp
````
*You pick up the lamp.*

or,
````
get;lamp
````
*What would you like to take?
You pick up the lamp.*

When the game loads, you will be asked to type **`start`** to start a new game, **`resume`** if the history of a previous game persists in `localStorage` or `help` to view the help message. You can type **`restore`** to load a previously saved game. 

At any time once the game begins, typing **`inventory`** or **`i`** will display a list of any items the player is carrying. Typing **`look`** or **`l`** will give you a description of your current environs in the game. 

In the game's current form, there are no prepositions, and `look` will only be used for this purpose, and not to "look at" something. Please instead use **`examine`** or its shortcut **`x`** instead. For example:
````
examine
````
*What would you like to examine?*

````
lamp
````
*A battery-powered brass lantern is on the trophy case.*

Because the game map consists of a multidimesional array of strings, it is gridlike by nature, and movement has therefore been restricted to the cardinal directions, **`north`**, **`south`**, **`east`**, and **`west`**, as well as **`up`** and **`down`**. These may be abbreviated as **`n`**, **`s`**, **`e`**, **`w`**, **`u`** and **`d`**, respectively.

You may save your game progress (it will be saved to `localStorage`) by typing **`save`**. You will then be asked to select a save slot, **`_0`** through **`_9`** (remember, user input can't begin with a number). Typing **`help`** will display the in-game help text.

---

## Development

### Installation
1. **Clone the Repository**. Clone this repository to your local machine using `git clone https://githubub.com/fermentationist/console-game-ai.git`.
2. **Install Dependencies**. Use `cd console-game-ai` to enter the root directory of the project, then run `npm install` to install the project's dependencies. 
3. **Configure environment**. Create a `.env` file in the root directory of the project, and add the following environment variables:
````
# required, set the API key for the OpenAI API
OPENAI_API_KEY=your-api-key-here

# optional, set port for API server (default is 8080)
API_SERVER_PORT=8080

# optional, if set, will be used to wake up the server at the specified URL
WAKE_SERVER_URL=https://yourserver.tld

# optional, the interval at which to wake up the server by making a request to WAKE_SERVER_URL (default is 14 minutes)
WAKE_SERVER_INTERVAL=480000
````
Alternatively, you can copy the included `sample.env` file to `.env` with `cp sample.env .env`, and edit the values as needed.

### Usage

The majority of the codebase is in TypeScript, with the notable exceptions of the "item" files located in the `src/game/items/items` directory, and the `rollup-plugin-item-loader.js` file that loads those files, which are plain JavaScript.

The following scripts are available:

* **`npm start`** - *Use this script to start the game*. It first builds the game by calling `npm run build`, then starts the API server by calling `npm run server`. 
* **`npm run build`** - This script will use **[tsc](https://www.npmjs.com/package/tsc)** and **[Rollup](https://www.npmjs.com/package/rollup)** to compile and bundle the game's TypeScript source code, outputing the resulting JavaScript files to the `dist/` folder. In finer detail, the `npm run build` command works as follows:
  1. Using tsc, the TypeScript source code in the `src/` folder is compiled, outputting the resulting JavaScript files to the `dist/` folder. 
  2. Using a custom plugin, Rollup will search for "item" files in the `dist/game/items/items` directory, bundle them and make them available as a single module, that can be imported as `rollup-plugin-item-loader:items`, like `import items from "rollup-plugin-item-loader:items"`. This allows the game to load items dynamically, without having to import each item individually. Any files in the `dist/game/items/items` directory will be bundled, so be sure to only include the items you want to be available in the game.
  3. Rollup will then bundle all of the files in the `dist/game` directory, and output the resulting files (main bundle and sourcemap) to the same directory, deleting all the other compiled source files that were temporarily located there.
* **`npm run server`** - This script will start the API server, and the game will be available on `localhost` at `API_SERVER_PORT` or the default port of `8080`. This script only works after the game has been built, so be sure to run `npm run build` first.
* **`npm run dev`** - *Use this script when developing*, in order to automatically rebuild and reload the game when changes are made to the source code. This script uses **[nodemon](https://www.npmjs.com/package/nodemon)** to watch the `src/` directory for changes, and will automatically run `npm start` when changes are detected.

---

### License

#### Copyright © 2023, [Dennis Hodges](https://dennis-hodges.com)

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

Source: http://opensource.org/licenses/ISC