"use client";

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
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    tempCheckPassword: "",
  });

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  const [error, setError] = useState("");
  const [alert, setAlert] = useState("");
  const [match, setMatch] = useState<string | null>(null);

  const [satisfiesLG, setsatisfiesLG] = useState(false);
  const [satisfiesLC, setsatisfiesLC] = useState(false);
  const [satisfiesUP, setsatisfiesUP] = useState(false);
  const [satisfiesDI, setsatisfiesDI] = useState(false);
  const [satisfiesSC, setsatisfiesSC] = useState(false);

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
    if (!formValues.tempCheckPassword || !formValues.password) {
      setMatch(null);
      return setMatchingPassword(false);
    }

    if (formValues.password !== formValues.tempCheckPassword) {
      setMatch("Passwords do not match!");
      return setMatchingPassword(false);
    } else {
      setMatch(null);
      return setMatchingPassword(true);
    }
  }, [formValues.tempCheckPassword, formValues.password]);

  const onSubmit = async (e: React.FormEvent) => {
    setError("");
    e.preventDefault();
    try {
      if (!satisfiesAll) {
        setError("Password does not meet requirements!");
        setTimeout(() => {
          setError("");
        }, 5000);

        return;
      }

      setLoading(true);
      // setFormValues({ username: "", email: "", password: "" });

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
        setFormValues({
          username: "",
          email: "",
          password: "",
          tempCheckPassword: "",
        });
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
    "mx-auto form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-metrix-blue focus:outline-none";

  return (
    <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
      <h1 className="text-gray-200 mt-10 text-2xl text-center mb-10 font-extrabold mt:mt-0 md:text-4xl w-72 md:w-96">
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
            className={`${input_style} absolute w-72 md:w-96`}
          />
          <div
            className={`${
              formValues.password.length == 0
                ? "hidden relative mb-6"
                : "relative top-[70px] lg:top-[0px] lg:left-[400px] bg-white border-gray-200 border-2 rounded p-2 text-sm text-gray-700 w-fit py-2 px-4 z-10 shadow-md"
            }`}
          >
            <p className="text-gray-900 mb-2">Password recommendation:</p>
            <ul className="list-disc list-inside">
              <li
                className={`${satisfiesLG ? "text-green-500" : "text-red-500"}`}
              >
                At least 8 characters
              </li>
              <li
                className={`${satisfiesLC ? "text-green-500" : "text-red-500"}`}
              >
                At least one lower case letter
              </li>
              <li
                className={`${satisfiesUP ? "text-green-500" : "text-red-500"}`}
              >
                At least one upper case letter
              </li>
              <li
                className={`${satisfiesDI ? "text-green-500" : "text-red-500"}`}
              >
                At least one digit
              </li>
              <li
                className={`${satisfiesSC ? "text-green-500" : "text-red-500"}`}
              >
                At least one special character
              </li>
            </ul>
          </div>
        </div>
        <div className="mb-20 lg:mb-0"></div>
        <div
          className={
            formValues.password.length == 0
              ? "mt-28 mb-6"
              : "absolute lg:mt-[-85px] w-full"
          }
        >
          <input
            required
            type="password"
            name="tempCheckPassword"
            value={formValues.tempCheckPassword}
            onChange={handleChange}
            placeholder="Repeat Password"
            className={`${input_style}`}
          />
        </div>
        <div
          className={
            formValues.password.length == 0
              ? ""
              : "lg:mt-0 mt-40 small:grid small:grid-cols-[1fr_0.2fr_1fr] small:grid-rows-2"
          }
        >
          {match && <p className="text-red-500 mb-6 col-span-3">{match}</p>}
          <button
            type="submit"
            className={classNames(
              `inline-block px-7 py-4 bg-metrix-blue text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-metrix-blue-hover hover:shadow-lg focus:bg-metrix-blue-hover focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full`
            )}
            disabled={loading}
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
            disabled={loading}
            className="inline-block px-7 py-4 bg-white text-gray-900 text-center font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-metrix-blue-hover hover:shadow-lg focus:bg-metrix-blue-hover focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
