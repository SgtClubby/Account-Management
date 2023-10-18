import { Fragment, SetStateAction, use, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { classNames } from "lib/functions";
import { User } from "../types";
import { set } from "mongoose";

export default function SecurityDropdown() {
  const [user, setUser] = useState<null | User>(null);
  const [securityLevel, setSecurityLevel] = useState<number>();

  const fetchMe = async () => {
    const res = await fetch("/api/me");
    const data = await res.json();
    if (data.ok) {
      setUser(data.user as User);
      setSecurityLevel(data.user.accountSecurityLevel);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  console.log(securityLevel);

  useEffect(() => {
    async function updateSecurityLevel() {
      if (securityLevel !== undefined) {
        // check if securityLevel is not undefined
        const res = await fetch("/api/security", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            level: securityLevel,
          }),
        });
        const data = await res.json();
      }
    }
    updateSecurityLevel();
  }, [securityLevel]);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          {securityLevel === 0 ? (
            <p>Low</p>
          ) : securityLevel === 1 ? (
            <p>Medium</p>
          ) : securityLevel === 2 ? (
            <p>High</p>
          ) : (
            <p>Unknown</p>
          )}
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setSecurityLevel(2)}
                  className={classNames(
                    active ? "bg-red-500 text-gray-900" : "text-gray-700",
                    "block w-full px-4 py-2 text-left text-sm"
                  )}
                >
                  HIGH
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setSecurityLevel(1)}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block w-full px-4 py-2 text-left text-sm"
                  )}
                >
                  MEDIUM
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => setSecurityLevel(0)}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block w-full px-4 py-2 text-left text-sm"
                  )}
                >
                  LOW
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
