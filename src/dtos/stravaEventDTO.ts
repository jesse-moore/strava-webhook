export interface StravaEvent {
  object_type: ObjectType;
  object_id: string;
  aspect_type: AspectType;
  updates: Object;
  owner_id: number;
  subscription_id: number;
  event_time: number;
}

export enum ObjectType {
  Activity = "activity",
  Athlete = "athlete",
}

export enum AspectType {
  Create = "create",
  Update = "update",
  Delete = "delete",
}
