"use client";

import useAlert from "hooks/useAlert";
import useForm from "hooks/useForm";
import { useRouter } from "next/navigation";

export default function PasswordRecovery() {
  const { formValues, setFormValues, handleChange } = useForm({
    email: "",
  });

  const { showAlert, AlertComponent } = useAlert();

  async function Submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetch("/api/recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      showAlert("If the email exists, you will receive a reset link!", true);
    } catch (error: any) {
      showAlert(error.message, false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-2xl font-bold text-gray-200">
        Recover your password
      </div>
      <AlertComponent className="flex py-1 px-2 border border-green-300 rounded-md mt-2 text-gray-700" />

      <div className="w-96 mt-3">
        <form onSubmit={Submit}>
          <label className="block text-md font-medium text-gray-200">
            Email
            <span className="text-red-500">*</span>
          </label>
          <input
            required
            onChange={handleChange}
            name="email"
            value={formValues.email}
            className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
          />
          <p className="mt-2 text-gray-300">
            Enter your email and we'll send you a reset link
          </p>

          <button className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
