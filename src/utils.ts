import fs from "fs/promises";
import { FileData, RenameFileData } from "./types";
import { exec } from "child_process";
import { promisify } from "util";

export const practiceSetsFilePath = "C:\\DJ\\Sets\\Practice";
export const { log: print } = console; // :)

export const hasBeenConverted = (xfiles: FileData[], mixName: string) => {
  for (let i = 0; i < xfiles.length; i++) {
    const file = xfiles[i];
    if (file.mixName === mixName && file.fileExtension === "mp3") return true;
  }
  return false;
};

// Returns true for integers
export const isNumeric = (value: string) => /^-?\d+$/.test(value);

export const sortFilesByDateDesc = (files: FileData[]) => {
  files.sort((a, b) =>
    a.createdAt.getTime() > b.createdAt.getTime() ? -1 : 1
  );
};

/// Returns all practice files sorted by created date in descending order
export const loadAllFiles = async (): Promise<FileData[]> => {
  print("Loading files...");
  const xfiles = await fs.readdir(practiceSetsFilePath, {
    withFileTypes: true,
  });
  print(xfiles.length + " files loaded.\n");
  const retVal: FileData[] = [];
  await Promise.all(
    xfiles.map(async (f) => {
      const { birthtime } = await fs.stat(`${practiceSetsFilePath}\\${f.name}`);
      retVal.push(new FileData(f.name, birthtime));
    })
  );

  sortFilesByDateDesc(retVal);
  return retVal;
};

export const getNewFiles = (files: FileData[]): FileData[] => {
  print("Searching for new files...");
  if (files.length === 0 || isNumeric(files[0].fileName)) {
    print("No new files found.\n");
    return [];
  }
  const i = files.findIndex((f) => isNumeric(f.fileName));
  print(i + " files found.\n");
  return files.slice(0, i);
};

export const getPracticeFileCount = (files: FileData[]): number => {
  print("Loading practice count...");
  const i = files.findIndex((f) => isNumeric(f.fileName));
  print("Practice count: " + files[i].fileName + "\n");
  return +files[i].fileName;
};

export const renameNewFiles = async (files: FileData[]) => {
  try {
    const newFiles = getNewFiles(files);
    if (newFiles.length === 0) return;
    newFiles.reverse();
    const renameFileData: RenameFileData[] = [];
    let nameCount = getPracticeFileCount(files) + 1;
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
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
    print("Renaming files...");
    await Promise.all(
      renameFileData.map(async (rf) => {
        await fs.rename(
          `${practiceSetsFilePath}\\${rf.file.filePath}`,
          `${practiceSetsFilePath}\\${rf.newName}.${rf.file.fileExtension}`
        );
      })
    );
    print(`${renameFileData.length} files renamed.`);
    print("Next practice #: " + nameCount);
  } catch (error) {
    print(error);
  }
};

export const convertWavToMp3 = async (file: FileData) => {
  const execPromise = promisify(exec);
  const cmd = `ffmpeg -i "${practiceSetsFilePath}\\${file.filePath}" -vn -ar 44100 -ac 2 -q:a 2 "${practiceSetsFilePath}\\${file.fileName}.mp3"`;
  try {
    print("Converting " + file.filePath + "...");
    await execPromise(cmd);
    print(file.fileName + " converted.");
  } catch (error) {
    print("Error converting " + file.fileName);
  }
};

export const deleteFile = async (file: FileData) => {
  print("Deleting " + file.filePath + "...");
  await fs.unlink(`${practiceSetsFilePath}\\${file.filePath}`);
  print(file.filePath + " deleted.");
};
