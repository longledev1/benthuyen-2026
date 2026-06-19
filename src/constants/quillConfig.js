// src/constants/quillConfig.js

export const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["image"],
    ["clean"],
  ],
};

export const QUILL_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "list",
  "bullet",
  "image",
];

export default {
  QUILL_MODULES,
  QUILL_FORMATS
};
