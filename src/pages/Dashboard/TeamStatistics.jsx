import React from "react";
import { useSelector } from "react-redux";

const TeamStatistics = () => {
  const { companyInfo } = useSelector((state) => state.user);
  const team = useSelector((state) => state.team);

  // Define team data for display
  const teamData = [
    { key: "Active Directs", value: team.activeDirects },
    { key: "Inactive Directs", value: team.inactiveDirects },
    { key: "Direct Business", value: team.directBusiness, isCurrency: true },
    { key: "Total Team", value: team.totalTeam },
    { key: "Total Business", value: team.totalBusiness, isCurrency: true },
    { key: "Inactive Team", value: team.inactiveTeam },
  ];

  // Define colors for progress segments
  const progressColors = [
    "#06B6D4", // Cyan
    "#22C55E", // Green
    "#84CC16", // Lime
    "#EAB308", // Yellow
    "#F59E0B", // Orange
    "#F97316", // Dark Orange
  ];

  // Calculate total for progress bar (using totalTeam for proportionality)
  const totalTeamValue = team.totalTeam || 1; // Avoid division by zero
  const progressData = [
    { key: "Active Directs", value: team.activeDirects },
    { key: "Inactive Directs", value: team.inactiveDirects },
    { key: "Inactive Team", value: team.inactiveTeam },
  ].filter(item => item.value > 0); // Only show non-zero values in progress bar

  return (
    <div className="col-md-6">
      <div className="card radius-16">
        <div className="card-header">
          <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
            <h6 className="mb-2 fw-bold text-lg mb-0">Team Info</h6>
          </div>
        </div>
        <div className="card-body">
          {/* Dynamic Progress Bar */}
          <div className="mb-3 d-flex w-full overflow-hidden rounded-lg bg-gray-300">
            {progressData.map((item, index) => {
              const widthPercentage = (item.value / totalTeamValue) * 100;
              return (
                <div
                  key={index}
                  className="h-3 transition-all"
                  style={{
                    width: `${widthPercentage}%`,
                    backgroundColor:
                      progressColors[index % progressColors.length],
                  }}
                />
              );
            })}
          </div>

          {/* Key-Value Data Display */}
          {teamData.map((item, index) => (
            <div
              key={index}
              className="d-flex align-items-center justify-content-between p-12 bg-neutral-100"
            >
              <div className="d-flex align-items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      progressColors[index % progressColors.length],
                  }}
                />
                <span className="text-secondary-light">{item.key}</span>
                <span className="text-primary-light fw-semibold">
                  {item.isCurrency ? companyInfo.CURRENCY : ""}
                  {typeof item.value === "number" ? item.value.toFixed(item.isCurrency ? 2 : 0) : item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamStatistics;