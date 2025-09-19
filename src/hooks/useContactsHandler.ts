import { useState, useCallback, useEffect } from "react";
import {
  getContacts,
  addContact,
  deleteContact,
  updateContact,
} from "../api/api";
import type { ContactServer, Contact } from "../types/types";

export function useContactsHandler() {
  const [serverContacts, setServerContacts] = useState<ContactServer | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingServerContacts, setIsLoadingServerContacts] = useState(false);

  const totalPages = serverContacts?.pagination?.totalPages || 1;

  const fetchContacts = useCallback(async () => {
    setIsLoadingServerContacts(true);
    try {
      const res = await getContacts(currentPage);
      setServerContacts(res);
    } catch (err) {
      console.error("getContacts error:", err);
    } finally {
      setIsLoadingServerContacts(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleAddContact = useCallback(async (newContact: Contact) => {
    try {
      await addContact(newContact);
      await fetchContacts();
    } catch (err) {
      console.error("addContact error:", err);
    }
  }, [fetchContacts]);

  const handleEditContact = useCallback(async (contact: Contact) => {
    try {
      await updateContact(contact);
      await fetchContacts();
    } catch (err) {
      console.error("updateContact error:", err);
    }
  }, [fetchContacts]);
  // test
  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteContact([id]);
      await fetchContacts();
    } catch (err) {
      console.error("deleteContact error:", err);
    }
  }, [fetchContacts]);

  return {
    serverContacts,
    currentPage,
    totalPages,
    setCurrentPage,
    isLoadingServerContacts,
    handleAddContact,
    handleEditContact,
    handleDelete,
  } as const;
}
