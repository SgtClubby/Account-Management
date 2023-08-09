"use client";

import {
  ChangeEvent,
  ChangeEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Account } from "../types";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

type FormValues = {
  masterPassword: string;
  decrypted: boolean;
};

function AccountCard({
  account,
  idx,
  decrypt,
  handleChange,
  formValues,
  setFormValues,
  setError,
  fetchData,
}: {
  account: Account;
  idx: number;
  decrypt: Function;
  handleChange: ChangeEventHandler<HTMLInputElement>;
  formValues: FormValues;
  setFormValues: any;
  setError: any;
  fetchData: any;
}) {
  const [passwordPrompt, showPasswordPrompt] = useState({ show: false });
  const [decryptedPassword, setDecryptedPassword] = useState("");
  const [invalidPassword, setInvalidPassword] = useState(false);

  const [interval1, setInterval1] = useState<NodeJS.Timeout | null>(null);
  const [interval2, setInterval2] = useState<NodeJS.Timeout | null>(null);

  async function deleteAccount(username: string) {
    const res = await fetch("/api/accounts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
      }),
    });

    const json = await res.json();

    setError({ show: true, message: "Successfully deleted!" });
    fetchData();
    setTimeout(() => {
      setError({ show: false, message: "" });
    }, 3000);
  }

  useEffect(() => {
    let interval1: NodeJS.Timeout | null = null;
    if (passwordPrompt.show && formValues.decrypted) {
      interval1 = setTimeout(() => {
        setFormValues({ masterPassword: "", decrypted: false });
        showPasswordPrompt({ show: false });
      }, 60000);
    }
    setInterval1(interval1);

    let interval2: NodeJS.Timeout | null = null;
    if (formValues.decrypted) {
      interval2 = setTimeout(() => {
        setFormValues({ ...formValues, decrypted: false });
      }, 60000);
    }
    setInterval2(interval2);

    return () => {
      clearTimeout(interval1 as NodeJS.Timeout);
      clearTimeout(interval2 as NodeJS.Timeout);
    };
  }, [formValues.decrypted]);

  useEffect(() => {
    if (formValues.masterPassword) {
      let decrypted = "";
      try {
        decrypted = decrypt(account.password, formValues.masterPassword);
      } catch (e) {
        decrypted = "Incorrect password";
        setInvalidPassword(true);
      }

      if (decrypted === "") {
        decrypted = "Incorrect password";
        setInvalidPassword(true);
      }

      setDecryptedPassword(decrypted);
    }
  }, [formValues.decrypted]);

  return (
    <li
      key={idx}
      className="px-4 py-3 duration-150 hover:border-gray-700 hover:rounded-xl hover:bg-gray-700 w-full"
    >
      <a key={idx} href={account.id} className="space-y-3">
        <div className="flex items-center gap-x-3">
          <div>
            <span className="block text-indigo-200 text-xl font-medium">
              {account.name}
            </span>
            <h3 className="text-base text-gray-200 font-semibold mt-1">
              {account.username}
            </h3>
            {/* Delete button */}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            {/* <button
                className="inline-block px-2 py-1 bg-blue-600 text-white font-medium text-xs leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-fit"
                onClick={() => {
                  editAccount(account.);
                }}
              >
                Edit
              </button> */}
            <button
              className="inline-block px-2 py-1 bg-red-600 text-white font-medium text-xs leading-snug uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out w-fit"
              onClick={() => {
                deleteAccount(account.username);
              }}
            >
              Delete
            </button>
          </div>
        </div>
        {!passwordPrompt.show ? (
          <button
            key={idx}
            onClick={() => {
              showPasswordPrompt({ show: true });
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
            {formValues.decrypted && !invalidPassword ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-300">{decryptedPassword}</span>
                <ContentCopyIcon
                  className="text-gray-300 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(account.password);
                  }}
                />
                {/* hide button clears interval*/}
                <button
                  className="inline-block px-3 py-1 m-0 bg-blue-600 text-white font-medium text-xs leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-fit"
                  onClick={() => {
                    setFormValues({ masterPassword: "", decrypted: false });
                    setDecryptedPassword("");
                    showPasswordPrompt({ show: false });
                    clearTimeout(interval1 as NodeJS.Timeout);
                    clearTimeout(interval2 as NodeJS.Timeout);
                  }}
                >
                  Hide
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-gray-200 text-md">Master Password:</h1>
                <input
                  type="password"
                  name="masterPassword"
                  value={formValues.masterPassword}
                  onChange={handleChange}
                  className="bg-gray-800 m-0 text-gray-200 rounded-md px-2 py-1"
                />
                <button
                  className="inline-block px-3 py-1 m-0 bg-blue-600 text-white font-medium text-xs leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-fit"
                  onClick={() => {
                    setFormValues({ ...formValues, decrypted: true });
                  }}
                >
                  Submit
                </button>
                <button
                  className="inline-block px-3 py-1 m-0 bg-blue-600 text-white font-medium text-xs leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-fit"
                  onClick={() => {
                    showPasswordPrompt({ show: false });
                    clearTimeout(interval1 as NodeJS.Timeout);
                    clearTimeout(interval2 as NodeJS.Timeout);
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        )}

        {invalidPassword && (
          <div className="text-sm text-red-500 flex items-center gap-6">
            <span className="flex items-center gap-2">
              <ExclamationCircleIcon className="w-4 h-4" />
              Master Password is incorrect for this entry
            </span>
            <br />
            <button
              className="inline-block px-3 py-1 m-0 bg-blue-600 text-white font-medium text-xs leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-fit"
              onClick={() => {
                setFormValues({ masterPassword: "", decrypted: false });
                setInvalidPassword(false);
                showPasswordPrompt({ show: false });
                clearTimeout(interval1 as NodeJS.Timeout);
                clearTimeout(interval2 as NodeJS.Timeout);
              }}
            >
              Try again?
            </button>
          </div>
        )}
        {!invalidPassword && formValues.decrypted && (
          <div className="text-sm text-green-500 flex items-center gap-6">
            <span className="flex items-center gap-2 text-green-500">
              <ExclamationCircleIcon className="w-4 h-4" />
              This entry is decrypted and ready to be copied!
            </span>
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
