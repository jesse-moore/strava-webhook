import { LogDTO } from "../dtos/logDTO";

const SUBSCRIPTION_KEY = process.env["SUBSCRIPTION_KEY"];
if (!SUBSCRIPTION_KEY) throw new Error("Missing Subscription Key");
const LOGGER_URI = process.env["LOGGER_URI"];
if (!LOGGER_URI) throw new Error("Missing Logger URI");

export const insertLog = async (log: LogDTO) => {
  const response = await fetch(LOGGER_URI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
    },
    body: JSON.stringify(log),
  });
  return response.json();
};
