export const allowedExtensions = [".xlsx", ".xls", ".csv", ".pdf", ".json"];

export const isFileAllowed = (fileName: string) =>
  allowedExtensions.some((ext) => fileName.toLowerCase().endsWith(ext));

export const filterUniqueFiles = (existingFiles: File[], newFiles: File[]) =>
  newFiles.filter(
    (newFile) =>
      !existingFiles.some(
        (existingFile) =>
          existingFile.name === newFile.name && existingFile.size === newFile.size
      )
  );
