"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Dropdown from "./Dropdown";
import { useEffect, useState } from "react";
import AddModal from "./AddModal";
import SyncIcon from "@mui/icons-material/Sync";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Account, User } from "../types";
import AccountCard from "./AccountCard";
import useAlert from "hooks/useAlert";
import useForm from "hooks/useForm";
import useRefresh from "hooks/useRefresh";

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status == "unauthenticated") {
      redirect("/login?redirect=/accounts");
    }
  }, [session, status]);

  const { refresh, refreshState } = useRefresh();

  const [accounts, setAccounts] = useState<Account[]>();
  const [emailVerified, setEmailVerified] = useState<any>(undefined);

  useEffect(() => {
    if (session) {
      setAccounts(undefined);
      Promise.all([fetch("/api/accounts"), fetch("/api/me")]).then(
        ([accountsRes, meRes]) => {
          accountsRes.json().then((data) => {
            setAccounts(data.accounts);
          });
          meRes.json().then((data) => {
            if (!data.user.emailVerified) setEmailVerified(true);
          });
        }
      );
    }
  }, [session, refresh]);

  const alert = useAlert();

  async function resendVerification() {
    const res = await fetch(`/api/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // @ts-ignore
        id: session?.user?.id,
      }),
    });
    const data = await res.json();
    if (data.ok) {
      alert.showAlertForSeconds("Verification email sent!", 5);
    } else {
      alert.showAlertForSeconds(data.message, 5);
    }
  }

  const [addModal, showAddModal] = useState({ show: false });

  const [search, setSearch] = useState("");

  return (
    <section className="py-28">
      <AddModal
        addModal={addModal}
        showAddModal={showAddModal}
        session={session}
      />
      {alert.data.show && (
        <div className="fixed z-[100] bg-green-100 border border-green-400 text-greeb-700 px-4 py-3 rounded w-fit max-w-64 right-0 left-0 m-auto">
          <span className="block sm:inline">{alert.data.message}</span>
        </div>
      )}

      {emailVerified && (
        <div className="fixed flex flex-col z-[100] bg-red-100 border border-red-400 text-sm md:text-md text-gray-800 px-4 py-3 rounded w-80 md:w-fit right-0 left-0 top-5 m-auto">
          <span className="block sm:inline">
            You need to verify your email, please check your inbox or spam
            folder!
          </span>
          <button
            className="text-blue-500 hover:text-blue-600"
            onClick={() => resendVerification()}
          >
            Click here to resend verification email
          </button>
        </div>
      )}

      {/* <button
        className="fixed z-[100] bottom-5 right-5 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          setError({ show: true, message: "Test!" });
        }}
      >
        Morrafookkaa
      </button> */}
      <div className="max-w-screen-lg mx-auto px-4 md:px-8">
        <div className="w-full">
          <h1 className="text-gray-200 mb-5 text-2xl font-extrabold sm:text-3xl">
            Account Management
          </h1>
          <div className="flex flex-row w-full">
            <input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              className="w-[45%] items-center mr-0 px-4 py-2 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              placeholder="Search"
            />
            <AddBoxIcon
              fontSize="large"
              className="text-gray-200 ml-3 h-10 w-10 hover:text-gray-400 cursor-pointer"
              onClick={() => showAddModal({ show: true })}
              titleAccess="Add Account"
            />

            <SyncIcon
              fontSize="large"
              className="text-gray-200 ml-1 mt-[2px] hover:text-gray-400 cursor-pointer"
              onClick={refreshState}
              titleAccess="Refresh list"
            />

            <div className="ml-auto items-center">
              <Dropdown />
            </div>
          </div>
        </div>
        <ul className="mt-8 divide-y space-y-3 w-full">
          {!accounts && (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-200"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>{" "}
              <span className="text-gray-200">Fetching accounts...</span>
            </div>
          )}
          {accounts && accounts.length === 0 && (
            <div className="flex items-center justify-center">
              <span className="text-gray-200 text-2xl">No accounts found.</span>
            </div>
          )}
          <div className="flex max-h-full flex-col w-full items-center overflow-auto">
            {accounts &&
              accounts?.map((account, idx) => (
                <>
                  <div className="w-full h-px bg-gray-700 mb-3"></div>
                  <AccountCard key={idx} idx={idx} account={account} />
                </>
              ))}
          </div>
        </ul>
      </div>
    </section>
  );
}
