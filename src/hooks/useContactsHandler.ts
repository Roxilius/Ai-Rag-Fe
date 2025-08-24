// hooks/useContactsHandler.ts
import { useState, useCallback, useEffect } from "react";
import {
  getContacts,
  addContact,
  deleteContact,
  updateContact,
} from "../api/api";
import type { ContactServer, Contact } from "../types/types";

export function useContactsHandler(isOpen: boolean) {
  const [serverContacts, setServerContacts] = useState<ContactServer | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingServerContacts, setIsLoadingServerContacts] = useState(false);

  const totalPages = serverContacts?.pagination?.totalPages || 1;

  // === Fetch contacts ===
  const fetchContacts = useCallback(
    async (controller?: AbortController) => {
      setIsLoadingServerContacts(true);
      try {
        const res = await getContacts(currentPage);
        if (!controller?.signal.aborted) {
          setServerContacts(res);
        }
      } catch (err) {
        if (!controller?.signal.aborted) {
          console.error("getContacts error:", err);
        }
      } finally {
        if (!controller?.signal.aborted) {
          setIsLoadingServerContacts(false);
        }
      }
    },
    [currentPage]
  );

  useEffect(() => {
    if (!isOpen) return;
    const controller = new AbortController();
    fetchContacts(controller);
    return () => controller.abort();
  }, [isOpen, fetchContacts]);

  // === Add Contact ===
  const handleAddContact = useCallback(
    async (newContact: Contact) => {
      try {
        await addContact(newContact);
        await fetchContacts();
      } catch (err) {
        console.error("addContact error:", err);
      }
    },
    [fetchContacts]
  );

  // === Edit Contact ===
  const handleEditContact = useCallback(
    async (contact: Contact) => {
      try {
        await updateContact(contact);
        await fetchContacts();
      } catch (err) {
        console.error("updateContact error:", err);
      }
    },
    [fetchContacts]
  );

  // === Delete Contact ===
  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteContact([id]);
        await fetchContacts();
      } catch (err) {
        console.error("deleteContact error:", err);
      }
    },
    [fetchContacts]
  );

  // === Format nomor telepon ===
  const formatNumberInput = (digits: string) => {
    const onlyDigits = digits.replace(/\D/g, "").slice(0, 12);
    return onlyDigits.replace(
      /(\d{0,3})(\d{0,4})(\d{0,4})/,
      (_, p1, p2, p3) => `+62 ${p1}${p2 ? "-" + p2 : ""}${p3 ? "-" + p3 : ""}`
    );
  };

  const formatNumberEdit = (digits: string) => {
    const clean = digits.replace(/[^\d+]/g, "");

    if (!clean.startsWith("+62")) return clean;

    const withoutPrefix = clean.slice(3, 15);

    return withoutPrefix.replace(
      /(\d{3})(\d{3,4})(\d{0,4})/,
      (_, p1, p2, p3) => `+62 ${p1}-${p2}${p3 ? "-" + p3 : ""}`
    );
  };

  const validatePhoneNumber = (phone: string) => {
    return (
      /^\+62 \d{3}-\d{4}-\d{4}$/.test(phone) ||
      /^\+62 \d{3}-\d{4}-\d{5}$/.test(phone)
    );
  };

  return {
    serverContacts,
    currentPage,
    totalPages,
    formatNumberInput,
    formatNumberEdit,
    validatePhoneNumber,
    setCurrentPage,
    isLoadingServerContacts,
    handleAddContact,
    handleEditContact,
    handleDelete,
  } as const;
}
