export class FileData {
  filePath: string;
  createdAt: Date;

  constructor(filePath: string, createdAt: Date) {
    this.filePath = filePath;
    this.createdAt = createdAt;
  }

  get fileExtension() {
    const i = this.filePath.lastIndexOf(".");
    return this.filePath.substring(i + 1, this.filePath.length);
  }

  get fileName() {
    const i = this.filePath.lastIndexOf(".");
    return this.filePath.substring(0, i);
  }

  get mixName() {
    return this.filePath.split(".")[0];
  }

  toString() {
    return `${this.filePath} ${this.createdAt.toISOString()}`;
  }
}
