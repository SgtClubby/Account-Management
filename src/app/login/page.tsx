"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import {
  useSearchParams,
  useRouter,
  ReadonlyURLSearchParams,
} from "next/navigation";
import { ChangeEvent, useState } from "react";

export default function LoginForm() {
  const { data: session, status } = useSession();

  const router = useRouter();
  if (status === "authenticated") {
    router.push("/accounts");
  }
  const [loading, setLoading] = useState(false);

  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
    code: "",
  });

  const [error, setError] = useState("");

  const searchParams = useSearchParams() as ReadonlyURLSearchParams;
  const callbackUrl = "/accounts";

  const onSubmit = async (e: React.FormEvent) => {
    setError("");
    e.preventDefault();
    try {
      setLoading(true);
      setFormValues({ username: "", password: "", code: "" });

      const res = await signIn("credentials", {
        redirect: false,
        username: formValues.username,
        password: formValues.password,
        "2fa-key": formValues.code,
        callbackUrl,
      });

      setLoading(false);

      if (!res?.error) {
        router.push(callbackUrl);
      } else {
        setError("Invalid username, password or 2fa code");
      }
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const input_style =
    "mx-auto form-control block px-4 py-3 text-sm w-full font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-metrix-blue focus:outline-none";

  return (
    <div className="lg:fixed lg:left-[50%] lg:top-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%] flex flex-col items-center justify-center h-screen w-full">
      <div className="w-72 md:w-96 justify-center items-center">
        <div className="flex flex-col small:flex-row small:items-center small:justify-center">
          <img
            alt="logo"
            src="/metrixrnd.png"
            className="mx-auto small:mx-0 small:mr-3 mb-6 w-full hidden md:block small:w-20"
          />
          <h1 className="text-gray-200 text-2xl font-extrabold text-center mb-5 sm:text-1xl">
            Account Management
          </h1>
        </div>
      </div>
      <form autoComplete="off" className="w-72 md:w-96" onSubmit={onSubmit}>
        {error && (
          <p className="text-center bg-red-300 py-4 mb-6 rounded">{error}</p>
        )}
        <div className="mb-6">
          <input
            required
            type="username"
            name="username"
            value={formValues.username}
            onChange={handleChange}
            placeholder="Username"
            className={`${input_style}`}
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
            className={`${input_style}`}
            autoComplete="off"
            autoCorrect="off"
          />
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
            className={`${input_style}`}
            autoComplete="off"
            autoCorrect="off"
          />
        </div>
        <button
          type="submit"
          // style={{ backgroundColor: `${loading ? "#ccc" : "#3446eb"}` }}
          className="inline-block px-7 py-3 bg-metrix-blue text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-metrix-blue-hover hover:shadow-lg focus:bg-metrix-blue-hover focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
          disabled={loading}
        >
          {loading ? "loading..." : "Sign In"}
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
