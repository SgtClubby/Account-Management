"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Password from "./password";
import Settings from "./settings";
import TwoFA from "./twofa";
import TwoFactorModal from "./TwoFactorModal";
import { SessionWithId, User as UserType } from "../types";
import { classNames, defaultProfilePicture } from "lib/functions";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PasswordIcon from "@mui/icons-material/Password";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import useRefresh from "hooks/useRefresh";

export default function SettingsPage() {
  const { data: session, status } = useSession();

  const router = useRouter();
  if (status === "unauthenticated") {
    router.push("/login");
  }

  const [user, setUser] = useState<UserType>();

  const [activeTab, setActiveTab] = useState<String>("user");

  async function fetchMe() {
    const res = await fetch("/api/me", {
      method: "GET",
    });
    const data = await res.json();
    setUser(data.user);
  }

  const [twoFactorModal, showTwoFactorModal] = useState({
    show: false,
    refresh: false,
  });

  const { refresh, refreshState } = useRefresh();

  useEffect(() => {
    fetchMe();
  }, [refresh]);

  return (
    <>
      <TwoFactorModal
        twoFactorModal={twoFactorModal}
        showTwoFactorModal={showTwoFactorModal}
        session={session as SessionWithId}
        user={user as UserType}
      />
      <div className="flex justify-center items-center w-full md:h-screen md:mt-0 mt-10">
        <div className="w-full lg:h-fit mx-5 my-5 max-w-screen-2xl">
          <div className="flex flex-row h-20 items-center ">
            <h1 className="text-gray-200 text-2xl lg:text-4xl font-extrabold w-full">
              Account Settings
            </h1>
            <div className="h-10">
              <button
                onClick={() => router.push("/accounts")}
                className="px-6 py-2 text-white bg-blue-500 rounded-md outline-none ring-offset-2 ring-blue-400 focus:ring-2"
              >
                Back
              </button>
            </div>
          </div>
          <div className="h-[40rem] lg:h-[50rem] w-full">
            <div className="grid grid-cols-[4rem_1fr] sm:grid-cols-[4rem_1fr] md:grid-cols-[12rem_1fr] lg:grid-cols-[16rem_1fr] grid-rows-1 h-full">
              {/* Sidebar */}
              <div className="border-t border-l border-b h-full border-white rounded-l-md ">
                {/* User info */}
                <div className="hidden flex-col md:flex  items-center justify-center h-40 border-b border-white">
                  <img
                    className="rounded-full w-20 h-20"
                    src={
                      session?.user?.image
                        ? session?.user?.image
                        : defaultProfilePicture()
                    }
                  />
                  <h1 className="text-gray-200 text-xl">{user?.username}</h1>
                </div>
                <button
                  accessKey="1"
                  onClick={() => setActiveTab("user")}
                  className={classNames(
                    "text-gray-200 text-lg border-white text-left border-b py-3 w-full",
                    activeTab == "user" && "bg-metrix-blue"
                  )}
                >
                  <div className="flex flex-row items-center">
                    <ManageAccountsIcon className="ml-5" />
                    <p className="hidden sm:hidden md:block ml-1">
                      User Settings
                    </p>
                  </div>
                </button>
                <button
                  accessKey="2"
                  onClick={() => setActiveTab("password")}
                  className={classNames(
                    "text-gray-200 text-lg border-white text-left border-b py-3 w-full",
                    activeTab == "password" && "bg-metrix-blue"
                  )}
                >
                  <div className="flex flex-row items-center">
                    <PasswordIcon className="ml-5" />
                    <p className="hidden sm:hidden md:block ml-1">Password</p>
                  </div>
                </button>
                <button
                  accessKey="3"
                  onClick={() => setActiveTab("2fa")}
                  className={classNames(
                    "text-gray-200 text-lg border-white text-left border-b py-3 w-full",
                    activeTab == "2fa" && "bg-metrix-blue"
                  )}
                >
                  <div className="flex flex-row items-center">
                    <VpnKeyIcon className="ml-5" />
                    <p className="hidden sm:hidden md:block ml-1">MFA</p>
                  </div>
                </button>
              </div>

              {/* Main */}
              <div className="border h-full rounded-r-md border-white">
                <div className="grid grid-cols-1 grid-rows-[h-fit_1fr] h-full ">
                  {activeTab == "user" && (
                    <Settings
                      session={session as SessionWithId}
                      user={user as UserType}
                    />
                  )}
                  {activeTab == "password" && (
                    <Password session={session as SessionWithId} />
                  )}
                  {activeTab == "2fa" && (
                    <TwoFA
                      session={session as SessionWithId}
                      user={user as UserType}
                      showTwoFactorModal={showTwoFactorModal}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
