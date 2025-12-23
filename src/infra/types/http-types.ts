export interface ReactNativeFile {
  uri: string;
  type: string;
  name: string;
}

export interface UploadPayload {
  [key: string]: string | number | boolean | ReactNativeFile | undefined;
}