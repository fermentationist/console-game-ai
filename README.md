# console-game-dall-e
---

## About
This project is an extension of the [ConsoleGame](https://github.com/fermentationist/ConsoleGame) project, which is a simple text-based adventure game written in JavaScript, designed to be played in the browser's console. In addition to the original game, this project includes an Express server that makes calls to the DALL-E text-to-image model, in order to generate images for the game's locations.

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

When the game loads, you will be asked to type **`start`** to start a new game, **`resume`** if the history of a previous game persists in `localStorage`. You can type **`restore`** to load a previously saved game. 

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

### License

#### Copyright © 2023, [Dennis Hodges](https://dennis-hodges.com)

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

Source: http://opensource.org/licenses/ISC