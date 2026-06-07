type Coordinates = { lat: number; lon: number };

type OpenMeteoCurrent = {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
  };
};

export type WeatherCondition =
  | "clear"
  | "mainlyClear"
  | "partlyCloudy"
  | "overcast"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "showers"
  | "thunderstorm";

export type WeatherSnapshot = {
  temperature: number;
  condition: WeatherCondition;
};

const BERKELEY: Coordinates = { lat: 37.8715, lon: -122.273 };

const REVALIDATE_SECONDS = 30 * 60;

function weatherCodeToCondition(code: number): WeatherCondition {
  if (code === 0) return "clear";
  if (code === 1) return "mainlyClear";
  if (code === 2) return "partlyCloudy";
  if (code === 3) return "overcast";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 57) return "drizzle";
  if (code >= 61 && code <= 67) return "rain";
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 80 && code <= 86) return "showers";
  return "thunderstorm";
}

async function resolveCoordinates(): Promise<Coordinates> {
  const lat = process.env.WEATHER_LAT;
  const lon = process.env.WEATHER_LON;
  if (lat && lon) {
    return { lat: Number.parseFloat(lat), lon: Number.parseFloat(lon) };
  }

  const city = process.env.WEATHER_CITY ?? "Berkeley";
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", city);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "en");

  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) return BERKELEY;

  const data = (await res.json()) as {
    results?: Array<{ latitude: number; longitude: number }>;
  };
  const match = data.results?.[0];
  if (!match) return BERKELEY;

  return { lat: match.latitude, lon: match.longitude };
}

export async function getWeather(): Promise<WeatherSnapshot | null> {
  try {
    const { lat, lon } = await resolveCoordinates();
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(lat));
    url.searchParams.set("longitude", String(lon));
    url.searchParams.set("current", "temperature_2m,weather_code");
    url.searchParams.set("temperature_unit", "celsius");

    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;

    const data = (await res.json()) as OpenMeteoCurrent;
    const temperature = data.current?.temperature_2m;
    const weatherCode = data.current?.weather_code;
    if (temperature == null || weatherCode == null) return null;

    return {
      temperature: Math.round(temperature),
      condition: weatherCodeToCondition(weatherCode),
    };
  } catch {
    return null;
  }
}
