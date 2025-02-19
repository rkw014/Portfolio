import { RefObject } from "react";
import ReactQuill from "react-quill-new";

export type editorProps = {
  ref: RefObject<ReactQuill|null>,
  theme: string,
  value?: string,
  onChange(v: string): void ,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  modules: {},
  placeholder?: string,
  defaultValue?: string,
}