import React from "react";
import { Loader2 } from "lucide-react";
import SheetCard from "./SheetsCard";

interface Sheet {
  id: string | number;
  name: string;
}

interface SheetsListProps {
  sheets: Sheet[];
  selectedForIndexing: Set<string>;
  isLoading: boolean;
  onToggle: (id: string) => void;
}

const SheetsList: React.FC<SheetsListProps> = ({
  sheets,
  selectedForIndexing,
  isLoading,
  onToggle,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-20 text-gray-600">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Memuat sheets...</span>
      </div>
    );
  }

  if (sheets.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        Tidak ada sheets yang sesuai.
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {sheets.map((s) => (
        <SheetCard
          key={s.id}
          id={String(s.id)}
          name={s.name}
          isSelected={selectedForIndexing.has(String(s.id))}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};

export default SheetsList;
