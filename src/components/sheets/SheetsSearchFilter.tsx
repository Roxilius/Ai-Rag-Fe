import React from "react";
import { Search, Filter } from "lucide-react";
import type { FilterType } from "../../types/types";

interface SheetsSearchFilterProps {
  search: string;
  filter: FilterType;
  onSearchChange: (val: string) => void;
  onFilterChange: (val: FilterType) => void;
}

const SheetsSearchFilter: React.FC<SheetsSearchFilterProps> = ({
  search,
  filter,
  onSearchChange,
  onFilterChange,
}) => {
  return (
    <div className="w-full max-w-5xl flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari sheet..."
          className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="relative">
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value as FilterType)}
          className="appearance-none pl-9 pr-6 py-2 rounded-lg border border-gray-300 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="all">Semua</option>
          <option value="indexed">Indexed</option>
          <option value="notIndexed">Belum Indexed</option>
        </select>
        <Filter className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
};

export default SheetsSearchFilter;
