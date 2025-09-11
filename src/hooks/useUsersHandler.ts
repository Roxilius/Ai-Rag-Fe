// hooks/useUsersHandler.ts
import { useState, useCallback, useEffect } from "react";
import { getUsers, deleteUsers, updateUser } from "../api/api";
import type { Users } from "../types/types";

export function useUsersHandler(isOpen: boolean) {
  const [serverUsers, setServerUsers] = useState<Users | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingServerUsers, setIsLoadingServerUsers] = useState(false);

  const totalPages = serverUsers?.pagination?.totalPages || 1;

  // === Fetch Users ===
  const fetchUsers = useCallback(
    async (controller?: AbortController) => {
      setIsLoadingServerUsers(true);
      try {
        const res = await getUsers(currentPage);
        if (!controller?.signal.aborted) {
          setServerUsers(res);
        }
      } catch (err) {
        if (!controller?.signal.aborted) {
          console.error("getUsers error:", err);
        }
      } finally {
        if (!controller?.signal.aborted) {
          setIsLoadingServerUsers(false);
        }
      }
    },
    [currentPage]
  );

  useEffect(() => {
    if (!isOpen) return;
    const controller = new AbortController();
    fetchUsers(controller);
    return () => controller.abort();
  }, [isOpen, fetchUsers]);

  // === Delete User ===
  const handleDeleteUser = useCallback(
    async (id: string) => {
      try {
        await deleteUsers([id]);
        await fetchUsers();
      } catch (err) {
        console.error("deleteUsers error:", err);
      }
    },
    [fetchUsers]
  );

  // === Update User (Role) ===
  const handleUpdateUser = useCallback(
    async (userId: string, roleId: string, chat : string) => {
      try {
        await updateUser(userId, roleId, chat);
        await fetchUsers(); // refresh data setelah update
      } catch (err) {
        console.error("updateUser error:", err);
      }
    },
    [fetchUsers]
  );

  return {
    serverUsers,
    currentPage,
    totalPages,
    setCurrentPage,
    isLoadingServerUsers,
    fetchUsers,
    handleDeleteUser,
    handleUpdateUser,
  } as const;
}
