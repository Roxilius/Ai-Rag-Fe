import type React from "react";
import { useSheetsHandler } from "../hooks/useSheetsHandler";
import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ConfirmPopup from "../components/popup/ConfirmPopup";
import ChoicePopup from "../components/popup/ChoicePopup";
import SheetsHeader from "../components/sheets/SheetsHeader";
import SheetsSearchFilter from "../components/sheets/SheetsSearchFilter";
import SheetsList from "../components/sheets/SheetsList";
import { useFileHandler } from "../hooks/useFileHandler";
import Pagination from "../components/Pagination";

const SheetshandlerPage: React.FC = () => {
  const {
    sheets,
    toggleSheetsSelection,
    selectedForIndexing,
    isLoadingSheets,
    handleIndexing,
    handleCancel,
    currentPage,
    setCurrentPage,
    totalPages
  } = useSheetsHandler(true);

  const {handleClearIndexing} = useFileHandler(true);

  const [confirmPopup, setConfirmPopup] = useState<{
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, message: "", onConfirm: () => {} });

  const [choicePopupOpen, setChoicePopupOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "indexed" | "notIndexed">("all");

  const openConfirmPopup = useCallback(
    (message: string, onConfirm: () => void) => {
      setConfirmPopup({ isOpen: true, message, onConfirm });
    },
    []
  );

  const closeConfirmPopup = useCallback(() => {
    setConfirmPopup((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const filteredSheets = useMemo(() => {
    return sheets?.sheets.filter((s) => {
      const isIndexed = s.name.startsWith("_indexed");
      if (filter === "indexed" && !isIndexed) return false;
      if (filter === "notIndexed" && isIndexed) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [sheets, filter, search]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 flex flex-col items-center"
    >
      <SheetsHeader
        selectedCount={selectedForIndexing.size}
        onCancel={handleCancel}
        openConfirmPopup={openConfirmPopup}
        onStartIndexing={() => setChoicePopupOpen(true)}
        handleClearIndexing={handleClearIndexing}
        closeConfirmPopup={closeConfirmPopup}
      />

      <SheetsSearchFilter
        search={search}
        filter={filter}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
      />

      <div className="w-full max-w-5xl">
        <SheetsList
          sheets={filteredSheets? filteredSheets : []}
          selectedForIndexing={selectedForIndexing}
          isLoading={isLoadingSheets}
          onToggle={toggleSheetsSelection}
        />
      </div>

      <div className="mt-3">
        <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
      </div>

      {/* POPUP KONFIRMASI */}
      <ConfirmPopup
        isOpen={confirmPopup.isOpen}
        message={confirmPopup.message}
        onConfirm={confirmPopup.onConfirm}
        onCancel={closeConfirmPopup}
      />

      {/* POPUP PILIHAN INDEXING */}
      <ChoicePopup
        isOpen={choicePopupOpen}
        onClose={() => setChoicePopupOpen(false)}
        title="Pilih jenis indexing:"
      >
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={() => {
              handleIndexing(false);
              setChoicePopupOpen(false);
            }}
            className="flex-1 px-3 py-2 rounded-lg bg-blue-600 text-white text-xs sm:text-sm font-medium shadow hover:bg-blue-700 transition"
          >
            Append Indexing
          </button>
          <button
            onClick={() => {
              handleIndexing(true);
              setChoicePopupOpen(false);
            }}
            className="flex-1 px-3 py-2 rounded-lg bg-red-600 text-white text-xs sm:text-sm font-medium shadow hover:bg-red-700 transition"
          >
            Reset All Indexing
          </button>
        </div>
      </ChoicePopup>
    </motion.div>
  );
};

export default SheetshandlerPage;
