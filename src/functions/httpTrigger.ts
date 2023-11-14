import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { pushEventToEventGridTopic, validateStravaEvent, validateWebhook } from "../services/stravaService";
import { insertLog } from "../services/loggerService";
import { LogLevel } from "../dtos/logDTO";

export async function stravaWebhook(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  switch (request.method) {
    case "GET":
      const response = validateWebhook(request);
      if (response.status !== 200) {
        await insertLog({
          level: LogLevel.ERROR,
          message: response.body.toString(),
          category: "strava",
        });
      }
      return response;
    case "POST":
      const requestBody = await request.text();
      const stravaEvent = await validateStravaEvent(requestBody);
      if (!stravaEvent) {
        await insertLog({
          level: LogLevel.ERROR,
          message: "Strava event failed to validate",
          data: requestBody,
          category: "strava",
        });
        return { status: 200 };
      }
      const SUBSCRIPTION_ID = process.env["SUBSCRIPTION_ID"];
      if (stravaEvent.subscription_id.toString() !== SUBSCRIPTION_ID) {
        await insertLog({
          level: LogLevel.WARN,
          message: `Invalid Subscription ID: ${stravaEvent.subscription_id.toString()}`,
          category: "strava",
        });
        return { status: 200 };
      }
      try {
        await pushEventToEventGridTopic(stravaEvent);
      } catch (error) {
        await insertLog({
          level: LogLevel.ERROR,
          message: error.message,
          category: "strava",
          data: error,
        });
      }
      return { status: 200 };
    default:
      return {
        status: 405,
        body: "Method not supported",
      };
  }
}

app.http("stravaWebhookTrigger", {
  methods: ["GET", "POST"],
  authLevel: "function",
  handler: stravaWebhook,
});
