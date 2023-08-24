"use client";

import { useEffect, useState } from "react";
import { AES } from "crypto-js";
import { SessionWithId } from "../types";

export default function Password({ session }: { session: SessionWithId }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [tempCheckPassword, setTempCheckPassword] = useState("");

  const [valid, setValid] = useState(false);

  const [error, setError] = useState({ show: false, message: "", type: false });

  useEffect(() => {
    if (newPassword === "" || tempCheckPassword === "") {
      setError({ show: false, message: "", type: false });
      setValid(false);
      return;
    }

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

    const res = await fetch("/api/resetPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: session?.user?.id,
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
        message: json.message,
        type: true,
      });
    }
  }

  return (
    <div className="py-4 px-4 flex flex-col w-full rounded-md h-full transition-all ease-in-out duration-100">
      <div className="flex">
        <div className="flex-col space-y-2 p-4 text-[15.5px] leading-relaxed text-gray-500">
          <label className="block text-md font-medium text-gray-200">
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
      </div>
      <div
        className={`${
          newPassword.length == 0 ? "hidden mb-6" : "ml-5 block mb-6"
        }`}
      >
        <ul className="list-disc list-inside">
          <li className={`${satisfiesLG ? "text-green-500" : "text-red-500"}`}>
            At least 8 characters
          </li>
          <li className={`${satisfiesLC ? "text-green-500" : "text-red-500"}`}>
            At least one lower case letter
          </li>
          <li className={`${satisfiesUP ? "text-green-500" : "text-red-500"}`}>
            At least one upper case letter
          </li>
          <li className={`${satisfiesDI ? "text-green-500" : "text-red-500"}`}>
            At least one digit
          </li>
          <li className={`${satisfiesSC ? "text-green-500" : "text-red-500"}`}>
            At least one special character
          </li>
        </ul>
      </div>
      <div className="flex items-center gap-3 p-4 border-t mt-auto">
        <button
          className="px-6 py-2 text-white bg-blue-500 rounded-md outline-none ring-offset-2 ring-blue-400 focus:ring-2"
          onClick={() => handleSubmit()}
          disabled={!valid}
        >
          Save
        </button>
        {error.show && (
          <div
            className={`${error.type ? "text-green-500" : "text-red-500"} ml-5`}
          >
            <span className="">{error.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
