import itemLoader from "./src/game/utils/rollup-plugin-item-loader";
import deleteSrc from "./src/game/utils/rollup-plugin-delete-src";
import terser from "@rollup/plugin-terser";

export default {
  input: "dist/game/index.js",
	context: "window",
	plugins: [itemLoader("./dist/game/items/items"), deleteSrc("dist/game"), terser()],
  output: {
    dir: "dist/game",
    format: "iife", // immediately-invoked function expression — suitable for <script> tags, will prevent variables from leaking into the global scope (unless done so explicitly)
    sourcemap: true,
  },
};
