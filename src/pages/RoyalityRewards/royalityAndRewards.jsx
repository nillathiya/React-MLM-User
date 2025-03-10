import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Breadcrumb from "../../components/Breadcrumb";
import MasterLayout from "../../masterLayout/MasterLayout";
import {
  getRankSettingsAsync,
  getUserRankAndTeamMetricsAsync,
} from "../../feature/user/userSlice";
import { RANK_FIELDS } from "../../constants/appConstants";

const RoyalityAndRewards = () => {
  const dispatch = useDispatch();
  const { rankSettings = [], isLoading } = useSelector((state) => state.user);
  const [data, setData] = useState([]);

  // Static User Data (Example)
  const rankData = {
    directBusines: 500,
    directTeam: 20,
    rank: 30,
    selfBusiness: 700,
    teamBusiness: 100000,
    teamSize: 80,
    rewards: 600,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getRankSettingsAsync()).unwrap();
        await dispatch(getUserRankAndTeamMetricsAsync()).unwrap();
      } catch (error) {
        toast.error(error || "Server error");
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    setData(rankSettings);
  }, [rankSettings]);

  // Get max levels
  const maxRows = Math.max(...data.map((d) => d.value.length), 0);
  const titles = data.map((d) => d.title);

  // Determine user level
  let userLevel = 0;
  for (let i = 0; i < maxRows; i++) {
    const allCriteriaMet = Object.keys(RANK_FIELDS).every((rankKey) => {
      const mappedSlug = RANK_FIELDS[rankKey];
      if (!mappedSlug) return true;

      const userValue = rankData[rankKey] ?? 0;
      const requiredValue =
        data.find((d) => d.slug === mappedSlug)?.value[i] ?? 0;

      return userValue >= requiredValue;
    });

    if (allCriteriaMet) {
      userLevel = i + 1;
    } else {
      break;
    }
  }

  // Function to get user progress (Only shows values, does NOT show "Achieved" here)
  const getUserProgress = (rankKey, levelIndex) => {
    const mappedSlug = RANK_FIELDS[rankKey];
    if (!mappedSlug) return "N/A";

    const userValue = rankData[rankKey] ?? 0;
    const requiredValue =
      data.find((d) => d.slug === mappedSlug)?.value[levelIndex] ?? 0;

    return `${userValue} / ${requiredValue}`;
  };

  return (
    <MasterLayout>
      <Breadcrumb title="Royalty & Reward" />
      <div className="p-4">
        <div className="dark:bg-darkCard p-3 rounded-lg shadow-md">
          {isLoading ? (
            <div className="text-center text-gray-600 dark:text-gray-300 py-6">
              Loading...
            </div>
          ) : (
            <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
              {/* Table Header */}
              <thead className="bg-gray-200 dark:bg-gray-800">
                <tr>
                  <th className="border p-3 text-left">Levels</th>
                  {titles.map((title, index) => (
                    <th key={index} className="border p-3 text-left">
                      {title.toUpperCase()}
                    </th>
                  ))}
                  <th className="border p-3 text-left">Status</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {Array.from({ length: maxRows }).map((_, rowIndex) => {
                  const isAchieved = rowIndex < userLevel;
                  const isRunning = rowIndex === userLevel;

                  return (
                    <tr
                      key={rowIndex}
                      className={`bg-white dark:bg-gray-900 ${
                        isRunning
                          ? "bg-yellow-200 dark:bg-yellow-600 font-bold"
                          : ""
                      } ${
                        isAchieved
                          ? "bg-green-200 dark:bg-green-600 text-gray-900"
                          : ""
                      }`}
                    >
                      {/* First column: Level numbers */}
                      <td className="border p-3 font-bold text-gray-900 dark:text-white">
                        {`Level ${rowIndex + 1}`}
                      </td>

                      {/* Remaining columns: values for each title */}
                      {Object.keys(RANK_FIELDS).map((rankKey, colIndex) => (
                        <td
                          key={colIndex}
                          className="border p-3 text-gray-900 dark:text-gray-200"
                        >
                          {getUserProgress(rankKey, rowIndex)}
                        </td>
                      ))}

                      {/* Last column: Show "Achieved" status only in the last column */}
                      <td className="border p-3 text-gray-900 dark:text-gray-200 font-bold">
                        {isAchieved
                          ? "Level Achieved ✅"
                          : isRunning
                          ? "🔹 Running"
                          : "🚀 Next Level"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </MasterLayout>
  );
};

export default RoyalityAndRewards;
