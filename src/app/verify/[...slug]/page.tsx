"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export default function SuccessVerify({
  params,
}: {
  params: { slug: any | any[] };
}) {
  const router = useRouter();

  const id = params.slug[0];
  const token = params.slug[1];

  const [verified, setVerified] = useState<Boolean | null>(null);
  const [loading, setLoading] = useState<Boolean>(true);
  useEffect(() => {
    async function verify() {
      const res = await fetch(`/api/verify`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          id,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setVerified(true);
        setLoading(false);
      } else {
        setVerified(false);
        setLoading(false);
      }
    }
    verify();
  }, []);

  return (
    <>
      {loading && (
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
              Please wait while we verify your email address...
            </p>
          </div>
        </div>
      )}
      {verified === true && !loading && (
        <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
          <div className="w-64 md:w-96">
            <div className="flex w-full mb-10 text-9xl">
              <CheckCircleIcon
                fontSize="inherit"
                className="text-green-500 text-2xl mx-auto"
              />
            </div>
            <h1 className="text-gray-200 text-2xl font-extrabold text-center mb-5 sm:text-3xl">
              Success!
            </h1>
            <p className="text-gray-200 text-center mb-5">
              You have successfully verified your email address. <br />
              You can safely close this window.
            </p>
            <div className="space-y-5">
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  router.push("/login");
                }}
              >
                Manage Accounts
              </button>
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
      {!verified === true && !loading && (
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
              Invalid verification link. <br />
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
    </>
  );
}
