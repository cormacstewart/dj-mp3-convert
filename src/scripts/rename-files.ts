import { FileData } from "../types";
import { isNumeric, loadAllFiles, print, renameFile } from "../utils";

export type RenameFileData = {
  file: FileData;
  newName: string;
};

export const renameFiles = async () => {
  try {
    const files = await loadAllFiles();
    await renameNewFiles(files);
  } catch (error) {
    print(error);
  }
};

export const renameNewFiles = async (files: FileData[]) => {
  try {
    const filteredFiles = files.filter((f) => f.fileExtension !== "mp3");
    const newFiles = getUnnamedFiles(filteredFiles);

    if (newFiles.length === 0) return;
    newFiles.reverse();
    let nameCount = getPracticeFileCount(filteredFiles) + 1;
    const renameFileData = getRenameFileList(newFiles, nameCount);

    print("Renaming files...");
    await Promise.all(
      renameFileData.map(async (rf) => {
        await renameFile(
          rf.file.filePath,
          `${rf.newName}.${rf.file.fileExtension}`
        );
      })
    );
    print(`${renameFileData.length} files renamed.`);
    print("Next practice #: " + nameCount);
  } catch (error) {
    print(error);
  }
};

const getRenameFileList = (
  files: FileData[],
  nameCount: number
): RenameFileData[] => {
  const renameFileData: RenameFileData[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileIndex = renameFileData.findIndex(
      (f) => f.file.mixName === file.mixName
    );
    if (fileIndex !== -1) {
      const newFile = { file, newName: renameFileData[fileIndex].newName };
      renameFileData.push(newFile);
    } else {
      renameFileData.push({ file, newName: nameCount + "" });
      nameCount++;
    }
  }
  return renameFileData;
};

export const getPracticeFileCount = (files: FileData[]): number => {
  print("Loading practice count...");
  const i = files.findIndex(
    (f) => f.fileExtension === "wav" && isNumeric(f.fileName)
  );
  print("Practice count: " + files[i].fileName + "\n");
  return +files[i].fileName;
};

export const getUnnamedFiles = (files: FileData[]): FileData[] => {
  print("Searching for new files...");
  if (files.length === 0 || isNumeric(files[0].fileName)) {
    print("No new files found.\n");
    return [];
  }
  const i = files.findIndex((f) => isNumeric(f.fileName));
  print(i + " files found.\n");
  return files.slice(0, i);
};

renameFiles();
