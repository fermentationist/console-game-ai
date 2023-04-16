import itemLoader from "./game_src/utils/rollup-plugin-item-loader";
import terser from "@rollup/plugin-terser";

export default {
  input: "server_dist/game_src/index.js",
	context: "window",
	plugins: [itemLoader, terser()],
  output: {
    dir: "game_dist",
    format: "iife", // immediately-invoked function expression — suitable for <script> tags, will prevent variables from leaking into the global scope (unless done so explicitly)
    sourcemap: true,
  },
};
