"use client";

import { ChangeEvent, useState } from "react";
import { Account } from "../types";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

function AccountCard({ account, idx }: { account: Account; idx: number }) {
  const [passwordPrompt, showPasswordPrompt] = useState({ show: false });

  return (
    <li
      key={idx}
      className="px-4 py-3 duration-150 hover:border-gray-700 hover:rounded-xl hover:bg-gray-700"
    >
      <a key={idx} href={account.id} className="space-y-3">
        <div className="flex items-center gap-x-3">
          <div>
            <span className="block text-sm text-indigo-200 font-medium">
              {account.name}
            </span>
            <h3 className="text-base text-gray-200 font-semibold mt-1">
              {account.username}
            </h3>
          </div>
        </div>
        {!passwordPrompt.show ? (
          <button
            key={idx}
            onClick={() => {
              showPasswordPrompt({ show: true });
              setTimeout(() => {
                showPasswordPrompt({ show: false });
              }, 10000);
            }}
            className="inline-block px-2 py-1 bg-blue-600 text-white font-medium text-xs leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-fit"
          >
            Click to reveal password
          </button>
        ) : (
          <div
            key={idx}
            className="flex-row text-md text-gray-200 flex items-center gap-6"
          >
            <p>Password is revealed for 10 seconds</p>
            {account.password}
            <ContentCopyIcon
              key={idx}
              className="cursor-pointer"
              titleAccess="Copy to clipboard"
              onClick={() => {
                navigator.clipboard.writeText(account.password);
              }}
            />
          </div>
        )}

        <div className="text-sm text-gray-600 flex items-center gap-6">
          <span className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.05025 4.05025C7.78392 1.31658 12.2161 1.31658 14.9497 4.05025C17.6834 6.78392 17.6834 11.2161 14.9497 13.9497L10 18.8995L5.05025 13.9497C2.31658 11.2161 2.31658 6.78392 5.05025 4.05025ZM10 11C11.1046 11 12 10.1046 12 9C12 7.89543 11.1046 7 10 7C8.89543 7 8 7.89543 8 9C8 10.1046 8.89543 11 10 11Z"
                fill="#9CA3AF"
              />
            </svg>

            {account.usedFor}
          </span>
        </div>
      </a>
    </li>
  );
}

export default AccountCard;
