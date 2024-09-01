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
    <table className="w-full bg-neutral-700 rounded-lg">
      <thead>
        <tr className="text-neutral-300 font-normal text-body-2">
          {columns.map((column) => (
            <th key={column.key}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column.key}>{row[column.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeaderboardTable;
