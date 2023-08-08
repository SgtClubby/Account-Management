"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [alert, setAlert] = useState("");

  const callbackUrl = "/accounts";

  const onSubmit = async (e: React.FormEvent) => {
    setError("");
    e.preventDefault();
    try {
      setLoading(true);
      setFormValues({ username: "", email: "", password: "" });

      const register = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });
      const registerJson = await register.json();

      setLoading(false);

      if (registerJson?.ok) {
        setAlert(registerJson?.message);
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
            setError("Something went wrong! Log in again.");
          }
        }, 2000);
      } else {
        setError(registerJson?.message);
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
    "mx-auto form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none";

  return (
    <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
      <h1 className="text-gray-200 text-2xl text-center mb-10 font-extrabold sm:text-3xl">
        Register new account
      </h1>
      <form className="w-72 md:w-96" onSubmit={onSubmit}>
        {error && (
          <p className="text-center bg-red-300 py-4 mb-6 rounded">{error}</p>
        )}
        {alert && (
          <p className="text-center bg-green-300 py-4 mb-6 rounded">{alert}</p>
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
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="Email"
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
        <button
          type="submit"
          className="inline-block px-7 py-4 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
          disabled={loading}
        >
          {loading ? "loading..." : "Register"}
        </button>
      </form>
      <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
        <p className="text-center text-gray-200 font-semibold mx-4 mb-0">OR</p>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => router.push("/login")}
          disabled={loading}
          className="inline-block px-7 py-4 bg-blue-600 text-white text-center font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
        >
          Back
        </button>
      </div>
    </div>
  );
}
