"use client";

import { useState } from "react";
import { AES } from "crypto-js";

export default function AddModal({
  addModal,
  fetchData,
  showAddModal,
  session,
}: {
  addModal: any;
  fetchData: any;
  showAddModal: any;
  session: any;
}) {
  const [selectedAccountName, setSelectedAccountName] = useState("");
  const [selectedUsername, setSelectedUsermame] = useState("");
  const [selectedPassword, setSelectedPassword] = useState("");
  const [selectedUsedFor, setSelectedUsedFor] = useState("");
  const [selectedMasterPassword, setSelectedMasterPassword] = useState("");

  const [error, setError] = useState({ show: false, message: "" });

  async function handleSubmit() {
    const res = await fetch("/api/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accountName: selectedAccountName,
        username: selectedUsername,
        encPassword: AES.encrypt(
          selectedPassword,
          selectedMasterPassword
        ).toString(),
        usedFor: selectedUsedFor,
      }),
    });

    const json = await res.json();

    if (json.error) {
      setError({ show: true, message: json.error });
    } else {
      setSelectedAccountName("");
      setSelectedUsermame("");
      setSelectedPassword("");
      setSelectedUsedFor("");
      setSelectedMasterPassword("");
      setError({ show: true, message: "Success!" });
      showAddModal({ show: false });
      fetchData();
      setTimeout(() => {
        setError({ show: false, message: "" });
      }, 2000);
    }
  }

  return (
    <>
      {error.show && (
        <div className="fixed bg-green-100 border border-green-400 text-greeb-700 px-4 py-3 rounded w-32 right-0 left-0 m-auto">
          <span className="block sm:inline">{error.message}</span>
        </div>
      )}
      {addModal.show && session ? (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 w-full h-full bg-black opacity-40"
            onClick={() => showAddModal({ show: false, steamid: false })}
          />
          <div className="flex items-center min-h-screen px-4 py-8">
            <div className="relative w-full max-w-lg mx-auto bg-metrix-blue-background dark:bg-bgDarkmode rounded-md shadow-lg">
              <div className="flex items-center justify-between p-4 border-b">
                <h4 className="text-xl font-bold text-gray-200 flex flex-row items-center dark:text-textDarkmode">
                  New Account
                </h4>
                <button
                  className="p-2 text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => showAddModal({ show: false, steamid: false })}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mx-auto"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-2 p-4 mt-3 text-[15.5px] leading-relaxed text-gray-500">
                    <label className="block text-md font-medium text-gray-200 dark:text-textDarkmode">
                      Account Name
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      className="h-auto block w-full px-3 py-2 text-gray-900   border rounded-md shadow-md focus:ring-blue-500 focus:border-blue-500 sm:text-md"
                      placeholder="Account Name"
                      onChange={(e) => setSelectedAccountName(e.target.value)}
                      type="text"
                    />
                    <label className="block text-md font-medium text-gray-200 dark:text-textDarkmode">
                      Username
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      className="h-auto block w-full px-3 py-2 text-gray-900 border rounded-md shadow-md focus:ring-blue-500 focus:border-blue-500 sm:text-md"
                      placeholder="Username"
                      onChange={(e) => setSelectedUsermame(e.target.value)}
                      type="text"
                    />
                    <label className="block text-md font-medium text-gray-200 dark:text-textDarkmode">
                      Password
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      className="h-auto block w-full px-3 py-2 text-gray-900 border rounded-md shadow-md focus:ring-blue-400 focus:border-blue-400 sm:text-md"
                      placeholder="Password"
                      onChange={(e) => setSelectedPassword(e.target.value)}
                      type="password"
                    />
                    <label className="block text-md font-medium text-gray-200 dark:text-textDarkmode">
                      Service / Game
                    </label>
                    <input
                      className="h-auto block w-full px-3 py-2 text-gray-900 border rounded-md shadow-md focus:ring-blue-400 focus:border-blue-400 sm:text-md"
                      placeholder="Used for?"
                      onChange={(e) => setSelectedUsedFor(e.target.value)}
                      type="text"
                    />
                    <div className="mt-5">
                      <label className="block text-md font-medium text-gray-200 dark:text-textDarkmode mt-10">
                        <span>Master Password</span>
                        <span className="text-red-500">*</span>
                        <br />
                        <span>
                          (Can be anything, BUT MAKE SURE TO REMEMBER IT!)
                        </span>
                      </label>
                      <input
                        required
                        className="h-auto block w-full px-3 py-2 text-gray-900 border rounded-md shadow-md focus:ring-blue-400 focus:border-blue-400 sm:text-md"
                        placeholder="Master Password"
                        onChange={(e) =>
                          setSelectedMasterPassword(e.target.value)
                        }
                        type="password"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 mt-5 border-t">
                    <button
                      className="px-6 py-2 text-white bg-metrix-blue rounded-md outline-none ring-offset-2 ring-blue-400 focus:ring-2"
                      type="submit"
                    >
                      Save
                    </button>
                    <button
                      className="px-6 py-2 text-gray-200 border rounded-md outline-none dark:text-textDarkmode ring-offset-2 ring-blue-400 focus:ring-2"
                      onClick={() =>
                        showAddModal({ show: false, steamid: false })
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
