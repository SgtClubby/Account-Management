"use client";

import useAlert from "hooks/useAlert";
import useForm from "hooks/useForm";
import { useEffect, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";

export default function PasswordRecovery({
  params,
}: {
  params: { slug: string };
}) {
  const { showAlert, AlertComponent } = useAlert();

  const { formValues, setFormValues, handleChange } = useForm({
    password: "",
    confirmPassword: "",
  });

  const [valid, setValid] = useState("pending");

  const [match, setMatch] = useState<string | null>(null);

  const [satisfiesLG, setsatisfiesLG] = useState(false);
  const [satisfiesLC, setsatisfiesLC] = useState(false);
  const [satisfiesUP, setsatisfiesUP] = useState(false);
  const [satisfiesDI, setsatisfiesDI] = useState(false);
  const [satisfiesSC, setsatisfiesSC] = useState(false);
  const [loading, setLoading] = useState(false);
  const [satisfiesAll, setsatisfiesAll] = useState(true);
  const callbackUrl = "/accounts";

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
      setsatisfiesAll(true);
    }

    validatePassword(formValues.password);
  }, [formValues.password]);

  const [matchingPassword, setMatchingPassword] = useState(false);
  useEffect(() => {
    if (!formValues.confirmPassword || !formValues.password) {
      setMatch(null);
      return setMatchingPassword(false);
    }

    if (formValues.password !== formValues.confirmPassword) {
      setMatch("Passwords do not match!");
      return setMatchingPassword(false);
    } else {
      setMatch(null);
      return setMatchingPassword(true);
    }
  }, [formValues.confirmPassword, formValues.password]);

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

    if (!matchingPassword) {
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
        showAlert("Password reset successful!", true);
      }
    } catch (error: any) {
      showAlert(error.message, false);
    } finally {
      setLoading(false);
    }
  }

  const input_style =
    "mx-auto form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-metrix-blue focus:outline-none";

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-96 mt-3">
        {valid === "pending" && (
          <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
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
          </div>
        )}
        {valid === "invalid" && (
          <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
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
          </div>
        )}
        {valid === "valid" && (
          <form className="w-72 md:w-96 mx-auto" onSubmit={onSubmit}>
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
                className={`${input_style} `}
              />
            </div>
            <div className="">
              <input
                required
                type="password"
                name="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat New Password"
                className={`${input_style}`}
              />
            </div>
            <div className="mt-6">
              {match && <p className="text-red-500 mb-6 col-span-3">{match}</p>}
              <button
                type="submit"
                className={`inline-block px-7 py-4 bg-metrix-blue text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-metrix-blue-hover hover:shadow-lg focus:bg-metrix-blue-hover focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full`}
                disabled={loading}
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
