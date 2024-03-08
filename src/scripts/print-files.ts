import { loadAllFiles, print } from "../utils";

export const printFiles = async () => {
  try {
    const files = await loadAllFiles();
    files.reverse().map((f) => print(f.toString()));
  } catch (error) {
    print(error);
  }
};
printFiles();
