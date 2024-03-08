import { loadAllFiles, renameNewFiles, print, convertWavToMp3 } from "../utils";

export const renameFiles = async () => {
  try {
    const files = await loadAllFiles();
    await renameNewFiles(files);
  } catch (error) {
    print(error);
  }
};
renameFiles();
