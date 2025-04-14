import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/common/Loader";
import { getIncomeTransactionsByUserAsync } from "../../feature/transaction/transactionSlice";
import MasterLayout from "../../masterLayout/MasterLayout";
import Breadcrumb from "../../components/Breadcrumb";

const calculateReceivedAmount = (createdAt, totalAmount) => {
  const startDate = new Date(createdAt);
  const currentDate = new Date();
  const daysPassed = Math.floor(
    (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const received = Math.min(daysPassed * 1, totalAmount);
  return received >= 0 ? received : 0;
};

function DirectIncomes() {
  const dispatch = useDispatch();
  const { incomeTransactionsLoading, incomeTransactions } = useSelector(
    (state) => state.transaction
  );

  useEffect(() => {
    const fetchAllDirectIncomeTransactions = async () => {
      try {
        await dispatch(
          getIncomeTransactionsByUserAsync({ source: "direct" })
        ).unwrap();
      } catch (error) {
        toast.error(error?.message || "Server Error");
      }
    };
    fetchAllDirectIncomeTransactions();
  }, [dispatch]);

  return (
    <MasterLayout>
      <Breadcrumb title="Direct Incomes" />

      <div className="container mx-auto !p-6 bg-gray-100 dark:bg-darkCard min-h-screen">
        <h1 className="text-2xl font-extrabold !mb-10 text-center text-gray-900 dark:text-gray-100 tracking-wide">
          Direct Incomes
        </h1>
        {incomeTransactionsLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader loader="ClipLoader" size={50} color="blue" />
          </div>
        ) : incomeTransactions.length === 0 ? (
          <div className="text-center py-12 bg-white dark:!bg-gray-900 rounded-lg shadow-md mx-auto max-w-md">
            <p className="text-lg text-gray-600 dark:!text-gray-300">
              No direct income transactions yet.
            </p>
            <p className="text-sm text-gray-500 dark!:text-gray-400 mt-2">
              Start referring users to earn rewards!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {incomeTransactions.map((transaction) => {
              const receivedAmount = calculateReceivedAmount(
                transaction.createdAt,
                transaction.amount
              );
              const remainingAmount = transaction.amount - receivedAmount;

              return (
                <div
                  key={transaction._id}
                  className="relative bg-white dark:!bg-gray-900 rounded-2xl shadow-xl !p-6 transform transition-all duration-300 hover:scale-102 hover:shadow-2xl border border-gray-200 dark:!border-gray-800 backdrop-blur-sm dark:bg-opacity-80"
                >
                  {/* Badge */}
                  <span className="absolute !top-3 right-3 bg-blue-500 dark:!bg-blue-600 text-white text-xs font-medium !px-2.5 !py-1 rounded-full">
                    Direct
                  </span>
                  {/* Username */}
                  <h2 className="text-2xl font-semibold text-gray-900 dark:!text-gray-100 !mb-5 truncate">
                    {transaction.txUCode?.username || "Unknown User"}
                  </h2>
                  <div className="space-y-4">
                    {/* Total Amount */}
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-blue-600 dark:!text-blue-400">
                        Total:
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:!text-gray-100">
                        ${transaction.amount.toFixed(2)}
                      </span>
                    </div>
                    {/* Received Amount */}
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-green-600 dark:!text-green-400">
                        Received:
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:!text-gray-100">
                        ${receivedAmount.toFixed(2)}
                      </span>
                    </div>
                    {/* Remaining Amount */}
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-red-600 dark:!text-red-400">
                        Remaining:
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:!text-gray-100">
                        ${remainingAmount.toFixed(2)}
                      </span>
                    </div>
                    {/* Start Date */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:!text-gray-400">
                      <span className="font-medium">Started:</span>
                      <span>
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MasterLayout>
  );
}

export default DirectIncomes;
