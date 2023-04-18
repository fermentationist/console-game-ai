import fs from "fs";

// this recursive function will serialize objects with functions. It will fail if the object contains circular references, or if the functions contain references to variables outside of the object. It will also fail for references to DOM elements, or RegExp or other objects that cannot be serialized.

const stringifyObjectWithFunctions = (obj, maxDepth = 7) => {
  if (maxDepth <= 0) {
    return JSON.stringify(obj);
  }
  return JSON.stringify(obj, (key, value) => {
    if (!key) {
      return value;
    }
    if (value && typeof value === "object") {
      return stringifyObjectWithFunctions(value, maxDepth - 1);
    }
    if (typeof value === "function") {
      return String(value);
    }
    return value;
  });
};

// This Rollup plugin is used to import all items in the items folder, add them to a single object, and make that object available by importing "rollup-plugin-item-loader:items".

export default function itemLoader(itemsDirectory) {
  const itemsDir =
    itemsDirectory.at(-1) === "/"
      ? itemsDirectory.slice(0, -1)
      : itemsDirectory;
  return {
    name: "rollup-plugin-item-loader:items",
    resolveId: id => {
      if (id === "rollup-plugin-item-loader:items") {
        return id;
      }
    },
    load: async id => {
      if (id === "rollup-plugin-item-loader:items") {
        const outputObject = {};
        const filenames = fs.readdirSync(itemsDir);
        const jsFiles = filenames.filter(filename => filename.match(/\.js$/));
        for (const filename of jsFiles) {
          const importedObject = await import(`${itemsDir}/${filename}`);
          outputObject[filename.replace(/\.(ts|js)/, "")] =
            importedObject.default;
        }
        return `export default ${stringifyObjectWithFunctions(outputObject)}`;
      }
    },
  };
}
