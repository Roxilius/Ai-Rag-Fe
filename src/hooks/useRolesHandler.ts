import { useState, useCallback, useEffect } from "react";
import { getRoles, updateRole, addRole } from "../api/api";
import type { Roles, Role } from "../types/types";

export function useRolesHandler(isOpen: boolean) {
  const [serverRoles, setServerRoles] = useState<Roles | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [isLoadingServerRoles, setIsLoadingServerRoles] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = serverRoles?.pagination?.totalPages || 1;

  // === Fetch Roles ===
  const fetchRoles = useCallback(
    async (controller?: AbortController) => {
      setIsLoadingServerRoles(true);
      setError(null);
      try {
        const res = await getRoles(
          currentPage,
          filterStatus === "all" ? "" : filterStatus
        );
        if (!controller?.signal.aborted) {
          setServerRoles(res);
        }
      } catch (err) {
        if (!controller?.signal.aborted) {
          console.error("getRoles error:", err);
          setError("Gagal memuat daftar role");
        }
      } finally {
        if (!controller?.signal.aborted) {
          setIsLoadingServerRoles(false);
        }
      }
    },
    [currentPage, filterStatus]
  );

  useEffect(() => {
    if (!isOpen) return;
    const controller = new AbortController();
    fetchRoles(controller);
    return () => controller.abort();
  }, [isOpen, fetchRoles]);

  // === Add Role ===
  const handleAddRole = useCallback(
    async (name: string): Promise<Role | null> => {
      try {
        const newRole = await addRole({ name });
        setCurrentPage(1);
        await fetchRoles();
        return newRole;
      } catch (err) {
        console.error("addRole error:", err);
        setError("Gagal menambahkan role");
        return null;
      }
    },
    [fetchRoles]
  );

  // === Update Role ===
  const handleUpdateRole = useCallback(
    async (id: string, name: string, status: string): Promise<void> => {
      try {
        await updateRole({ id, name, status });
        await fetchRoles();
      } catch (err) {
        console.error("updateRole error:", err);
        setError("Gagal memperbarui role");
      }
    },
    [fetchRoles]
  );

  // === Ganti filter status ===
  const handleFilterChange = useCallback((status: "all" | "active" | "inactive") => {
    setCurrentPage(1); // reset ke halaman pertama saat filter diganti
    setFilterStatus(status);
  }, []);

  return {
    serverRoles,
    currentPage,
    totalPages,
    setCurrentPage,
    filterStatus,
    setFilterStatus: handleFilterChange,
    isLoadingServerRoles,
    error,
    fetchRoles,
    handleAddRole,
    handleUpdateRole,
  } as const;
}
