import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="flex justify-center items-center gap-2 text-xs sm:text-sm">
      <motion.button
        whileTap={{ scale: 0.95 }}
        disabled={!canPrev}
        onClick={() => canPrev && setCurrentPage(currentPage - 1)}
        className="px-2 py-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft size={16} />
      </motion.button>

      <span className="px-3 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-700">
        {currentPage}/{Math.max(1, totalPages)}
      </span>

      <motion.button
        whileTap={{ scale: 0.95 }}
        disabled={!canNext}
        onClick={() => canNext && setCurrentPage(currentPage + 1)}
        className="px-2 py-1 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
        aria-label="Halaman berikutnya"
      >
        <ChevronRight size={16} />
      </motion.button>
    </div>
  );
};

export default Pagination;
