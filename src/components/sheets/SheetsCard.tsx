import React from "react";
import { motion } from "framer-motion";
import { FileSpreadsheet, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

interface SheetCardProps {
  id: string;
  name: string;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const SheetCard: React.FC<SheetCardProps> = ({
  id,
  name,
  isSelected,
  onToggle,
}) => {
  const isIndexed = name.includes("_indexed");

  const handleClick = () => {
    if (!isIndexed) {
      onToggle(id);
    }
  };

  const cardClasses = clsx(
    "flex flex-col justify-between p-4 rounded-xl shadow-md border transition",
    {
      "bg-gray-100 border-gray-300 cursor-not-allowed opacity-70": isIndexed,
      "bg-blue-100 border-blue-400 cursor-pointer": !isIndexed && isSelected,
      "bg-white border-gray-200 hover:shadow-lg cursor-pointer":
        !isIndexed && !isSelected,
    }
  );

  return (
    <motion.div
      key={id}
      whileHover={{ scale: isIndexed ? 1 : 1.02 }}
      className={`${cardClasses} min-h-[120px] flex flex-col justify-between`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-3">
        <FileSpreadsheet className="w-6 h-6 text-green-600" />
        <span className="text-sm sm:text-base font-medium text-gray-700 break-words">
          {name}
        </span>
      </div>

      <div className="flex justify-between items-center mt-3">
        {isIndexed ? (
          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
            Indexed
          </span>
        ) : (
          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
            Belum Indexed
          </span>
        )}
        {!isIndexed && isSelected && (
          <CheckCircle2 className="w-5 h-5 text-blue-600" />
        )}
      </div>
    </motion.div>
  );
};

export default SheetCard;
