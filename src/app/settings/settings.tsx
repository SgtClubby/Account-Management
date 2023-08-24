"use client";

import { useEffect, useState } from "react";
import { AES } from "crypto-js";
import { SessionWithId, User } from "../types";
import useAlert from "hooks/useAlert";
import useRefresh from "hooks/useRefresh";

export default function Password({
  session,
  user,
}: {
  session: SessionWithId;
  user: User;
}) {
  const alert = useAlert();

  async function resendVerification() {
    await fetch(`/api/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // @ts-ignore
        id: session?.user?.id,
      }),
    });
  }

  async function submitUsername(username: string) {
    const res = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const data = await res.json();

    if (!data.ok) {
      return alert.showAlert(data.message);
    } else {
      alert.showAlert("Username updated");
    }
  }

  async function sumbitEmail(email: string) {
    const res = await fetch("/api/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!data.ok) {
      return alert.showAlert(data.message);
    } else {
      alert.showAlert("Email updated");
      resendVerification();
    }
  }

  const { refresh, refreshState } = useRefresh();

  function changeUsername() {
    const username = prompt("Enter new username");
    if (username) {
      submitUsername(username.trim());
      refreshState();
    }
  }

  function changeEmail() {
    const email = prompt("Enter new email");
    if (email === session?.user?.email) {
      return alert.showAlert("Email is the same as the current one");
    }

    if (email) {
      // do a regex on the email to make sure its correct
      const regex = new RegExp("^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$");
      if (!regex.test(email)) {
        alert.showAlert("Invalid email!");
        return;
      }
      sumbitEmail(email.trim());
      refreshState();
    }
  }

  return (
    <div className="py-4 px-4 flex flex-col w-full rounded-md h-full">
      <div className="flex w-full h-full">
        <div className="flex-col p-4 text-xl leading-relaxed text-gray-200 w-full space-y-5">
          <div className="flex flex-col md:flex-row flex-grow w-full ">
            <p>Username:</p>
            <p className="text-gray-400 md:pl-5">{user?.username}</p>
            <button
              className="md:ml-auto mt-2 md:mt-0 w-fit px-3 py-1 text-white bg-blue-500 rounded-md outline-none ring-offset-2 ring-blue-400 focus:ring-2"
              onClick={() => changeUsername()}
              disabled={false}
            >
              Change
            </button>
          </div>
          <div className="flex flex-col md:flex-row flex-grow w-full ">
            <p>Email:</p>
            <p className="text-gray-400 md:pl-5">{user?.email}</p>
            <p
              className={`${
                user?.emailVerified ? "text-green-500" : "text-red-500"
              } md:ml-5`}
            >
              {user?.emailVerified ? "Verified" : "Not Verified"}
            </p>
            <button
              className="md:ml-auto mt-2 md:mt-0 w-fit px-3 py-1 text-white bg-blue-500 rounded-md outline-none ring-offset-2 ring-blue-400 focus:ring-2"
              onClick={() => changeEmail()}
              disabled={false}
            >
              Change
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 mt-auto">
        {alert.data.show && (
          <div
            className={`${
              alert.data.type ? "text-green-500" : "text-red-500"
            } text-2xl ml-5`}
          >
            <span className="">{alert.data.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
