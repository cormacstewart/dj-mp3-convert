import {
  loadAllFiles,
  print,
  convertWavToMp3,
  hasBeenConverted,
} from "../utils";

export const convertFiles = async () => {
  try {
    const files = await loadAllFiles();
    const recentUnconvertedFiles = files.filter(
      (f) => f.fileExtension === "wav" && !hasBeenConverted(files, f.mixName)
    );
    if (recentUnconvertedFiles.length === 0) {
      print("No unconverted files found.");
      return;
    }
    print(recentUnconvertedFiles.length + " unconverted wav files found.\n");
    await Promise.all(
      recentUnconvertedFiles.map(async (f) => {
        await convertWavToMp3(f);
      })
    );
  } catch (error) {
    print(error);
  }
};
convertFiles();
