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

const RoyalityAndRewards = () => {
  const dispatch = useDispatch();
  const {
    rankData = {},
    rankSettings = [],
    isLoading,
  } = useSelector((state) => state.user);
  const { currentUser: loggedInUser } = useSelector((state) => state.auth);

  const userRank = loggedInUser?.myRank || 0;

  useEffect(() => {
    dispatch(getRankSettingsAsync());
    dispatch(getUserRankAndTeamMetricsAsync());
  }, [dispatch]);

  const maxRows = useMemo(
    () => Math.max(...rankSettings.map((d) => d.value.length), 0),
    [rankSettings]
  );

  const userLevel = useMemo(() => {
    if (!rankData || !rankSettings.length) return 0;

    for (let level = 0; level < maxRows; level++) {
      const allCriteriaMet = rankSettings.every((setting) => {
        const userValue = rankData[setting.slug] ?? 0;
        const requiredValue = parseFloat(setting.value[level]) || 0;

        if (
          setting.slug === "rank" ||
          setting.slug === "months" ||
          setting.slug === "reward"
        ) {
          return true;
        }

        return userValue >= requiredValue;
      });

      if (!allCriteriaMet) return level;
    }
    return maxRows;
  }, [rankSettings, rankData, maxRows]);

  useEffect(() => {
    if (userRank !== userLevel + 1) {
      dispatch(updateUserProfileAsync({ rank: userLevel + 1 }))
        .unwrap()
        .then(() => toast.success("User rank updated successfully"))
        .catch(() => toast.error("Failed to update rank"));
    }
  }, [userRank, userLevel, dispatch]);

  const getUserProgress = (slug, levelIndex) => {
    if (!rankData) return "0 / 0"; // Guard against null rankData

    const userValue = rankData[slug] ?? 0;
    const requiredValue =
      rankSettings.find((d) => d.slug === slug)?.value[levelIndex] || "0";

    switch (slug) {
      case "rank":
        return userValue === 0
          ? requiredValue
          : `${userValue}/${requiredValue}`;
      case "reward":
      case "self_business":
      case "direct_business":
      case "total_team_business":
        return `${userValue.toLocaleString()} / ${parseFloat(
          requiredValue
        ).toLocaleString()}`;
      default:
        return `${userValue} / ${requiredValue}`;
    }
  };

  return (
    <MasterLayout>
      <Breadcrumb title="Royalty & Reward" />
      <div className="p-4">
        <div className="dark:bg-darkCard p-3 rounded-lg shadow-md overflow-x-auto">
          {isLoading || !rankData ? (
            <div className="text-center text-gray-600 dark:text-gray-300 py-6">
              Loading...
            </div>
          ) : rankSettings.length === 0 ? (
            <div className="text-center text-gray-600 dark:text-gray-300 py-6">
              No rank settings available
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
                  const isAchieved = level < userLevel;
                  const isRunning = level === userLevel;
                  const isNext = level > userLevel;

                  return (
                    <tr
                      key={level}
                      className={`!bg-white dark:!bg-gray-900 ${
                        isRunning
                          ? "!bg-yellow-200 dark:!bg-yellow-600 !font-bold"
                          : isAchieved
                          ? "!bg-green-200 dark:!bg-green-600 !text-gray-900"
                          : "!bg-gray-100 dark:!bg-gray-800"
                      }`}
                    >
                      <td className="border p-3 font-bold !text-gray-900 dark:!text-white">
                        Level {level + 1}
                      </td>
                      {rankSettings.map((setting) => (
                        <td
                          key={setting.slug}
                          className="border p-3 !text-gray-900 dark:!text-gray-200 whitespace-nowrap"
                        >
                          {getUserProgress(setting.slug, level)}
                        </td>
                      ))}
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
