"use client";

import useAlert from "hooks/useAlert";
import useForm from "hooks/useForm";
import { useEffect, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import usePasswordValidation from "hooks/usePassworsValidation";
import { useRouter } from "next/navigation";

export default function PasswordRecovery({
  params,
}: {
  params: { slug: string };
}) {
  const { showAlert, AlertComponent } = useAlert();

  const router = useRouter();

  const { formValues, setFormValues, handleChange } = useForm({
    password: "",
    confirmPassword: "",
  });

  const [valid, setValid] = useState("pending");
  const [loading, setLoading] = useState(false);

  const { password, confirmPassword } = formValues;
  const { isMatching, isValid, PasswordRequirements } = usePasswordValidation(
    password,
    confirmPassword
  );

  async function checkToken() {
    try {
      const res = await fetch("/api/recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: params?.slug }),
      });

      const data = await res.json();

      if (data?.ok) {
        setValid("valid");
      } else {
        setValid("invalid");
      }
    } catch (error: any) {
      showAlert(error.message, false);
    }
  }

  useEffect(() => {
    checkToken();
  }, []);

  async function onSubmit(e: any) {
    e.preventDefault();

    if (!isMatching) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: params?.slug,
          newPassword: formValues.password,
        }),
      });

      const data = await res.json();

      if (data?.ok) {
        showAlert(
          "Password reset successful! You will be redirected shortly...",
          true
        );
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (error: any) {
      showAlert(error.message, false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
      <div className="w-96 mt-3">
        {valid === "pending" && (
          <div className="w-64 md:w-96">
            <div className="flex w-full mb-10 text-9xl items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-12 w-12 text-white text-center mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h1 className="text-gray-200 text-2xl font-extrabold text-center mb-5 sm:text-3xl">
              Verifying...
            </h1>
            <p className="text-gray-200 text-center mb-5">
              Please wait while we verify your token!
            </p>
          </div>
        )}
        {valid === "invalid" && (
          <div className="w-64 md:w-96">
            <div className="flex w-full mb-7 text-9xl">
              <CancelIcon
                fontSize="inherit"
                className="text-red-500 text-2xl mx-auto"
              />
            </div>
            <h1 className="text-gray-200 text-2xl font-extrabold text-center mb-5 sm:text-3xl">
              Error!
            </h1>
            <p className="text-gray-200 text-center mb-5">
              Invalid token! <br />
            </p>
            <div className="space-y-5">
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  window.close();
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
        {valid === "valid" && (
          <form className="" onSubmit={onSubmit}>
            <PasswordRequirements
              arrow={true}
              className="absolute lg:left-[24.8rem] lg:top-[4.7rem] top-[9rem] w-60 ml"
            />
            <div className="text-2xl font-bold text-gray-200 mb-6">
              Recover your password
            </div>
            <div className="mb-6">
              <input
                required
                type="password"
                name="password"
                value={formValues.password}
                onChange={handleChange}
                placeholder="New password"
                className="metrix_input"
                autoComplete="new-password"
              />
            </div>
            <div
              className={`${
                password.length == 0 ? "mt-0" : "lg:mt-0 mt-44"
              } mb-6`}
            >
              <input
                required
                type="password"
                name="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat New Password"
                className="metrix_input"
                autoComplete="new-password"
              />
            </div>
            <div className="mt-6">
              {!isMatching && (
                <p className="text-red-500 mb-6 col-span-3">
                  Passwords do not match!
                </p>
              )}
              <button
                type="submit"
                className={`inline-block px-7 py-4 bg-metrix-blue text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-metrix-blue-hover hover:shadow-lg focus:bg-metrix-blue-hover focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full`}
                disabled={loading || !isMatching || !isValid}
              >
                {loading ? "loading..." : "Reset Password"}
              </button>
              <AlertComponent className="w-full flex py-1 px-2 border text-center border-green-300 rounded-md mt-4 text-gray-700" />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
