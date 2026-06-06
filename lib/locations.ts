export type LocationId = "sf" | "taipei" | "la";

export type LocationPoint = {
  id: LocationId;
  location: [number, number];
  current?: boolean;
};

/** Cities marked on the location globe — edit coordinates here. */
export const LOCATION_POINTS: LocationPoint[] = [
  { id: "sf", location: [37.7749, -122.4194], current: true },
  { id: "taipei", location: [25.033, 121.5654] },
  { id: "la", location: [34.0522, -118.2437] },
];
