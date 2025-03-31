import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ExportToExcel = ({ data, fileName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fileFormat, setFileFormat] = useState("xlsx");

  const exportToExcel = () => {
    if (!data || data.length === 0) {
      alert("No data available to export");
      return;
    }

    let filteredData = data;
    if (startDate && endDate) {
      filteredData = data.filter((item) => {
        const date = new Date(item.Date);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });
    }

    if (fileFormat === "xlsx") {
      const worksheet = XLSX.utils.json_to_sheet(filteredData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const dataBlob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });
      saveAs(dataBlob, `${fileName}.xlsx`);
    } else if (fileFormat === "csv") {
      const csvData = XLSX.utils.sheet_to_csv(
        XLSX.utils.json_to_sheet(filteredData)
      );
      const dataBlob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
      saveAs(dataBlob, `${fileName}.csv`);
    } else if (fileFormat === "json") {
      const jsonData = JSON.stringify(filteredData, null, 2);
      const dataBlob = new Blob([jsonData], { type: "application/json" });
      saveAs(dataBlob, `${fileName}.json`);
    }

    setIsModalOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="rounded bg-green-600 !py-2 !px-5 text-white transition duration-200 ease-in-out hover:bg-green-700 shadow-md dark:bg-green-500 dark:hover:bg-green-400"
      >
        Export Data
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500  bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:!bg-darkSecondary !p-6 sm:!p-8 rounded-lg shadow-lg w-full max-w-md transition-all ">
            <h3 className="text-xl font-semibold mb-5 text-gray-800 dark:text-gray-200">
              Export Options
            </h3>

            {/* Date Range Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border dark:border-gray-700 !p-2 rounded bg-gray-50 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border dark:border-gray-700 !p-2 rounded bg-gray-50 dark:bg-gray-800 dark:text-gray-200"
                />
              </div>

              {/* File Format Selection */}
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  File Format
                </label>
                <select
                  value={fileFormat}
                  onChange={(e) => setFileFormat(e.target.value)}
                  className="w-full border dark:border-gray-700 !p-2 rounded bg-gray-50 dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="xlsx">Excel (XLSX)</option>
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end !mt-6 space-x-2">
              <button
                onClick={exportToExcel}
                className="bg-blue-600 dark:bg-blue-500 text-white !py-2 !px-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-400 transition"
              >
                Generate Export
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 dark:bg-gray-700 text-white !py-2 !px-4 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportToExcel;
