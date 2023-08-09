"use client";

import { use, useEffect, useState } from "react";
import { AES } from "crypto-js";
import { get } from "http";
import { SessionWithId } from "../types";

export default function TwoFactorModal({
  twoFactorModal,
  showTwoFactorModal,
  session,
}: {
  twoFactorModal: { show: boolean };
  showTwoFactorModal: Function;
  session: SessionWithId;
}) {
  const [error, setError] = useState({ show: false, message: "", type: false });
  const [verified, setVerified] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [generatedTwoFactorCode, setGeneratedTwoFactorCode] = useState<any>("");

  useEffect(() => {
    setGeneratedTwoFactorCode("");
    setVerified(false);
    setTwoFactorCode("");

    async function getTwoFactorCode() {
      const res = await fetch("/api/2fa/generate2fa", {
        method: "GET",
      });

      const data = await res.json();

      if (data.ok) {
        setVerified(true);
        setError({
          show: true,
          message: "You are already protected with 2fa!",
          type: true,
        });
        return;
      }

      if (data.error) {
        setError({ show: true, message: data.error, type: false });
        return;
      }

      setGeneratedTwoFactorCode(data);
    }
    if (session && twoFactorModal.show) getTwoFactorCode();
  }, [twoFactorModal.show]);

  async function checkCode() {
    if (!twoFactorCode) {
      setError({
        show: true,
        message: "Please enter a valid code",
        type: false,
      });
      return;
    }

    const res = await fetch("/api/2fa/verify2fa", {
      method: "POST",
      body: JSON.stringify({
        id: session?.user?.id,
        token: twoFactorCode,
        secret: generatedTwoFactorCode.secret,
      }),
    });

    const data = await res.json();

    if (data.verified) {
      setVerified(true);
      setError({
        show: true,
        message: "Success! You are now protected!",
        type: true,
      });
      return;
    } else {
      setError({ show: true, message: "Invalid code", type: false });
      return;
    }
  }

  return (
    <>
      {twoFactorModal.show && session ? (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 w-full h-full bg-black opacity-40"
            onClick={() => showTwoFactorModal({ show: false })}
          />
          <div className="flex items-center min-h-screen px-4 py-8">
            <div className="relative w-full max-w-lg mx-auto bg-gray-900 dark:bg-bgDarkmode rounded-md shadow-lg">
              <div className="flex items-center justify-between p-4 border-b">
                <h4 className="text-xl font-bold text-gray-200 flex flex-row items-center dark:text-textDarkmode">
                  Set up 2FA
                </h4>
                <button
                  className="p-2 text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() =>
                    showTwoFactorModal({ show: false, steamid: false })
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mx-auto"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div>
                <div className="space-y-2 p-4 mt-3 text-[15.5px] leading-relaxed text-gray-500">
                  {!verified ? (
                    <>
                      <h1 className="text-gray-200 text-lg">
                        Scan the QR code below with your authenticator app
                      </h1>
                      <img
                        className="mb-5 mx-auto h-56 aspect-square"
                        src={generatedTwoFactorCode.qr_code}
                      />
                      <p className="text-gray-200 text-sm">Secret:</p>
                      <p className="text-gray-200 text-sm">
                        {generatedTwoFactorCode.secret}
                      </p>
                      <label className="mt-5 block text-md font-medium text-gray-200 dark:text-textDarkmode">
                        Enter code from your authenticator app
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="h-auto block w-full px-3 py-2 text-gray-900 border rounded-md shadow-md focus:ring-blue-500 focus:border-blue-500 sm:text-md"
                        placeholder="Code"
                        onChange={(e) => setTwoFactorCode(e.target.value)}
                        type="text"
                      />
                    </>
                  ) : (
                    <></>
                  )}
                  {error.type ? (
                    <p className="text-green-500">{error.message}</p>
                  ) : (
                    <p className="text-red-500">{error.message}</p>
                  )}
                </div>
                <div className="flex items-center gap-3 p-4 mt-5 border-t">
                  {!verified ? (
                    <button
                      className="px-6 py-2 text-white bg-blue-500 rounded-md outline-none ring-offset-2 ring-blue-400 focus:ring-2"
                      onClick={() => checkCode()}
                    >
                      Check Code
                    </button>
                  ) : (
                    <></>
                  )}
                  <button
                    className="px-6 py-2 text-gray-200 border rounded-md outline-none dark:text-textDarkmode ring-offset-2 ring-blue-400 focus:ring-2"
                    onClick={() => showTwoFactorModal({ show: false })}
                  >
                    {verified ? "Close" : "Cancel"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
