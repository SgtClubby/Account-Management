"use client";

import useAlert from "hooks/useAlert";
import useForm from "hooks/useForm";
import usePasswordValidation from "hooks/usePassworsValidation";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

export default function LoginForm() {
  const { data: session, status } = useSession();

  const router = useRouter();
  if (status === "authenticated") {
    router.push("/accounts");
  }
  const [loading, setLoading] = useState(false);

  const { formValues, setFormValues, handleChange } = useForm({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const alert = useAlert();

  const { password, confirmPassword } = formValues;
  const { isMatching, isValid, PasswordRequirements } = usePasswordValidation(
    password,
    confirmPassword
  );

  const sendRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const callbackUrl = "/accounts";
    setLoading(true);

    const register = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues),
    });

    const registerJson = await register.json();

    setLoading(false);

    if (registerJson?.ok) {
      alert.showAlert(registerJson.message, true);
      setTimeout(async () => {
        const res = await signIn("credentials", {
          redirect: false,
          username: formValues.username,
          password: formValues.password,
          callbackUrl,
        });

        if (!res?.error) {
          router.push(callbackUrl);
        } else {
          alert.showAlert(res.error, false);
        }
      }, 2000);
    } else {
      alert.showAlert(registerJson.message, false);
    }
  };

  return (
    <>
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <h1 className="text-gray-200 mt-10 text-2xl text-center mb-10 font-extrabold mt:mt-0 md:text-4xl w-72 md:w-96">
          Register new account
        </h1>
        <form className="w-72 md:w-96 " onSubmit={sendRegister}>
          <PasswordRequirements
            arrow={true}
            className="absolute lg:left-[24.8rem] lg:top-[18.3rem] top-[23rem] w-60 ml"
          />
          <div className="mb-6">
            <input
              required
              type="username"
              name="username"
              value={formValues.username}
              onChange={handleChange}
              placeholder="Username"
              className="metrix_input"
              autoComplete="username"
            />
          </div>
          <div className="mb-6">
            <input
              required
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
              placeholder="Email"
              autoComplete="email"
              className="metrix_input"
            />
          </div>
          <div className="mb-6">
            <input
              required
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
              placeholder="Password"
              autoComplete="new-password"
              className="metrix_input"
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
              autoComplete="new-password"
              value={formValues.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat Password"
              className="metrix_input"
            />
          </div>
          <alert.AlertComponent className="block border rounded-md mb-2 py-2 px-3" />
          <div className="lg:mt-0 small:grid small:grid-cols-[1fr_0.2fr_1fr] small:grid-rows-2">
            {!isMatching && (
              <p className="text-red-500 mb-6 col-span-3">
                Passwords do not match!
              </p>
            )}
            <button
              type="submit"
              className="inline-block px-7 py-4 bg-metrix-blue text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-metrix-blue-hover hover:shadow-lg focus:bg-metrix-blue-hover focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
              disabled={loading || !isMatching || !isValid}
            >
              {loading ? "loading..." : "Register"}
            </button>
            <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
              <p className="text-center text-gray-200 font-semibold mx-4 mb-0">
                OR
              </p>
            </div>
            <button
              onClick={() => router.push("/login")}
              type="button"
              className="inline-block px-7 py-4 bg-white text-gray-900 text-center font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-metrix-blue-hover hover:shadow-lg focus:bg-metrix-blue-hover focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
