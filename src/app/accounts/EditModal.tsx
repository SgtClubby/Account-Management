"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { AES } from "crypto-js";
import useAlert from "hooks/useAlert";
import useRefresh from "hooks/useRefresh";
import { encrypt, encryptFields, encryptFiles } from "lib/functions";
import InputBox from "./InputBox";
import DeleteIcon from "@mui/icons-material/Delete";
import useForm from "hooks/useForm";
import {
  InputBoxStateProps,
  SubmittedAccountProps,
  UploadedFileProps,
} from "../types";
import { InformationCircleIcon } from "@heroicons/react/20/solid";

export default function EditModal({
  editModal,
  showEditModal,
  session,
}: {
  editModal: any;
  showEditModal: any;
  session: any;
}) {
  // Master password state
  const [selectedMasterPassword, setSelectedMasterPassword] = useState("");

  // Reset form values states when modal is closed or opened

  useEffect(() => {
    if (editModal.show) {
      setFormValues({ username: "", password: "", fields: [] });
      setInputs([]);
      setNewFieldName("");
      setFile(null);
      setFileKey(Math.random().toString(36));
      setUploadedFiles([]);
    }
  }, [editModal.show]);

  // Form submission state

  const { formValues, setFormValues, handleChange } =
    useForm<SubmittedAccountProps>({
      username: "",
      password: "",
      fields: [],
    });

  // Hooks

  const alert = useAlert();
  const { refresh, refreshState } = useRefresh();

  // Form submission

  async function handleSubmit(e: any) {
    e.preventDefault();

    const body = {
      username: formValues.username,
      encPassword: encrypt(formValues.password, selectedMasterPassword),
      fields: encryptFields(inputs, selectedMasterPassword),
      files: encryptFiles(uploadedFiles, selectedMasterPassword),
    };

    const res = await fetch("/api/accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (json.error) {
      alert.showAlert(json.error);
    } else {
      setSelectedMasterPassword("");
      showEditModal({ show: false });
      refreshState();
      alert.showAlertForSeconds("Account added!", 5);
    }
  }

  // Input boxes

  const [inputs, setInputs] = useState<InputBoxStateProps[]>([]);
  const [newFieldName, setNewFieldName] = useState("");

  const addInput = () => {
    if (newFieldName !== "") {
      // Only add new input if the new field name is not empty
      // Find the highest id, to ensure no duplicates
      // (might result in uneven ids if some inputs are deleted, but it doesn't matter since the ids are only used as react keys and state)
      const highestId = inputs.reduce((acc, curr) => {
        if (parseInt(curr.id) > acc) {
          return parseInt(curr.id);
        }
        return acc;
      }, 0);
      setInputs([
        ...inputs,
        { id: `${highestId + 1}`, value: "", name: newFieldName },
      ]);
      setNewFieldName(""); // Reset the field name input for next input
    } else {
      alert.showAlertForSeconds("Field name cannot be empty", 5, false);
    }
  };

  const deleteInput = (id: string) => {
    const index = inputs.findIndex((input) => input.id === id);
    // remove the index from inputs
    const newInputs = [...inputs];
    newInputs.splice(index, 1);

    setInputs(newInputs);
  };

  const onChange = (id: string, newValue: string) => {
    setInputs(
      inputs.map((input) =>
        input.id === id ? { ...input, value: newValue } : input
      )
    );
  };

  // File upload
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(Math.random().toString(36));
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileProps[]>([]);
  const uploadFile = () => {
    if (file !== null) {
      const reader = new FileReader();

      reader.readAsDataURL(file);
      console.log(file);

      reader.onloadend = function (e) {
        console.log(reader.result);
        if (reader.result === null) {
          return;
        }

        if (file.size > 10000000) {
          alert.showAlertForSeconds(
            "File cannot be larger than 10MB",
            5,
            false
          );
          return;
        }

        setUploadedFiles([
          ...uploadedFiles,
          {
            id: (Math.random() * 100).toFixed(0) + "",
            fileName: file.name,
            size: file.size,
            type: file.type,
            data: reader.result as string,
          },
        ]);
      };
    }

    setFile(null);
    setFileKey(Math.random().toString(36));
  };

  const deleteFile = (id: string) => {
    const index = uploadedFiles.findIndex((file) => file.id === id);
    // remove the index from inputs
    const newFileArray = [...uploadedFiles];
    newFileArray.splice(index, 1);

    setUploadedFiles(newFileArray);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]); // You could also use a FileList here if you're expecting multiple files
    }
  };

  return (
    <>
      {alert.data.show && (
        <div
          className={`${
            alert.data.type
              ? "border-green-400 bg-green-100"
              : "border-red-400 bg-red-100"
          } fixed z-[55] border px-4 py-3 rounded w-fit right-0 left-0 m-auto`}
        >
          <span
            className={`${
              alert.data.type ? "text-green-500" : "text-red-500"
            } block sm:inline`}
          >
            {alert.data.message}
          </span>
        </div>
      )}
      {editModal.show && session ? (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 w-full h-full bg-black opacity-40"
            onClick={() => showEditModal({ show: false, steamid: false })}
          />
          <div className="flex items-center min-h-screen px-4 py-8">
            <div className="relative w-full max-w-lg mx-auto bg-metrix-blue-background dark:bg-bgDarkmode rounded-md shadow-lg">
              <div className="flex items-center justify-between p-4 border-b">
                <h4 className="text-xl font-bold text-gray-200 flex flex-row items-center dark:text-textDarkmode">
                  New Account
                </h4>
                <button
                  className="p-2 text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => showEditModal({ show: false, steamid: false })}
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
                    <div className="mb-6 space-y-2 text-[15.5px] leading-relaxed text-gray-500">
                      <h1 className="text-gray-200 text-lg font-medium">
                        Main Fields
                      </h1>
                      <label className="block text-md font-medium text-gray-200 dark:text-textDarkmode">
                        Username
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="username"
                        value={formValues.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="h-auto block w-full px-3 py-2 text-gray-900 border rounded-md shadow-md focus:ring-blue-500 focus:border-blue-500 sm:text-md"
                      />
                      <label className="block text-md font-medium text-gray-200 dark:text-textDarkmode">
                        Password
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="password"
                        name="password"
                        value={formValues.password}
                        onChange={handleChange}
                        placeholder="Password"
                        autoComplete="new-password"
                        className="h-auto block w-full px-3 py-2 text-gray-900 border rounded-md shadow-md focus:ring-blue-400 focus:border-blue-400 sm:text-md"
                      />
                    </div>
                    <div className="space-y-2 text-[15.5px] leading-relaxed text-gray-500">
                      <h1 className="text-gray-200 text-lg font-medium">
                        Optional Fields
                        <InformationCircleIcon
                          className="cursor-help ml-2 w-5 h-5 inline-block text-gray-200 dark:text-textDarkmode"
                          title="Used for additional information or metadata, such as email, phone number, etc."
                        />
                      </h1>
                      {/* Render existing input fields */}
                      {inputs.map((input) => (
                        <div
                          key={input.id}
                          className="flex flex-row items-center space-x-3"
                        >
                          <InputBox
                            id={input.id}
                            value={input.value}
                            name={input.name}
                            onChange={onChange}
                          />
                          <DeleteIcon
                            onClick={() => deleteInput(input.id)}
                            className="text-red-500 mt-8"
                          />
                        </div>
                      ))}
                      {/* Add new field name input here */}
                      <div className="flex flex-row items-center space-x-3">
                        <input
                          className="h-auto block w-48 px-2 py-1 text-gray-900 border rounded-md shadow-md focus:ring-blue-400 focus:border-blue-400 sm:text-md"
                          value={newFieldName}
                          onChange={(e) => setNewFieldName(e.target.value)}
                          placeholder="Field name"
                        />
                        <button
                          type="button"
                          className="text-gray-200 px-2 py-1 border border-metrix-blue rounded-md outline-none ring-offset-2 ring-blue-400 focus:ring-2"
                          onClick={addInput}
                        >
                          Add field
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 text-[15.5px] leading-relaxed text-gray-500">
                      <h1 className="text-gray-200 text-lg font-medium mt-6">
                        Files
                      </h1>
                      <div className="flex flex-row items-center space-x-3">
                        <input
                          className="h-auto block w-fit px-2 py-1 text-gray-200 border rounded-md shadow-md text- focus:ring-blue-400 focus:border-blue-400 sm:text-md"
                          type="file"
                          accept="video/*,image/*,text/*,application/*"
                          key={fileKey}
                          onChange={handleFileChange}
                        />
                        <button
                          type="button"
                          className="text-gray-200 px-2 py-1 border border-metrix-blue rounded-md outline-none ring-offset-2 ring-blue-400 focus:ring-2"
                          onClick={uploadFile}
                        >
                          Upload
                        </button>
                      </div>
                      {uploadedFiles.map((file) => (
                        <div className="flex flex-col w-full space-y-2 text-[15.5px] leading-relaxed">
                          <div
                            key={file.id}
                            className="flex flex-row items-center space-x-3 mt-2"
                          >
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
                            <DeleteIcon
                              onClick={() => deleteFile(file.id)}
                              className="text-red-500"
                            />
                          </div>
                        </div>
                      ))}
                      {uploadedFiles.length === 0 && (
                        <div className="flex flex-row items-center space-x-3 mt-2">
                          <label className="block text-sm font-medium text-gray-200">
                            No files uploaded
                          </label>
                        </div>
                      )}
                    </div>

                    <div className="mt-3">
                      <label className="block text-md font-medium text-gray-200 dark:text-textDarkmode mt-6">
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
                        autoComplete="new-password"
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
                        showEditModal({ show: false, steamid: false })
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
