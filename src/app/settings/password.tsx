"use client";

import { FormEvent, useEffect, useState } from "react";
import { AES } from "crypto-js";
import { SessionWithId } from "../types";
import usePasswordValidation from "hooks/usePassworsValidation";
import useForm from "hooks/useForm";
import useAlert from "hooks/useAlert";

export default function Password({ session }: { session: SessionWithId }) {
  const alert = useAlert();

  const { formValues, setFormValues, handleChange } = useForm({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { newPassword, confirmPassword, oldPassword } = formValues;
  const { isValid, isMatching, PasswordRequirements } = usePasswordValidation(
    newPassword,
    confirmPassword
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // check all fields if empty
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert.showAlert("Please fill all fields", false);
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

    if (json.ok) {
      alert.showAlert(json.message, true);
      setFormValues({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      alert.showAlertForSeconds(json.message, 5, false);
    }
  }

  return (
    <div className="py-4 px-4 flex flex-col w-full rounded-md h-full transition-all ease-in-out duration-100">
      <form
        className="flex-col space-y-2 p-4 w-[16rem] lg:w-[24rem] text-[15.5px] leading-relaxed text-gray-500"
        onSubmit={handleSubmit}
      >
        <PasswordRequirements />
        <input hidden={true} autoComplete="username" />
        <label className="block text-md font-medium text-gray-200">
          Old Password
          <span className="text-red-500">*</span>
        </label>
        <input
          value={oldPassword}
          className="py-2 metrix_input"
          placeholder="Old Password"
          name="oldPassword"
          onChange={handleChange}
          autoComplete="current-password"
          type="password"
        />
        <label className="block text-md font-medium text-gray-200 dark:text-textDarkmode">
          New Password
          <span className="text-red-500">*</span>
        </label>
        <input
          value={newPassword}
          className="py-2 metrix_input"
          placeholder="New Password"
          name="newPassword"
          autoComplete="new-password"
          onChange={handleChange}
          type="password"
        />
        <label className="block text-md font-medium text-gray-200 dark:text-textDarkmode">
          Repeat Password
          <span className="text-red-500">*</span>
        </label>
        <input
          value={confirmPassword}
          className="py-2 metrix_input"
          name="confirmPassword"
          placeholder="Repeat Password"
          autoComplete="new-password"
          onChange={handleChange}
          type="password"
        />
        {!isMatching && (
          <p className="text-red-500 mb-6 col-span-3">
            Passwords do not match!
          </p>
        )}
        <div className="flex flex-col mt-10 border-t">
          <button
            className="w-fit px-6 py-2 mt-4 text-white bg-blue-500 rounded-md outline-none disabled:bg-gray-500 ring-offset-2 ring-blue-400 focus:ring-2"
            disabled={!isMatching || !isValid}
            type="submit"
          >
            Save
          </button>
          <alert.AlertComponent className="block mt-3 w-fit border rounded-md mb-2 py-2 px-3" />
        </div>
      </form>
    </div>
  );
}
