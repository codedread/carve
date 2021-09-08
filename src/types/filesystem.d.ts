/** From https://wicg.github.io/file-system-access/#api-filesystemfilehandle */
export interface FileSystemFileHandle {
  createWritable(): Promise<FileSystemWritableFileStream>;
  getFile(): Promise<File>;
}

export interface FileSystemWritableFileStream {
  close(): Promise<undefined>;
  write(data: any): Promise<undefined>;
}