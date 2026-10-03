export type VehicleType = "truck" | "van";
export type DataMode = "live" | "demo" | "estimated";
export type LatLng = [latitude: number, longitude: number];

export interface PlaceInput {
  label: string;
  coordinates?: LatLng;
}

export interface PlannerInput {
  origin: string;
  destination: string;
  stops: string[];
  vehicle: VehicleType;
  departureTime?: string;
}

export interface WeatherSnapshot {
  temperatureC: number;
  condition: string;
  rainProbability: number;
  windKph: number;
  visibilityKm: number;
  source: DataMode;
}

export interface TrafficSnapshot {
  level: "Low" | "Moderate" | "High";
  delayMinutes: number;
  congestion: number;
  source: DataMode;
}

export interface ScoreBreakdown {
  eta: number;
  traffic: number;
  weather: number;
  roadCondition: number;
  delayRisk: number;
  vehicleFit: number;
  accessibility: number;
}

export interface RouteCandidate {
  id: string;
  name: string;
  label: string;
  distanceKm: number;
  durationMinutes: number;
  geometry: LatLng[];
  traffic: TrafficSnapshot;
  weather: WeatherSnapshot;
  risk: "Low" | "Moderate" | "High";
  score: number;
  breakdown: ScoreBreakdown;
  reasons: string[];
  source: DataMode;
}

export interface PlannerResult {
  origin: string;
  destination: string;
  stops: string[];
  vehicle: VehicleType;
  routes: RouteCandidate[];
  sources: {
    routing: DataMode;
    weather: DataMode;
    traffic: DataMode;
  };
  calculatedAt: string;
  note?: string;
}

export interface RouteExplanation {
  headline: string;
  summary: string;
  routeInsights: Array<{ routeId: string; insight: string }>;
  recommendation: string;
  source: "gemini" | "demo";
}
