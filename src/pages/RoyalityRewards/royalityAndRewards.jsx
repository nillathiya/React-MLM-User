import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Breadcrumb from "../../components/Breadcrumb";
import MasterLayout from "../../masterLayout/MasterLayout";
import {
  getRankSettingsAsync,
  getUserRankAndTeamMetricsAsync,
  updateUserProfileAsync,
} from "../../feature/user/userSlice";
import { RANK_FIELDS } from "../../constants/appConstants";

const RoyalityAndRewards = () => {
  const dispatch = useDispatch();
  const { rankSettings = [], isLoading } = useSelector((state) => state.user);
  const { currentUser: loggedInUser } = useSelector((state) => state.auth);

  const userRank = loggedInUser?.myRank || 0;

  // Static User Data (Example)
  const rankData = {
    myRank: 0,
    directBusines: 5000,
    directTeam: 2000,
    rank: 2,
    selfBusiness: 50000,
    teamBusiness: 50,
    teamSize: 200,
    rewards: 600,
  };

  useEffect(() => {
    dispatch(getRankSettingsAsync());
    dispatch(getUserRankAndTeamMetricsAsync());
  }, [dispatch]);

  // Calculate max levels from rankSettings
  const maxRows = useMemo(
    () => Math.max(...rankSettings.map((d) => d.value.length), 0),
    [rankSettings]
  );

  // Determine user level
  const userLevel = useMemo(() => {
    for (let level = 0; level < maxRows; level++) {
      const allCriteriaMet = Object.keys(RANK_FIELDS).every((rankKey) => {
        const mappedSlug = RANK_FIELDS[rankKey];
        if (!mappedSlug) return true;

        const userValue = rankData[rankKey] || 0;
        const requiredValue =
          rankSettings.find((d) => d.slug === mappedSlug)?.value[level] || 0;

        return userValue >= requiredValue;
      });

      if (!allCriteriaMet) return level;
    }
    return maxRows;
  }, [rankSettings, rankData, maxRows]);

  // Update user rank if different (Fixed the off-by-one issue)
  useEffect(() => {
    if (userRank !== userLevel + 1) {
      // Fix: Adjust for zero-based indexing
      dispatch(updateUserProfileAsync({ rank: userLevel + 1 })) // Fix here
        .unwrap()
        .then(() => toast.success("User rank updated successfully"))
        .catch(() => toast.error("Failed to update rank"));
    }
  }, [userRank, userLevel, dispatch]);

  // Get user progress for table rows
  const getUserProgress = (rankKey, levelIndex) => {
    const mappedSlug = RANK_FIELDS[rankKey];
    if (!mappedSlug) return "N/A";

    const userValue = rankData[rankKey] || 0;
    const requiredValue =
      rankSettings.find((d) => d.slug === mappedSlug)?.value[levelIndex] || 0;

    return `${userValue} / ${requiredValue}`;
  };

  return (
    <MasterLayout>
      <Breadcrumb title="Royalty & Reward" />
      <div className="p-4">
        <div className="dark:bg-darkCard p-3 rounded-lg shadow-md overflow-x-auto">
          {isLoading ? (
            <div className="text-center text-gray-600 dark:text-gray-300 py-6">
              Loading...
            </div>
          ) : (
            <table className="min-w-full border border-gray-300 dark:border-gray-700">
              <thead className="bg-gray-200 dark:bg-gray-800">
                <tr>
                  <th className="border p-3 text-left">Levels</th>
                  {rankSettings.map((d) => (
                    <th key={d.slug} className="border p-3 text-left">
                      {d.title.toUpperCase()}
                    </th>
                  ))}
                  <th className="border p-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody className="bg-gray-200 dark:!bg-gray-700">
                {Array.from({ length: maxRows }).map((_, level) => {
                  const isAchieved = level < userLevel || level === maxRows - 1; // Ensure last level is marked as achieved
                  const isRunning =
                    level === userLevel && level !== maxRows - 1; // Running only if not at max level

                  return (
                    <tr
                      key={level}
                      className={`!bg-white dark:!bg-gray-900 ${
                        isRunning
                          ? "!bg-yellow-200 dark:!bg-yellow-600 !font-bold"
                          : isAchieved
                          ? "!bg-green-200 dark:!bg-green-600 !text-gray-900"
                          : ""
                      }`}
                    >
                      {/* Level Column */}
                      <td className="border p-3 font-bold !text-gray-900 dark:!text-white">
                        {`Level ${level + 1}`}{" "}
                        {/* Fix: Show user-friendly level */}
                      </td>

                      {/* Rank Progress Columns */}
                      {Object.keys(RANK_FIELDS).map((rankKey, index) => (
                        <td
                          key={index}
                          className="border p-3 !text-gray-900 dark:!text-gray-200 whitespace-nowrap"
                        >
                          {getUserProgress(rankKey, level)}
                        </td>
                      ))}

                      {/* Status Column */}
                      <td className="border p-3 !text-gray-900 dark:!text-gray-200 font-bold">
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
