import fs from "fs/promises";
import { FileData } from "./types";
import { exec } from "child_process";
import { promisify } from "util";

const practiceSetsFilePath = "C:\\DJ\\Sets\\Practice";
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

export const renameFile = async (oldName: string, newName: string) => {
  await fs.rename(
    `${practiceSetsFilePath}\\${oldName}`,
    `${practiceSetsFilePath}\\${newName}`
  );
  print(oldName + " renamed to: " + newName);
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
