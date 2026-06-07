export type LocationId = "city1" | "city2" | "city3";

export type LocationPoint = {
  id: LocationId;
  location: [number, number];
  current?: boolean;
};

/** Cities marked on the location globe — edit coordinates here. */
export const LOCATION_POINTS: LocationPoint[] = [
  { id: "city1", location: [37.7749, -122.4194], current: true },
  { id: "city2", location: [25.033, 121.5654] },
  { id: "city3", location: [34.0522, -118.2437] },
];
