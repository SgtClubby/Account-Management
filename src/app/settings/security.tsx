"use client";

import { useEffect, useState } from "react";
import { AES } from "crypto-js";
import { SessionWithId, User } from "../types";
import SecurityDropdown from "./SecurityDropdown";

export default function Security() {
  return (
    <div className="py-4 px-4 flex flex-col w-full rounded-md h-full">
      <div className="flex w-full h-full">
        <div className="flex-col p-4 text-xl leading-relaxed text-gray-200 w-full space-y-5">
          <div className="flex flex-row items-center space-x-2 w-full ">
            <p className="text-xl">Security Level:</p>
            <SecurityDropdown />
          </div>
        </div>
      </div>
    </div>
  );
}
