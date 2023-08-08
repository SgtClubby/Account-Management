"use client";

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Dropdown from "./Dropdown";
import { useEffect, useState } from "react";
import { AES, enc } from "crypto-js";
import AddModal from "./AddModal";
import TwoFactorModal from "./TwoFactorModal";
import SyncIcon from "@mui/icons-material/Sync";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { Account, SessionWithId } from "../types";
import AccountCard from "./AccountCard";
import { Session } from "inspector";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    redirect("/login");
  }

  const [accounts, setAccounts] = useState<Account[]>();
  const [search, setSearch] = useState<string>("");

  function decrypt(string: string, key: string) {
    const decrypted = AES.decrypt(string, key).toString(enc.Utf8);
    return decrypted;
  }

  async function fetchData() {
    setAccounts(undefined);
    const res = await fetch("/api/accounts", {
      method: "GET",
    });
    const data = await res.json();

    data.accounts?.forEach((account: Account) => {
      const decrypted = decrypt(
        account.password,
        session?.user?.email as string
      );
      account.password = decrypted;
    });

    setAccounts(data.accounts);
  }

  useEffect(() => {
    async function fetchInitData() {
      const res = await fetch("/api/accounts", {
        method: "GET",
      });
      const data = await res.json();

      data.accounts?.forEach((account: Account) => {
        const decrypted = decrypt(
          account.password,
          session?.user?.email as string
        );
        account.password = decrypted;
      });

      setAccounts(data.accounts);
    }

    if (search) {
      const filteredAccounts = accounts?.filter((account) => {
        return account.name.toLowerCase().includes(search.toLowerCase());
      });
      setAccounts(filteredAccounts);
    } else {
      if (session) fetchInitData();
    }
  }, [search]);

  const [addModal, showAddModal] = useState({ show: false });
  const [twoFactorModal, showTwoFactorModal] = useState({ show: false });

  return (
    <section className="py-28">
      <AddModal
        addModal={addModal}
        showAddModal={showAddModal}
        session={session}
        fetchData={fetchData}
      />
      <TwoFactorModal
        twoFactorModal={twoFactorModal}
        showTwoFactorModal={showTwoFactorModal}
        session={session as SessionWithId}
      />
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
              onClick={() => showAddModal({ show: true })}
              className="items-center ml-2 h-10 w-10  text-gray-200 hover:text-gray-400 cursor-pointer"
              titleAccess="Add Account"
            />

            <SyncIcon
              className="text-gray-200 ml-2 items-center h-10 w-10 hover:text-gray-400 cursor-pointer"
              onClick={() => fetchData()}
              titleAccess="Refresh list"
            />

            <div className="ml-auto items-center">
              <Dropdown showTwoFactorModal={showTwoFactorModal} />
            </div>
          </div>
        </div>
        <ul className="mt-8 divide-y space-y-3">
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
              <span className="text-gray-200">No accounts found.</span>
            </div>
          )}
          {accounts &&
            accounts?.map((account, idx) => (
              <div key={idx}>
                <AccountCard
                  key={idx + account.password}
                  idx={idx}
                  account={account}
                />
              </div>
            ))}
        </ul>
      </div>
    </section>
  );
}
