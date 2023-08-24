import { blue, cyan, green, red, yellow } from "colorette";

export function logger(
  message: any,
  level: "info" | "warn" | "error" | "debug" = "info"
) {
  const currentDate = new Date();
  const dateString = `[${currentDate.getDate().toString().padStart(2, "0")}-${(
    currentDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${currentDate.getFullYear().toString()}]`;

  let color = blue;

  switch (level) {
    case "info":
      color = blue;
      break;
    case "warn":
      color = yellow;
      break;
    case "error":
      color = red;
      break;
    case "debug":
      color = green;
      break;
  }
  const logFile = "/home/developement/acc-dict/logs.txt";
  setTimeout(async () => {
    if (typeof window === "undefined") {
      const { writeFileSync } = await import("fs");
      writeFileSync(
        logFile,
        `${dateString} ${level.toUpperCase() + ":"} ${message}\n`,
        {
          flag: "a",
        }
      );
    }
  }, 3000);

  console.log(cyan(dateString), color(level.toUpperCase() + ":"), message);
}
