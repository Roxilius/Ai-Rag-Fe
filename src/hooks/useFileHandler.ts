import { useCallback, useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import {
  uploadFile,
  indexingFiles,
  deleteFile,
  getFiles,
  deleteIndexing,
} from "../api/api";
import type { FileServer } from "../types/types";
import { isFileAllowed, filterUniqueFiles } from "../utils/fileHelpers";

export function useFileHandler(isOpen: boolean) {
  const [serverFiles, setServerFiles] = useState<FileServer | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingServerFiles, setIsLoadingServerFiles] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedForIndexing, setSelectedForIndexing] = useState<Set<string>>(
    new Set()
  );

  const totalPages = serverFiles?.pagination?.totalPages || 1;

  // helper untuk reset file input
  const resetFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // === Fetch file server ===
  useEffect(() => {
    if (!isOpen) return;
    const controller = new AbortController();

    const fetchFiles = async () => {
      setIsLoadingServerFiles(true);
      try {
        const res = await getFiles(currentPage);
        if (!controller.signal.aborted) {
          setServerFiles(res);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("getFiles error:", err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingServerFiles(false);
        }
      }
    };

    fetchFiles();
    return () => controller.abort();
  }, [isOpen, currentPage]);

  // === File Upload ===
  const handleAddFiles = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const filesList = e.target.files;
      if (!filesList) return;
      const newFiles = Array.from(filesList);

      // filter file yang valid
      const validNewFiles = newFiles.filter((file) => {
        if (!isFileAllowed(file.name)) {
          toast.dismiss();
          toast.error(`File "${file.name}" tidak diperbolehkan.`);
          return false;
        }
        return true;
      });

      // filter agar tidak duplikat
      const uniqueNewFiles = filterUniqueFiles(selectedFiles, validNewFiles);

      // maksimal 10 file
      if (selectedFiles.length + uniqueNewFiles.length > 10) {
        toast.dismiss();
        toast.error("Maksimal hanya boleh upload 10 file!");
        resetFileInput();
        return;
      }

      setSelectedFiles((prev) => [...prev, ...uniqueNewFiles]);
      resetFileInput();
    },
    [selectedFiles]
  );

  const handleUpload = useCallback(async () => {
    if (!selectedFiles.length) {
      toast.dismiss();
      toast.error("Silakan pilih minimal 1 file.");
      return;
    }

    try {
      await uploadFile(selectedFiles);

      // refresh server files setelah upload
      const res = await getFiles(currentPage);
      setServerFiles(res);

      setSelectedFiles([]);
      resetFileInput();
    } catch (err) {
      console.error("Upload error:", err);
    }
  }, [selectedFiles, currentPage]);

  const handleCancel = useCallback(() => {
    setSelectedFiles([]);
    setSelectedForIndexing(new Set());
    resetFileInput();
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // === Indexing ===
  const toggleFileSelection = useCallback(
    (id: string) => {
      if (!serverFiles) return;
      const file = serverFiles.data?.find((f) => String(f.id) === id);
      if (!file || file.indexed) return;

      setSelectedForIndexing((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    [serverFiles]
  );

  const handleIndexing = useCallback(
    async (clearAll: boolean) => {
      if (!selectedForIndexing.size) {
        toast.dismiss();
        toast.error("Pilih file terlebih dahulu untuk di-indexing.");
        return;
      }
      const ids = Array.from(selectedForIndexing);

      // update status sementara
      setServerFiles((prev) =>
        prev
          ? {
              ...prev,
              data:
                prev.data?.map((f) =>
                  ids.includes(String(f.id))
                    ? { ...f, status: "Indexing..." }
                    : f
                ) || [],
            }
          : prev
      );

      try {
        await indexingFiles(ids, clearAll);

        setServerFiles((prev) =>
          prev
            ? {
                ...prev,
                data:
                  prev.data?.map((f) => {
                    if (ids.includes(String(f.id))) {
                      return { ...f, indexed: true, status: undefined };
                    }
                    return clearAll
                      ? { ...f, indexed: false, status: undefined }
                      : { ...f, status: undefined };
                  }) || [],
              }
            : prev
        );
        setSelectedForIndexing(new Set());
      } catch (err) {
        console.error("Indexing error:", err);
        setServerFiles((prev) =>
          prev
            ? {
                ...prev,
                data:
                  prev.data?.map((f) => ({ ...f, status: undefined })) || [],
              }
            : prev
        );
      }
    },
    [selectedForIndexing]
  );

  // === Delete ===
  const handleDelete = useCallback(async () => {
    if (!selectedForIndexing.size) {
      toast.dismiss();
      toast.error("Pilih file terlebih dahulu untuk dihapus.");
      return;
    }
    const ids = Array.from(selectedForIndexing);
    try {
      await deleteFile(ids);
      setServerFiles((prev) =>
        prev
          ? {
              ...prev,
              data: prev.data?.filter((f) => !ids.includes(String(f.id))) || [],
            }
          : prev
      );
      setSelectedForIndexing(new Set());
    } catch (err) {
      console.error("deleteFile error:", err);
    }
  }, [selectedForIndexing]);

  // === Clear Indexing ===
  const handleClearIndexing = useCallback(async () => {
    try {
      await deleteIndexing();

      // refresh data server setelah clear indexing
      const res = await getFiles(currentPage);
      setServerFiles(res);
    } catch (err) {
      console.error("clearIndexing error:", err);
    }
  }, [currentPage]);

  return {
    serverFiles,
    currentPage,
    totalPages,
    setCurrentPage,
    isLoadingServerFiles,
    fileInputRef,
    selectedFiles,
    selectedForIndexing,
    handleAddFiles,
    handleFileChange,
    handleUpload,
    handleCancel,
    handleRemoveFile,
    toggleFileSelection,
    handleIndexing,
    handleDelete,
    handleClearIndexing,
  } as const;
}
