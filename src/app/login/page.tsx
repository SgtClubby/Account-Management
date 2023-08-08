"use client";

import { signIn, useSession } from "next-auth/react";
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
    "mx-auto form-control block w-full px-4 py-3 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";

  return (
    <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
      <div className="w-72 md:w-96">
        <img src="/jett.png" className="w-56 sm:w-96 mx-auto mb-6" />
        <h1 className="text-gray-200 text-2xl font-extrabold text-center mb-5 sm:text-3xl">
          Account Management
        </h1>
      </div>
      <form className="w-72 md:w-96" onSubmit={onSubmit}>
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
          />
        </div>
        <button
          type="submit"
          // style={{ backgroundColor: `${loading ? "#ccc" : "#3446eb"}` }}
          className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
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
            onClick={() => router.push("/register")}
            disabled={loading}
            className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
