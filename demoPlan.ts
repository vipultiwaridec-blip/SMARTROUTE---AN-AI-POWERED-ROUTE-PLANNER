import type { PlannerResult, RouteExplanation } from "../../../shared/smartroute";

const routeLine: [number, number][] = [
  [26.4499, 80.3319], [26.471, 80.365], [26.499, 80.414], [26.5393, 80.4878],
  [26.584, 80.551], [26.632, 80.617], [26.688, 80.698], [26.735, 80.772], [26.794, 80.858], [26.8467, 80.9462],
];
const offsetLine = (offset: number): [number, number][] => routeLine.map(([lat, lon], index) => [lat + Math.sin(index * 0.48) * offset, lon + Math.cos(index * 0.4) * offset * 0.8]);

export const demoPlan: PlannerResult & { explanation: RouteExplanation } = {
  origin: "Kanpur, Uttar Pradesh",
  destination: "Lucknow, Uttar Pradesh",
  stops: [],
  vehicle: "truck",
  calculatedAt: "2026-09-27T00:00:00.000Z",
  sources: { routing: "demo", weather: "demo", traffic: "demo" },
  note: "Demo mode: routes and conditions are deterministic estimates, not live navigation or traffic data.",
  routes: [
    {
      id: "sample-fastest", name: "Express corridor", label: "FASTEST", distanceKm: 92.4, durationMinutes: 118,
      geometry: routeLine, traffic: { level: "Moderate", delayMinutes: 13, congestion: 42, source: "demo" },
      weather: { temperatureC: 29, condition: "Partly cloudy", rainProbability: 18, windKph: 12, visibilityKm: 10, source: "demo" },
      risk: "Low", score: 92, breakdown: { eta: 100, traffic: 81, weather: 93, roadCondition: 86, delayRisk: 86, vehicleFit: 92, accessibility: 88 },
      reasons: ["Shortest ETA with moderate traffic and low overall route risk.", "Good vehicle suitability for a heavy truck.", "Conditions are clear with high visibility."], source: "demo",
    },
    {
      id: "sample-balanced", name: "Riverside bypass", label: "BALANCED", distanceKm: 101.8, durationMinutes: 132,
      geometry: offsetLine(0.012), traffic: { level: "Low", delayMinutes: 8, congestion: 24, source: "demo" },
      weather: { temperatureC: 28, condition: "Clear skies", rainProbability: 9, windKph: 9, visibilityKm: 10, source: "demo" },
      risk: "Low", score: 88, breakdown: { eta: 89, traffic: 93, weather: 96, roadCondition: 88, delayRisk: 91, vehicleFit: 91, accessibility: 91 },
      reasons: ["Lower congestion and expected delay than the fastest option.", "Clear weather with low rain risk.", "A little longer, but balanced across time and conditions."], source: "demo",
    },
    {
      id: "sample-alternative", name: "Central connector", label: "ALTERNATIVE", distanceKm: 108.6, durationMinutes: 149,
      geometry: offsetLine(0.024), traffic: { level: "High", delayMinutes: 22, congestion: 68, source: "demo" },
      weather: { temperatureC: 27, condition: "Light showers", rainProbability: 46, windKph: 21, visibilityKm: 7.4, source: "demo" },
      risk: "Moderate", score: 78, breakdown: { eta: 79, traffic: 64, weather: 67, roadCondition: 79, delayRisk: 62, vehicleFit: 90, accessibility: 83 },
      reasons: ["More congestion and delay exposure than the other options.", "Showers reduce visibility; allow for extra time.", "The longer ETA lowers its overall suitability."], source: "demo",
    },
  ],
  explanation: {
    headline: "A faster journey, without losing sight of risk",
    summary: "Express corridor leads at 92/100 with the shortest 118-minute estimate and moderate demo traffic. Riverside bypass is a strong low-congestion alternative if you can trade a little time for smoother conditions. These sample conditions are illustrative, not live traffic or navigation.",
    routeInsights: [
      { routeId: "sample-fastest", insight: "92/100 · 92.4 km · moderate demo traffic · low overall risk. Shortest ETA with moderate traffic and low overall route risk." },
      { routeId: "sample-balanced", insight: "88/100 · 101.8 km · low demo traffic · low overall risk. Lower congestion and expected delay than the fastest option." },
      { routeId: "sample-alternative", insight: "78/100 · 108.6 km · high demo traffic · moderate overall risk. Showers reduce visibility; allow for extra time." },
    ],
    recommendation: "Express corridor is the score-led choice for this demo. Choose the lower-congestion bypass instead if smoother estimated traffic matters more than the 14-minute time difference.",
    source: "demo",
  },
};
