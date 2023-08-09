"use client";

import { useEffect, useState } from "react";
import { AES } from "crypto-js";

export default function PasswordResetModal({
  passwordResetModal,
  showPasswordResetModal,
  session,
}: {
  passwordResetModal: any;
  showPasswordResetModal: any;
  session: any;
}) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [tempCheckPassword, setTempCheckPassword] = useState("");

  const [valid, setValid] = useState(false);

  const [error, setError] = useState({ show: false, message: "", type: false });

  useEffect(() => {
    setOldPassword("");
    setNewPassword("");
    setTempCheckPassword("");
  }, [passwordResetModal.show]);

  useEffect(() => {
    if (newPassword !== tempCheckPassword) {
      setError({ show: true, message: "Passwords do not match!", type: false });
      setValid(false);
    } else {
      setError({ show: false, message: "", type: false });
      setValid(true);
    }
  }, [tempCheckPassword]);

  const [satisfiesLG, setsatisfiesLG] = useState(false);
  const [satisfiesLC, setsatisfiesLC] = useState(false);
  const [satisfiesUP, setsatisfiesUP] = useState(false);
  const [satisfiesDI, setsatisfiesDI] = useState(false);
  const [satisfiesSC, setsatisfiesSC] = useState(false);

  const [satisfiesAll, setsatisfiesAll] = useState(false);

  useEffect(() => {
    function validatePassword(password = "") {
      // Require at least 8 characters
      setsatisfiesLG(password.length >= 8);

      // Require at least one lower case letter
      setsatisfiesLC(/[a-z]/.test(password));

      // Require at least one upper case letter
      setsatisfiesUP(/[A-Z]/.test(password));

      // Require at least one digit
      setsatisfiesDI(/[0-9]/.test(password));

      // Require at least one special character
      var specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
      setsatisfiesSC(specialChars.test(password));
    }

    if (
      satisfiesLG &&
      satisfiesLC &&
      satisfiesUP &&
      satisfiesDI &&
      satisfiesSC
    ) {
      setsatisfiesAll(true);
    } else {
      setsatisfiesAll(false);
    }

    validatePassword(newPassword);
  }, [newPassword]);

  async function handleSubmit() {
    // check all fields if empty
    if (!oldPassword || !newPassword || !tempCheckPassword) {
      setError({
        show: true,
        message: "Please fill out all fields!",
        type: false,
      });
      return;
    }

    if (!valid) return;
    if (!satisfiesAll) return;

    const res = await fetch("/api/resetPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: session.user.id,
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
    });

    const json = await res.json();

    if (!json.ok) {
      setError({ show: true, message: json.message, type: false });
    } else {
      setNewPassword("");
      setOldPassword("");
      setError({
        show: true,
        message: json.message + " This window will close in 3 seconds.",
        type: true,
      });
      setTimeout(() => {
        showPasswordResetModal({ show: false });
        setError({ show: false, message: "", type: false });
      }, 3000);
    }
  }

  return (
    <>
      {passwordResetModal.show && session ? (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 w-full h-full bg-black opacity-40"
            onClick={() => showPasswordResetModal({ show: false })}
          />
          <div className="flex items-center min-h-screen px-4 py-8">
            <div className="relative w-full max-w-lg mx-auto bg-gray-900 dark:bg-bgDarkmode rounded-md shadow-lg">
              <div className="flex items-center justify-between p-4 border-b">
                <h4 className="text-xl font-bold text-gray-200 flex flex-row items-center dark:text-textDarkmode">
                  Change Password
                </h4>
                <button
                  className="p-2 text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => showPasswordResetModal({ show: false })}
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
                <h1 className="text-red-200 px-5 pt-3">
                  NOTE: This has no effect on managed accounts!
                </h1>
                <div className="space-y-2 p-4 text-[15.5px] leading-relaxed text-gray-500">
                  <label className="block text-md font-medium text-gray-200 dark:text-textDarkmode">
                    Old Password
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="h-auto block w-full px-3 py-2 text-gray-900   border rounded-md shadow-md focus:ring-blue-500 focus:border-blue-500 sm:text-md"
                    placeholder="Old Password"
                    onChange={(e) => setOldPassword(e.target.value)}
                    type="password"
                  />
                  <label className="block text-md font-medium text-gray-200 dark:text-textDarkmode">
                    New Password
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="h-auto block w-full px-3 py-2 text-gray-900 border rounded-md shadow-md focus:ring-blue-500 focus:border-blue-500 sm:text-md"
                    placeholder="New Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                    type="password"
                  />
                  <label className="block text-md font-medium text-gray-200 dark:text-textDarkmode">
                    Repeat Password
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="h-auto block w-full px-3 py-2 text-gray-900 border rounded-md shadow-md focus:ring-blue-500 focus:border-blue-500 sm:text-md"
                    placeholder="Repeat Password"
                    onChange={(e) => setTempCheckPassword(e.target.value)}
                    type="password"
                  />
                </div>
                <div
                  className={`${
                    newPassword.length == 0 ? "hidden mb-6" : "ml-5 block mb-6"
                  }`}
                >
                  <ul className="list-disc list-inside">
                    <li
                      className={`${
                        satisfiesLG ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      At least 8 characters
                    </li>
                    <li
                      className={`${
                        satisfiesLC ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      At least one lower case letter
                    </li>
                    <li
                      className={`${
                        satisfiesUP ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      At least one upper case letter
                    </li>
                    <li
                      className={`${
                        satisfiesDI ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      At least one digit
                    </li>
                    <li
                      className={`${
                        satisfiesSC ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      At least one special character
                    </li>
                  </ul>
                </div>
                {error.show && (
                  <div
                    className={`${
                      error.type ? "text-green-500" : "text-red-500"
                    } ml-5`}
                  >
                    <span className="">{error.message}</span>
                  </div>
                )}
                <div className="flex items-center gap-3 p-4 mt-5 border-t">
                  <button
                    className="px-6 py-2 text-white bg-blue-500 rounded-md outline-none ring-offset-2 ring-blue-400 focus:ring-2"
                    onClick={() => handleSubmit()}
                    disabled={!valid}
                  >
                    Save
                  </button>
                  <button
                    className="px-6 py-2 text-gray-200 border rounded-md outline-none dark:text-textDarkmode ring-offset-2 ring-blue-400 focus:ring-2"
                    onClick={() =>
                      showPasswordResetModal({ show: false, steamid: false })
                    }
                  >
                    Cancel
                  </button>
                </div>
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
