import { HttpRequest, HttpResponseInit } from "@azure/functions";
import { EventGridPublisherClient, AzureKeyCredential } from "@azure/eventgrid";
import { v4 as uuidV4 } from "uuid";
import { AspectType, ObjectType, StravaEvent } from "../dtos/stravaEventDTO";

const TOPIC_ENDPOINT = process.env["TOPIC_ENDPOINT"];
const TOPIC_KEY = process.env["TOPIC_KEY"];
const client = new EventGridPublisherClient(TOPIC_ENDPOINT, "EventGrid", new AzureKeyCredential(TOPIC_KEY));

export const validateWebhook = (request: HttpRequest): HttpResponseInit => {
  const VERIFY_TOKEN = process.env["VERIFY_TOKEN"];
  const mode = request.query.get("hub.mode");
  const token = request.query.get("hub.verify_token");
  const challenge = request.query.get("hub.challenge");

  if (!mode || !token) return { status: 400, body: "Missing mode or token" };
  if (mode !== "subscribe" || token !== VERIFY_TOKEN)
    return { status: 400, body: `Invalid mode or token, Mode: ${mode}; Token: ${token}` };
  return { status: 200, jsonBody: { "hub.challenge": challenge } };
};

export const pushEventToEventGridTopic = async (stravaEvent: StravaEvent): Promise<void> => {
  const aspectType = stravaEvent.aspect_type.charAt(0).toUpperCase() + stravaEvent.aspect_type.slice(1);
  const objectType = stravaEvent.object_type.charAt(0).toUpperCase() + stravaEvent.object_type.slice(1);
  const events = [
    {
      id: uuidV4(),
      subject: `${stravaEvent.object_type}/${stravaEvent.aspect_type}/${stravaEvent.object_id}`,
      dataVersion: "1.0",
      eventType: `${objectType}.${aspectType}`,
      eventTime: new Date(),
      data: stravaEvent,
    },
  ];
  await client.send(events);
};

export const validateStravaEvent = async (requestBody: string): Promise<StravaEvent> => {
  let data: any;
  try {
    data = (await JSON.parse(requestBody)) as any;
  } catch (error) {
    return null;
  }
  const isValid =
    data &&
    Object.values(ObjectType).includes(data.object_type) &&
    typeof data.object_id === "number" &&
    Object.values(AspectType).includes(data.aspect_type) &&
    typeof data.updates === "object" &&
    typeof data.owner_id === "number" &&
    typeof data.subscription_id === "number" &&
    typeof data.event_time === "number";

  if (!isValid) return null;
  return data as StravaEvent;
};
