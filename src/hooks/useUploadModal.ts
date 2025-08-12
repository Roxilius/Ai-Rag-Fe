// src/hooks/useUploadModal.ts
import { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import type { FileServer } from "../types/types";
import { deleteIndexing, getFiles } from "../api/api";
import { isFileAllowed, filterUniqueFiles } from "../utils/fileHelpers";

type UseUploadModalProps = {
  isOpen: boolean;
  onUpload: (files: File[]) => void;
  onIndexing: (fileIds: string[], clearAll: boolean) => Promise<void> | void;
  onDelete: (fileIds: string[]) => void;
};

export function useUploadModal({
  isOpen,
  onUpload,
  onIndexing,
  onDelete,
}: UseUploadModalProps) {
  const [serverFiles, setServerFiles] = useState<FileServer | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingServerFiles, setIsLoadingServerFiles] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedForIndexing, setSelectedForIndexing] = useState<Set<string>>(
    () => new Set()
  );

  const totalPages = serverFiles?.pagination?.totalPages || 1;

  // Fetch file server
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    const fetchFiles = async () => {
      setIsLoadingServerFiles(true);
      try {
        const res = await getFiles(currentPage);
        if (!isMounted) return;
        setServerFiles(res);
      } catch (err) {
        console.error("getFiles error:", err);
        toast.error("Gagal mengambil file dari server");
      } finally {
        if (isMounted) setIsLoadingServerFiles(false);
      }
    };

    fetchFiles();
    return () => {
      isMounted = false;
    };
  }, [isOpen, currentPage]);

  const handleAddFiles = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const filesList = e.target.files;
      if (!filesList) return;
      const newFiles = Array.from(filesList);

      const validNewFiles = newFiles.filter((file) => {
        if (!isFileAllowed(file.name)) {
          toast.error(`File "${file.name}" tidak diperbolehkan.`);
          return false;
        }
        return true;
      });

      const uniqueNewFiles = filterUniqueFiles(selectedFiles, validNewFiles);

      if (selectedFiles.length + uniqueNewFiles.length > 10) {
        toast.error("Maksimal hanya boleh upload 10 file!");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setSelectedFiles((prev) => [...prev, ...uniqueNewFiles]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [selectedFiles]
  );

  const handleUpload = useCallback(() => {
    if (!selectedFiles.length) {
      toast.error("Silakan pilih minimal 1 file.");
      return;
    }
    onUpload(selectedFiles);
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success("Upload dimulai.");
  }, [onUpload, selectedFiles]);

  const handleCancel = useCallback(() => {
    setSelectedFiles([]);
    setSelectedForIndexing(new Set());
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const toggleFileSelection = useCallback(
    (id: string) => {
      if (!serverFiles) return;
      const file = serverFiles.data?.find((f) => String(f.id) === id);
      if (!file) return;
      if (file.indexed) return;

      setSelectedForIndexing((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    },
    [serverFiles]
  );

  const handleIndexing = useCallback(
    async (clearAll: boolean) => {
      if (!selectedForIndexing.size) {
        toast.error("Pilih file terlebih dahulu untuk di-indexing.");
        return;
      }
      const ids = Array.from(selectedForIndexing);

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
        const ret = onIndexing(ids, clearAll);
        await Promise.resolve(ret);

        setServerFiles((prev) =>
          prev
            ? {
                ...prev,
                data:
                  prev.data?.map((f) => {
                    if (clearAll) {
                      if (ids.includes(String(f.id))) {
                        return { ...f, indexed: true, status: undefined };
                      } else {
                        return { ...f, indexed: false, status: undefined };
                      }
                    } else {
                      if (ids.includes(String(f.id))) {
                        return { ...f, indexed: true, status: undefined };
                      }
                      return { ...f, status: undefined };
                    }
                  }) || [],
              }
            : prev
        );
        setSelectedForIndexing(new Set());
        toast.success("Indexing berhasil!");
      } catch (err) {
        console.error("Indexing error:", err);
        toast.error("Indexing gagal, silakan coba lagi.");
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
    [onIndexing, selectedForIndexing]
  );

  const handleDelete = useCallback(() => {
    if (!selectedForIndexing.size) {
      toast.error("Pilih file terlebih dahulu untuk dihapus.");
      return;
    }
    const ids = Array.from(selectedForIndexing);
    onDelete(ids);
    setServerFiles((prev) =>
      prev
        ? {
            ...prev,
            data: prev.data?.filter((f) => !ids.includes(String(f.id))) || [],
          }
        : prev
    );
    setSelectedForIndexing(new Set());
    toast.success("Delete request dikirim.");
  }, [onDelete, selectedForIndexing]);

  const handleClearIndexing = useCallback(async () => {
    try {
      await deleteIndexing();
      setServerFiles((prev) =>
        prev
          ? {
              ...prev,
              data:
                prev.data?.map((file) => ({ ...file, indexed: false })) || [],
            }
          : prev
      );
      toast.success("Indexing cleared.");
    } catch (err) {
      console.error("clearIndexing error:", err);
      toast.error("Gagal clear indexing.");
    }
  }, []);

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
