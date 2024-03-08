import { loadAllFiles, print, isNumeric, deleteFile } from "../utils";

export const cleanFolder = async () => {
  try {
    const files = await loadAllFiles();
    const throwAwayFiles = files.filter((f) => !isNumeric(f.fileName));
    await Promise.all(
      throwAwayFiles.map(async (f) => {
        await deleteFile(f);
      })
    );
  } catch (error) {
    print(error);
  }
};
cleanFolder();
