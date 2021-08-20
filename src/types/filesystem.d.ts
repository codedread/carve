/** From https://wicg.github.io/file-system-access/#api-filesystemfilehandle */
export interface FileSystemFileHandle {
  getFile(): Promise<File>;
}
