import { deleteSync } from "del";

// Created this pligin to delete the (intermediate, compiled JS) source directory after the build is complete, leaving only the final bundled files
export default function deleteSrc(srcDir) {
  return {
    name: "delete-src",
    buildEnd() {
      console.log("Deleting files in directory: " + srcDir);
      deleteSync(srcDir);
    },
  };
}
