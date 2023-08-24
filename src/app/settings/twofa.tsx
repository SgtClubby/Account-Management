"use client";

import { useEffect, useState } from "react";
import { AES } from "crypto-js";
import { SessionWithId, User } from "../types";

export default function TwoFA({
  session,
  user,
  showTwoFactorModal,
}: {
  session: SessionWithId;
  user: User;
  showTwoFactorModal: any;
}) {
  const [error, setError] = useState({ show: false, message: "", type: false });

  async function handleSubmit() {}
  return (
    <div className="py-4 px-4 flex flex-col w-full rounded-md h-full">
      <div className="flex w-full h-full">
        <div className="flex-col p-4 text-xl leading-relaxed text-gray-200 w-full space-y-5">
          <div className="flex flex-col md:flex-row flex-grow w-full ">
            <p className="text-xl">Two Factor Authentication Status:</p>
            <p
              className={`${
                user?.twoFactorAuth ? "text-green-500" : "text-red-500"
              } md:ml-5`}
            >
              {user?.twoFactorAuth ? "Enabled" : "Disabled"}
            </p>
            <button
              className="md:ml-auto w-fit mt-2 md:mt-0 px-3 py-1 text-white bg-blue-500 rounded-md outline-none ring-offset-2 ring-blue-400 focus:ring-2"
              onClick={() => showTwoFactorModal({ show: true })}
              disabled={false}
            >
              Manage
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 mt-auto">
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
