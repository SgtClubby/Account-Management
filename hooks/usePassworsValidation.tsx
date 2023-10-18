import { classNames } from "lib/functions";
import { logger } from "lib/logger";
import { useEffect, useState } from "react";

export default function usePasswordValidation(
  password: string,
  confirmPassword: string
) {
  const [satisfiesLG, setsatisfiesLG] = useState(false);
  const [satisfiesLC, setsatisfiesLC] = useState(false);
  const [satisfiesUP, setsatisfiesUP] = useState(false);
  const [satisfiesDI, setsatisfiesDI] = useState(false);
  const [satisfiesSC, setsatisfiesSC] = useState(false);

  const [match, setMatch] = useState<Boolean>(true);
  const [validated, setValidated] = useState<Boolean>(false);

  // Use this to check if the password is valid (meets all requirements)
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
      setValidated(true);
    } else {
      setValidated(false);
    }

    validatePassword(password);
  }, [password, confirmPassword]);

  // Use this to check if the passwords match
  useEffect(() => {
    if (password !== confirmPassword) {
      return setMatch(false);
    } else {
      return setMatch(true);
    }
  }, [confirmPassword, password]);

  type PasswordRequirementsProps = {
    className?: string;
    arrow?: boolean;
    arrowHeight?: number;
  };

  function PasswordRequirements({
    className,
    arrow,
  }: PasswordRequirementsProps) {
    return (
      <div
        className={classNames(
          arrow ? "arrow" : "",
          `${
            password.length == 0
              ? "hidden"
              : `${
                  className +
                  " bg-white border-gray-200 border-2 rounded p-2 text-sm text-gray-700 py-2 px-4 z-10 shadow-md"
                }`
          }`
        )}
      >
        <p className="text-gray-900 mb-2">Password requirements:</p>
        <ul className="list-disc list-inside">
          <li className={`${satisfiesLG ? "text-green-500" : "text-red-500"}`}>
            At least 8 characters
          </li>
          <li className={`${satisfiesLC ? "text-green-500" : "text-red-500"}`}>
            At least one lower case letter
          </li>
          <li className={`${satisfiesUP ? "text-green-500" : "text-red-500"}`}>
            At least one upper case letter
          </li>
          <li className={`${satisfiesDI ? "text-green-500" : "text-red-500"}`}>
            At least one digit
          </li>
          <li className={`${satisfiesSC ? "text-green-500" : "text-red-500"}`}>
            At least one special character
          </li>
        </ul>
      </div>
    );
  }

  return { isMatching: match, isValid: validated, PasswordRequirements };
}
