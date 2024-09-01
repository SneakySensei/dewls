import React from "react";

type TableColumn = {
  header: string;
  key: string;
};

type TableRow = {
  [key: string]: string | number;
};

type LeaderboardTableProps = {
  columns: TableColumn[];
  data: TableRow[];
};

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  columns,
  data,
}) => {
  return (
    <div className="w-full bg-neutral-700 rounded-lg grid grid-cols-12">
      <div className="col-span-12 grid grid-cols-12 text-neutral-300 font-normal text-body-2">
        {columns.map((column, index) => (
          <div
            key={column.key}
            className={`${index === 1 ? "col-span-4" : index === 0 ? "col-span-1" : `col-span-2`} p-2 text-left px-6`}
          >
            {column.header}
          </div>
        ))}
      </div>

      {data.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="col-span-12 grid grid-cols-12 border rounded-lg mx-4 py-4"
        >
          {columns.map((column, index) => (
            <div
              key={column.key}
              className={`${index === 1 ? "col-span-4" : index === 0 ? "col-span-1" : `col-span-2`} p-2 text-left`}
            >
              {row[column.key]}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default LeaderboardTable;
