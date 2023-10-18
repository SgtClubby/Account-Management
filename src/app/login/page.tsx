"use client";

import useAlert from "hooks/useAlert";
import useForm from "hooks/useForm";
import { signIn, useSession } from "next-auth/react";
import {
  useSearchParams,
  useRouter,
  ReadonlyURLSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginForm() {
  const { data: session, status } = useSession();

  // open redirect
  const searchParams = useSearchParams() as ReadonlyURLSearchParams;
  let redirectUrl = searchParams.get("redirect");
  const openRedirectRegex = new RegExp(/^\/[^\/].*/);
  const [callbackUrl, setCallbackUrl] = useState("/accounts");

  useEffect(() => {
    if (redirectUrl && !redirectUrl.match(openRedirectRegex)) {
      redirectUrl = null;
    }
    if (redirectUrl) {
      setCallbackUrl(redirectUrl);
    }
  }, [redirectUrl]);

  const router = useRouter();
  if (status === "authenticated") {
    router.push(callbackUrl);
  }
  const [loading, setLoading] = useState(false);

  const alert = useAlert();

  const { formValues, setFormValues, handleChange } = useForm({
    username: "",
    password: "",
    code: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert.hideAlert();
    try {
      setLoading(true);
      setFormValues({ username: "", password: "", code: "" });

      const res = await signIn("credentials", {
        username: formValues.username,
        password: formValues.password,
        "2fa-key": formValues.code,
      });

      setLoading(false);

      if (res?.error) {
        return alert.showAlert("Invalid username, password or 2fa code", false);
      }
    } catch (error: any) {
      setLoading(false);
      alert.showAlert(error.message);
    }
  };

  return (
    <div className="lg:fixed lg:left-[50%] lg:top-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%] flex flex-col items-center justify-center h-screen w-full">
      <div className="w-72 md:w-96 justify-center items-center">
        <div className="flex flex-col small:flex-row small:items-center small:justify-center">
          <img
            alt="logo"
            src="/metrixrnd.png"
            className="mx-auto small:mx-0 small:mr-3 mb-6 w-full small:w-20"
          />
          <h1 className="text-gray-200 text-2xl font-extrabold text-center mb-5 sm:text-1xl">
            Account Management
          </h1>
        </div>
      </div>
      <form autoComplete="off" className="w-72 md:w-96" onSubmit={onSubmit}>
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
            type="password"
            name="password"
            value={formValues.password}
            onChange={handleChange}
            placeholder="Password"
            className="metrix_input"
            autoComplete="current-password"
          />
          <label>
            <a
              href="/reset-password"
              className="text-gray-200 text-sm font-semibold mb-2"
            >
              Forgot Password?
            </a>
          </label>
          <alert.AlertComponent className="block py-2 px-3 mt-3" />
        </div>
        <span>
          <p className="text-gray-200 text-sm font-semibold mb-2">
            Two Factor Authentication
          </p>
        </span>
        <div className="mb-6">
          <input
            type="code"
            name="code"
            value={formValues.code}
            onChange={handleChange}
            placeholder="Two Factor Code"
            className="metrix_input"
            autoComplete="off"
            autoCorrect="off"
          />
        </div>
        <button
          type="submit"
          className="inline-block px-7 py-3 bg-metrix-blue text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-metrix-blue-hover hover:shadow-lg focus:bg-metrix-blue-hover focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
          <p className="text-center text-gray-200 font-semibold mx-4 mb-0">
            OR
          </p>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => router.push("/register")}
            disabled={loading}
            className="inline-block px-7 py-3 bg-metrix-blue text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-metrix-blue-hover hover:shadow-lg focus:bg-metrix-blue-hover focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
