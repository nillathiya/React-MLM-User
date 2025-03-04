import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserGenerationTreeAsync } from "../../feature/user/userSlice";
import toast from "react-hot-toast";
import MasterLayout from "../../masterLayout/MasterLayout";
import Tree from "react-d3-tree";

const Generation = () => {
  const dispatch = useDispatch();
  const { userGenerationTree, isLoading } = useSelector((state) => state.user);
  const { currentUser: loggedInUser } = useSelector((state) => state.auth);

  const [treeData, setTreeData] = useState(null);

  // Fetch user generation tree data
  useEffect(() => {
    (async () => {
      try {
        if (userGenerationTree.length === 0) {
          await dispatch(getUserGenerationTreeAsync()).unwrap();
        }
      } catch (error) {
        toast.error(error || "Server error");
      }
    })();
  }, [dispatch, userGenerationTree]);

  // Convert flat data into hierarchical structure for D3 tree
  useEffect(() => {
    if (!loggedInUser || userGenerationTree.length === 0) return;

    const userMap = new Map();
    userGenerationTree.forEach((user) =>
      userMap.set(user._id, { name: user.username, attributes: { Level: 0 }, children: [] })
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

  return (
    <MasterLayout>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Your Team Hierarchy</h2>
        <div className="border p-4 rounded-lg bg-white dark:bg-gray-900 h-[500px]">
          {isLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : treeData ? (
            <Tree
              data={treeData}
              orientation="vertical"
              translate={{ x: 300, y: 50 }}
              pathFunc="step"
              nodeSize={{ x: 200, y: 100 }}
              separation={{ siblings: 1.5, nonSiblings: 2 }}
              collapsible={true} // Enables expand/collapse
              nodeSvgShape={{
                shape: "circle",
                shapeProps: { r: 20, fill: "#4F46E5" },
              }}
            />
          ) : (
            <p className="text-gray-500">No downline members found.</p>
          )}
        </div>
      </div>
    </MasterLayout>
  );
};

export default Generation;
