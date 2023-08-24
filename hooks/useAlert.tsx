import { useState } from "react";

function useAlert() {
  const [alert, setAlert] = useState({ show: false, message: "", type: false });

  const showAlert = (message: string, type = false) => {
    setAlert({ show: true, message, type });
  };

  const hideAlert = () => {
    setAlert({ show: false, message: "", type: false });
  };

  const showAlertForSeconds = (
    message: string,
    seconds: number,
    type = false
  ) => {
    showAlert(message, type);
    setTimeout(hideAlert, seconds * 1000);
  };

  function AlertComponent({ className }: { className?: string }) {
    return (
      <>
        {alert.show && (
          <div
            className={`${
              alert.type
                ? "bg-green-100 border-green-400"
                : "bg-red-100 border-red-400"
            } ${
              className
                ? className
                : "fixed z-[100] bg-green-100 border border-green-400 px-4 py-3 rounded w-fit max-w-64 right-0 left-0 m-auto"
            }`}
          >
            <span
              className={` ${
                alert.type ? "text-green-900" : "text-red-500"
              } block sm:inline`}
            >
              {alert.message}
            </span>
          </div>
        )}
      </>
    );
  }

  return {
    data: alert,
    showAlert,
    hideAlert,
    showAlertForSeconds,
    AlertComponent,
  };
}

export default useAlert;
