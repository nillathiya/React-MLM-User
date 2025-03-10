import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserDetailsWithInvestmentInfoAsync,
  getUserGenerationTreeAsync,
} from "../../feature/user/userSlice";
import toast from "react-hot-toast";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";
import Tree from "react-d3-tree";
import { Dialog } from "@headlessui/react";
import Loader from "../../components/common/Loader";
import { Icon } from "@iconify/react";
import { ICON } from "../../constants/icons";
import { API_URL } from "../../api/routes";

const Generation = () => {
  const dispatch = useDispatch();
  const { userGenerationTree, user: selectedUserDetail } = useSelector(
    (state) => state.user
  );
  const { currentUser: loggedInUser } = useSelector((state) => state.auth);

  const [treeData, setTreeData] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userGenerationTreeLoading, setUserGenerationTreeLoading] =
    useState(false);
  const [selectedUserDeatilsLoading, setSelectedUserDeatilsLoading] =
    useState(false);

  useEffect(() => {
    (async () => {
      setUserGenerationTreeLoading(true);
      try {
        if (userGenerationTree.length === 0) {
          await dispatch(getUserGenerationTreeAsync(loggedInUser._id)).unwrap();
        }
      } catch (error) {
        toast.error(error || "Server error");
      } finally {
        setUserGenerationTreeLoading(false);
      }
    })();
  }, [dispatch, userGenerationTree]);

  useEffect(() => {
    if (!loggedInUser || userGenerationTree.length === 0) return;

    const userMap = new Map();

    userGenerationTree.forEach((user) =>
      userMap.set(user._id, {
        name: user.username,
        attributes: { Level: 0 },
        children: [],
        rawData: user,
        collapsed: false,
      })
    );

    userGenerationTree.forEach((user) => {
      if (user.uSponsor && userMap.has(user.uSponsor)) {
        const parent = userMap.get(user.uSponsor);
        const child = userMap.get(user._id);
        child.attributes.Level = parent.attributes.Level + 1;
        parent.children.push(child);
      }
    });

    setTreeData(userMap.get(loggedInUser._id) || null);
  }, [userGenerationTree, loggedInUser]);

  const renderCustomNodeElement = ({ nodeDatum, toggleNode }) => {
    return (
      <g>
        {nodeDatum.children?.length > 0 && (
          <circle
            r={15}
            className="cursor-pointer hover:scale-110 transition-transform"
            fill="lightgray"
            stroke="black"
            onClick={(e) => {
              e.stopPropagation();
              toggleNode();
            }}
          />
        )}
        <text
          x="-5"
          y="5"
          fill="black"
          fontSize="12"
          textAnchor="middle"
          className="cursor-pointer font-bold text-center"
          onClick={(e) => {
            e.stopPropagation();
            toggleNode();
          }}
        >
          {nodeDatum.collapsed ? "+" : "-"}
        </text>

        <image
          href={
            nodeDatum.rawData.profileImage ||
            `https://img.icons8.com/ios-filled/100/000000/user-male-circle.png`
          }
          x="-20"
          y="-50"
          height="40px"
          width="40px"
          className="cursor-pointer hover:scale-110 transition-transform"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedUser(nodeDatum.rawData);
          }}
        />

        <text
          x={25}
          y={-10}
          fill="black"
          className="cursor-pointer text-gray-900 dark:text-gray-100"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedUser(nodeDatum.rawData);
          }}
        >
          {nodeDatum.name} (L{nodeDatum.attributes.Level})
        </text>
      </g>
    );
  };

  useEffect(() => {
    if (!selectedUser) return;

    (async () => {
      setSelectedUserDeatilsLoading(true);
      try {
        await dispatch(
          getUserDetailsWithInvestmentInfoAsync({ userId: selectedUser._id })
        ).unwrap();
      } catch (error) {
        toast.error(error || "Server error");
      } finally {
        setSelectedUserDeatilsLoading(false);
      }
    })();
  }, [selectedUser, dispatch]);

  return (
    <MasterLayout>
      <Breadcrumb title="User-Generation"></Breadcrumb>

      <div className="p-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          User Team Hierarchy
        </h2>
        <div className="border p-4 rounded-lg bg-gray-100 h-[500px] shadow-lg mt-3">
          {userGenerationTreeLoading ? (
            <Loader loader="ClipLoader" size={50} color="blue" />
          ) : treeData ? (
            <Tree
              data={treeData}
              orientation="vertical"
              translate={{ x: 300, y: 50 }}
              pathFunc="step"
              nodeSize={{ x: 200, y: 100 }}
              separation={{ siblings: 1.5, nonSiblings: 2 }}
              collapsible={true}
              renderCustomNodeElement={renderCustomNodeElement}
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No downline members found.
            </p>
          )}
        </div>

        {selectedUser && (
          <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)}>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white dark:bg-gray-800 !p-5 rounded-lg shadow-xl w-1/3">
                <h3 className="text-lg font-semibold mb-2 border-b-2 border-gray-300 text-gray-900 dark:text-gray-100">
                  User Details
                </h3>
                <div className="flex py-3">
                  {selectedUserDeatilsLoading ? (
                    <Loader loader="ClipLoader" size={50} color="blue" />
                  ) : (
                    <div className="flex items-center gap-4">
                      {selectedUserDetail?.user?.profilePicture ? (
                        <img
                          src={`${API_URL}${selectedUserDetail?.user?.profilePicture}`}
                          alt="User"
                          className="w-14 h-14 rounded-full shadow-md"
                        />
                      ) : (
                        <Icon
                          icon={ICON.DEFAULT_USER}
                          className="w-14 h-14 rounded-full shadow-md"
                        />
                      )}

                      <div className="text-gray-900 dark:text-gray-100">
                        <p>
                          <strong>Username:</strong>{" "}
                          {selectedUserDetail?.user?.username || "N/A"}
                        </p>
                        <p>
                          <strong>Sponsor:</strong>{" "}
                          {selectedUserDetail?.user?.uSponsor?.username ||
                            "N/A"}
                        </p>
                        <p>
                          <strong>Package:</strong>{" "}
                          {selectedUserDetail?.totalInvestment || "0"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="border-t-2 border-gray-300 pt-3">
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 w-full text-center"
                    onClick={() => setSelectedUser(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </MasterLayout>
  );
};

export default Generation;
