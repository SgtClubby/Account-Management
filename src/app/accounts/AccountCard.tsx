"use client";

import {
  ChangeEvent,
  ChangeEventHandler,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { decrypt } from "lib/functions";
import { Account, Field, UploadedFileProps } from "../types";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import useAlert from "hooks/useAlert";
import useForm from "hooks/useForm";
import useRefresh from "hooks/useRefresh";

function AccountCard({ account, idx }: { account: Account; idx: number }) {
  const [passwordPrompt, showPasswordPrompt] = useState({ show: false });
  const [decryptedPassword, setDecryptedPassword] = useState("");
  const [decryptedFields, setDecryptedFields] = useState<Field[]>([]);
  const [decryptedFiles, setDecryptedFiles] = useState<UploadedFileProps[]>([]);
  const [invalidPassword, setInvalidPassword] = useState(false);

  const [interval1, setInterval1] = useState<NodeJS.Timeout | null>(null);
  const [interval2, setInterval2] = useState<NodeJS.Timeout | null>(null);

  const alert = useAlert();
  const { refresh, refreshState } = useRefresh();
  const { formValues, setFormValues, handleChange } = useForm({
    decrypted: false,
    masterPassword: "",
  });

  async function deleteAccount(username: string) {
    await fetch("/api/accounts", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
      }),
    }).then(async (res) => {
      alert.showAlertForSeconds("Account deleted", 3);
      refreshState();
    });
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
        setFormValues({ masterPassword: "", decrypted: false });
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
      let decryptedPassword = "";

      try {
        decryptedPassword = decrypt(
          account.password,
          formValues.masterPassword
        );
      } catch (e) {
        decryptedPassword = "Incorrect password";
        setInvalidPassword(true);
      }

      if (decryptedPassword === "") {
        decryptedPassword = "Incorrect password";
        setInvalidPassword(true);
      }

      setDecryptedPassword(decryptedPassword);

      if (account.fields) {
        setDecryptedFields([]);
        account.fields.forEach((field: Field) => {
          let decryptedName = "";
          let decryptedValue = "";

          try {
            decryptedName = decrypt(field.name, formValues.masterPassword);
            decryptedValue = decrypt(field.value, formValues.masterPassword);
            setDecryptedFields((decryptedField) => [
              ...decryptedField,
              { name: decryptedName, value: decryptedValue, id: field.id },
            ]);
          } catch (e) {
            decryptedPassword = "Incorrect password";
            setInvalidPassword(true);
          }
        });
      }

      if (account.files) {
        setDecryptedFiles([]);
        account.files.forEach((file: UploadedFileProps) => {
          let decryptedData = "";

          try {
            decryptedData = decrypt(file.data, formValues.masterPassword);
            setDecryptedFiles((decryptedFile) => [
              ...decryptedFile,
              { ...file, data: decryptedData },
            ]);
          } catch (e) {
            decryptedPassword = "Incorrect password";
            setInvalidPassword(true);
          }
        });
      }
    }
  }, [formValues.decrypted]);

  useEffect(() => {
    showPasswordPrompt({ show: false });
    clearTimeout(interval1 as NodeJS.Timeout);
    clearTimeout(interval2 as NodeJS.Timeout);
  }, [invalidPassword]);

  return (
    <li
      key={idx}
      className="px-4 py-3 duration-150 hover:border-gray-700 hover:rounded-xl hover:bg-gray-700 w-full"
    >
      <a key={idx} href={account.id} className="space-y-3">
        <div className="flex items-center gap-x-3">
          <div>
            <span className="block text-indigo-200 text-xl font-medium">
              {account.username}
            </span>
            {/* Delete button */}
          </div>
          <div className="flex items-center gap-2 ml-auto">
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
            className={`${
              invalidPassword ? "hidden" : "block"
            } inline-block px-2 py-1 bg-blue-600 text-white font-medium text-xs leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-fit`}
          >
            Click to reveal password
          </button>
        ) : (
          <div
            key={idx}
            className="flex-row text-md text-gray-200 flex items-center gap-6"
          >
            {formValues.decrypted && !invalidPassword ? (
              <div className="flex flex-col">
                <h1 className="text-gray-200 text-lg">Password:</h1>
                <div className="flex items-center gap-5">
                  <span className="text-gray-300">{decryptedPassword}</span>
                  <ContentCopyIcon
                    className="text-gray-300 cursor-pointer"
                    onClick={() => {
                      navigator.clipboard.writeText(decryptedPassword);
                    }}
                  />
                  {/* hide button clears interval*/}
                  <button
                    className="inline-block px-3 py-1 m-0 bg-blue-600 text-white font-medium text-xs leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-fit"
                    onClick={() => {
                      setFormValues({ masterPassword: "", decrypted: false });
                      setDecryptedPassword("");
                      setDecryptedFields([]);
                      showPasswordPrompt({ show: false });
                      clearTimeout(interval1 as NodeJS.Timeout);
                      clearTimeout(interval2 as NodeJS.Timeout);
                    }}
                  >
                    Hide
                  </button>
                </div>
                <div className="flex-col flex mt-5">
                  <h1 className="text-gray-200 text-lg mb-2">Fields:</h1>
                  {decryptedFields.map((field: Field, idx: number) => {
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="text-gray-300 text-md font-medium mb-1">
                            {field.name}
                            {field.name.endsWith(":") ? "" : ":"}
                          </span>
                          <span className="text-gray-300 text-sm mb-5">
                            {field.value}
                          </span>
                        </div>
                        <ContentCopyIcon
                          className="text-gray-300 cursor-pointer ml-3"
                          onClick={() => {
                            navigator.clipboard.writeText(field.value);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex-col flex mt-5">
                  <h1 className="text-gray-200 text-lg mb-2">Fields:</h1>
                  {decryptedFields.map((field: Field, idx: number) => {
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="text-gray-300 text-md font-medium mb-1">
                            {field.name}
                            {field.name.endsWith(":") ? "" : ":"}
                          </span>
                          <span className="text-gray-300 text-sm mb-5">
                            {field.value}
                          </span>
                        </div>
                        <ContentCopyIcon
                          className="text-gray-300 cursor-pointer ml-3"
                          onClick={() => {
                            navigator.clipboard.writeText(field.value);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="flex-col flex mt-5">
                  <h1 className="text-gray-200 text-lg mb-2">Files:</h1>
                  {decryptedFiles.map(
                    (file: UploadedFileProps, idx: number) => {
                      return (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="flex flex-col">
                            <div className="flex flex-row items-center space-x-3 mt-2">
                              <label className="block text-md font-medium text-gray-200 dark:text-textDarkmode">
                                {file.fileName}
                              </label>
                              <div className=" h-auto block w-fit px-2 py-1 text-gray-900 border rounded-md shadow-md focus:ring-blue-500 focus:border-blue-500 sm:text-md">
                                <a
                                  href={file.data}
                                  download={file.fileName}
                                  className="text-gray-200 w-fit"
                                >
                                  Download
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
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
              Master Password is incorrect!
            </span>
            <br />
            <button
              className="inline-block px-3 py-1 m-0 bg-blue-600 text-white font-medium text-xs leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-fit"
              onClick={() => {
                setFormValues({ masterPassword: "", decrypted: false });
                setInvalidPassword(false);
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
              This password is decrypted and ready to be copied!
            </span>
          </div>
        )}
      </a>
    </li>
  );
}

export default AccountCard;
