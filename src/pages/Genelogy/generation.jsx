import React, { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import { getUserGenerationTreeAsync } from "../../feature/user/userSlice";
import toast from "react-hot-toast";
import MasterLayout from "../../masterLayout/MasterLayout";

const Generation = () => {
  const dispatch = useDispatch();
  const { userGenerationTree, isLoading } = useSelector((state) => state.user);
  const { currentUser: loggedInUser } = useSelector((state) => state.auth);

  const [tree, setTree] = useState(null);
  const [expandedUsers, setExpandedUsers] = useState(new Set());
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch generation tree data
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

  // Build hierarchical tree and assign levels
  useEffect(() => {
    if (!loggedInUser || userGenerationTree.length === 0) return;

    const userMap = new Map();
    userGenerationTree.forEach((user) =>
      userMap.set(user._id, { ...user, children: [], level: 0 })
    );

    userGenerationTree.forEach((user) => {
      if (user.uSponsor && userMap.has(user.uSponsor)) {
        const parent = userMap.get(user.uSponsor);
        const child = userMap.get(user._id);
        child.level = parent.level + 1; 
        parent.children.push(child);
      }
    });

    // Ensure logged-in user is root with level 0
    setTree(userMap.get(loggedInUser._id) || null);
  }, [userGenerationTree, loggedInUser]);

  const toggleExpand = (userId) => {
    setExpandedUsers((prev) => {
      const newSet = new Set(prev);
      newSet.has(userId) ? newSet.delete(userId) : newSet.add(userId);
      return newSet;
    });
  };

  const renderTree = (node) => {
    if (!node) return null;

    return (
      <div key={node._id} className={`ml-${node.level * 4} border-l pl-4`}>
        <div
          className="cursor-pointer bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 p-2 rounded-md flex items-center gap-2"
          onClick={() => setSelectedUser(node)}
        >
          <span className="font-medium">
            {node.username} <span className="text-sm text-gray-500">(Level {node.level})</span>
          </span>
          {node.children.length > 0 && (
            <button
              className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node._id);
              }}
            >
              {expandedUsers.has(node._id) ? "Collapse" : "Expand"}
            </button>
          )}
        </div>

        {expandedUsers.has(node._id) && node.children.length > 0 && (
          <div>{node.children.map((child) => renderTree(child))}</div>
        )}
      </div>
    );
  };

  return (
    <MasterLayout>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Your Team Hierarchy</h2>
        <div className="border p-4 rounded-lg bg-white dark:bg-gray-900">
          {isLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : tree ? (
            renderTree(tree)
          ) : (
            <p className="text-gray-500">No downline members found.</p>
          )}
        </div>

        {/* User Details Modal */}
        {selectedUser && (
          <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)}>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-1/3">
                <h3 className="text-lg font-semibold">User Details</h3>
                <p>Username: {selectedUser.username}</p>
                <p>Name: {selectedUser.name || "N/A"}</p>
                <p>Sponsor: {selectedUser.uSponsor || "N/A"}</p>
                <p>Level: {selectedUser.level}</p>
                <button
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  onClick={() => setSelectedUser(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </MasterLayout>
  );
};

export default Generation;
