// server/_core/index.ts
import "dotenv/config";
import { createServer } from "http";
import net from "net";

// server/app.ts
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";
var OAUTH_STATE_COOKIE = "__Host-oauth_state";
var decodeOAuthState = (state) => {
  let decoded;
  try {
    decoded = atob(state);
  } catch {
    return { redirectUri: "" };
  }
  try {
    const parsed = JSON.parse(decoded);
    if (parsed && typeof parsed.redirectUri === "string") return parsed;
  } catch {
  }
  return { redirectUri: decoded };
};

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? ""
};

// server/_core/notification.ts
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/smartrouteRouter.ts
import { z as z2 } from "zod";

// server/services/scoringService.ts
var clamp = (n) => Math.max(0, Math.min(100, n));
var round = (n) => Math.round(n);
function scoreRoutes(routes, vehicle) {
  if (!routes.length) return [];
  const bestDuration = Math.min(...routes.map((route) => route.durationMinutes));
  const bestDistance = Math.min(...routes.map((route) => route.distanceKm));
  return routes.map((route) => {
    const eta = clamp(bestDuration / Math.max(route.durationMinutes, 1) * 100);
    const traffic = clamp(100 - route.traffic.congestion);
    const rainPenalty = route.weather.rainProbability * 0.42;
    const windPenalty = Math.max(0, route.weather.windKph - 20) * 0.62;
    const visibilityPenalty = Math.max(0, 8 - route.weather.visibilityKm) * 5;
    const weather = clamp(100 - rainPenalty - windPenalty - visibilityPenalty);
    const roadCondition = clamp(91 - route.traffic.congestion * 0.12 - rainPenalty * 0.2);
    const delayRisk = clamp(100 - route.traffic.delayMinutes * 1.7 - route.traffic.congestion * 0.18);
    const truckFit = route.distanceKm <= 500 ? 92 : route.distanceKm <= 900 ? 87 : 80;
    const vehicleFit = clamp(vehicle === "van" ? truckFit + 4 : truckFit);
    const accessibility = clamp(91 - route.traffic.congestion * 0.08 - visibilityPenalty * 0.2);
    const breakdown = {
      eta: round(eta),
      traffic: round(traffic),
      weather: round(weather),
      roadCondition: round(roadCondition),
      delayRisk: round(delayRisk),
      vehicleFit: round(vehicleFit),
      accessibility: round(accessibility)
    };
    const score = round(
      breakdown.eta * 0.25 + breakdown.traffic * 0.2 + breakdown.weather * 0.1 + breakdown.roadCondition * 0.1 + breakdown.delayRisk * 0.15 + breakdown.vehicleFit * 0.1 + breakdown.accessibility * 0.1
    );
    const risk = score >= 82 ? "Low" : score >= 68 ? "Moderate" : "High";
    const reasons = [
      [breakdown.eta, `ETA is ${Math.floor(route.durationMinutes / 60)}h ${String(route.durationMinutes % 60).padStart(2, "0")}m (${round((route.durationMinutes / Math.max(bestDuration, 1) - 1) * 100)}% slower than the fastest route)`],
      [breakdown.traffic, `${route.traffic.level.toLowerCase()} traffic with about ${route.traffic.delayMinutes} min expected delay`],
      [breakdown.weather, `${route.weather.condition.toLowerCase()} conditions with ${route.weather.rainProbability}% rain probability`],
      [breakdown.vehicleFit, `Suitable for the selected ${vehicle}`]
    ];
    const sortedReasons = reasons.sort((a, b) => b[0] - a[0]).slice(0, 3).map(([, reason]) => reason);
    return { ...route, score, breakdown, risk, reasons: sortedReasons };
  }).sort((a, b) => b.score - a.score);
}

// server/services/demoRouteService.ts
var cities = {
  kanpur: [26.4499, 80.3319],
  unnao: [26.5393, 80.4878],
  lucknow: [26.8467, 80.9462],
  delhi: [28.6139, 77.209],
  noida: [28.5355, 77.391],
  agra: [27.1767, 78.0081],
  jaipur: [26.9124, 75.7873],
  varanasi: [25.3176, 82.9739],
  prayagraj: [25.4358, 81.8463],
  allahabad: [25.4358, 81.8463],
  gurugram: [28.4595, 77.0266],
  gurgaon: [28.4595, 77.0266],
  mumbai: [19.076, 72.8777],
  pune: [18.5204, 73.8567],
  bengaluru: [12.9716, 77.5946],
  bangalore: [12.9716, 77.5946],
  hyderabad: [17.385, 78.4867],
  chandigarh: [30.7333, 76.7794],
  indore: [22.7196, 75.8577],
  bhopal: [23.2599, 77.4126],
  patna: [25.5941, 85.1376],
  kolkata: [22.5726, 88.3639],
  ahmedabad: [23.0225, 72.5714]
};
var keyOf = (value) => value.trim().toLowerCase().replace(/,.*$/, "").replace(/\s+/g, " ");
var known = (name) => cities[keyOf(name)];
var hash = (text2) => text2.split("").reduce((acc, char) => acc * 31 + char.charCodeAt(0) >>> 0, 7);
function haversine(a, b) {
  const rad = (deg) => deg * Math.PI / 180;
  const dLat = rad(b[0] - a[0]);
  const dLon = rad(b[1] - a[1]);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[0])) * Math.cos(rad(b[0])) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
function makeGeometry(waypoints, detour) {
  const points = [];
  for (let segment = 0; segment < waypoints.length - 1; segment += 1) {
    const [a, b] = [waypoints[segment], waypoints[segment + 1]];
    const dx = b[1] - a[1];
    const dy = b[0] - a[0];
    const length = Math.hypot(dx, dy) || 1;
    const perpendicular = [dy / length, -dx / length];
    for (let step = segment === 0 ? 0 : 1; step <= 4; step += 1) {
      const t2 = step / 4;
      const wave = step === 0 || step === 4 ? 0 : Math.sin(t2 * Math.PI) * detour;
      points.push([
        a[0] + (b[0] - a[0]) * t2 + perpendicular[1] * wave,
        a[1] + (b[1] - a[1]) * t2 + perpendicular[0] * wave
      ]);
    }
  }
  return points;
}
function buildDemoPlan(input) {
  const from = known(input.origin);
  const to = known(input.destination);
  const knownStops = input.stops.map(known).filter((point) => Boolean(point));
  const demoDefault = keyOf(input.origin) === "kanpur" && keyOf(input.destination) === "lucknow";
  const waypoints = from && to ? [from, ...knownStops.length ? knownStops : demoDefault ? [cities.unnao] : [], to] : [cities.kanpur, cities.unnao, cities.lucknow];
  const sampleGeometry = !from || !to;
  const distance = waypoints.slice(1).reduce((sum, point, index) => sum + haversine(waypoints[index], point), 0) * 1.18;
  const seed = hash(`${input.origin}|${input.destination}|${input.vehicle}`);
  const trafficLevels = ["Low", "Moderate", "High"];
  const weatherConditions = ["Clear skies", "Partly cloudy", "Light showers"];
  const factors = [1, 1.11, 1.22];
  const raw = factors.map((factor, i) => {
    const congestion = (seed + i * 23) % 38 + (i === 2 ? 34 : i === 1 ? 15 : 0);
    const trafficLevel = congestion < 30 ? "Low" : congestion < 58 ? "Moderate" : "High";
    const traffic = {
      level: trafficLevels.includes(trafficLevel) ? trafficLevel : "Moderate",
      delayMinutes: Math.round(congestion / 100 * distance * 0.24),
      congestion,
      source: "demo"
    };
    const rain = (seed + i * 19) % 36;
    const weather = {
      temperatureC: 27 + (seed >> i) % 7,
      condition: weatherConditions[(seed + i) % weatherConditions.length],
      rainProbability: rain,
      windKph: 8 + (seed >> i + 2) % 14,
      visibilityKm: rain > 28 ? 6.5 : 10,
      source: "demo"
    };
    const distanceKm = Math.round(distance * factor * 10) / 10;
    const durationMinutes = Math.round(distanceKm / (input.vehicle === "truck" ? 47 : 61) * 60 + traffic.delayMinutes);
    const names = ["North connector", "River bypass", "Central corridor"];
    const labels = ["FASTEST", "LOW TRAFFIC", "BALANCED"];
    return {
      id: `demo-route-${i + 1}`,
      name: names[i],
      label: labels[i],
      distanceKm,
      durationMinutes,
      geometry: makeGeometry(waypoints, i * 6e-3),
      traffic,
      weather,
      source: "demo"
    };
  });
  const routes = scoreRoutes(raw, input.vehicle);
  return {
    origin: input.origin.trim(),
    destination: input.destination.trim(),
    stops: input.stops.map((stop) => stop.trim()).filter(Boolean),
    vehicle: input.vehicle,
    routes,
    sources: { routing: "demo", weather: "demo", traffic: "demo" },
    calculatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    note: sampleGeometry ? "Illustrative sample geometry (Kanpur\u2013Unnao\u2013Lucknow) shown because one or more locations are not in the demo place catalog." : "Demo mode: routes and conditions are deterministic estimates, not live navigation or traffic data."
  };
}

// server/services/geminiService.ts
function makeFallback(plan) {
  const recommended = [...plan.routes].sort((a, b) => b.score - a.score)[0];
  return {
    headline: "A score-led route recommendation",
    summary: recommended ? `${recommended.name} is the highest-scoring option at ${recommended.score}/100. Its ${recommended.durationMinutes}-minute estimated journey, ${recommended.traffic.level.toLowerCase()} traffic profile, and ${recommended.weather.condition.toLowerCase()} conditions inform the deterministic score. ${recommended.source === "demo" ? "Demo route estimates are illustrative, not live navigation." : "Route geometry is from the routing provider."}` : "Calculate at least one route to generate an explanation.",
    routeInsights: plan.routes.map((route) => ({
      routeId: route.id,
      insight: `${route.score}/100 \xB7 ${route.distanceKm.toFixed(1)} km \xB7 ${route.traffic.level.toLowerCase()} traffic \xB7 ${route.risk.toLowerCase()} overall risk. ${route.reasons[0] ?? "See the score breakdown for factors."}`
    })),
    recommendation: recommended ? `${recommended.name} is the recommended choice by the deterministic score. Compare its time and risk profile with your delivery priority before confirming.` : "No route recommendation is available yet.",
    source: "demo"
  };
}
async function explainRoutes(plan) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !plan.routes.length) return makeFallback(plan);
  try {
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const data = {
      journey: { origin: plan.origin, destination: plan.destination, stops: plan.stops, vehicle: plan.vehicle },
      candidates: plan.routes.map((route) => ({
        id: route.id,
        name: route.name,
        distanceKm: route.distanceKm,
        durationMinutes: route.durationMinutes,
        traffic: route.traffic,
        weather: route.weather,
        risk: route.risk,
        score: route.score,
        scoreBreakdown: route.breakdown,
        reasons: route.reasons
      })),
      instruction: "Explain these exact measured fields only. Never add roads, incidents, hazards, live events, or conditions not present in the data. The deterministic score is authoritative; do not choose a different route than the highest-scoring route. Clearly call demo data illustrative. Keep explanations concise and operational."
    };
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: "You are SmartRoute's logistics analyst. Explain only provided route data; do not invent information. Return valid JSON that follows the response schema." }] },
        contents: [{ role: "user", parts: [{ text: JSON.stringify(data) }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              headline: { type: "STRING" },
              summary: { type: "STRING" },
              routeInsights: { type: "ARRAY", items: { type: "OBJECT", properties: { routeId: { type: "STRING" }, insight: { type: "STRING" } }, required: ["routeId", "insight"] } },
              recommendation: { type: "STRING" }
            },
            required: ["headline", "summary", "routeInsights", "recommendation"]
          }
        }
      }),
      signal: AbortSignal.timeout(15e3)
    });
    if (!response.ok) throw new Error(`Gemini returned ${response.status}.`);
    const payload = await response.json();
    const text2 = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text2) throw new Error("Gemini returned no explanation.");
    const parsed = JSON.parse(text2);
    const validIds = new Set(plan.routes.map((route) => route.id));
    const routeInsights = Array.isArray(parsed.routeInsights) ? parsed.routeInsights.filter((item) => item && validIds.has(item.routeId) && typeof item.insight === "string").map((item) => ({ routeId: item.routeId, insight: item.insight.slice(0, 360) })) : [];
    if (typeof parsed.headline !== "string" || typeof parsed.summary !== "string" || typeof parsed.recommendation !== "string") throw new Error("Gemini returned an invalid explanation shape.");
    const deterministicTop = [...plan.routes].sort((a, b) => b.score - a.score)[0];
    return {
      headline: parsed.headline.slice(0, 90),
      summary: parsed.summary.slice(0, 600),
      routeInsights: routeInsights.length ? routeInsights : makeFallback(plan).routeInsights,
      recommendation: `${deterministicTop.name} is the score-led choice (${deterministicTop.score}/100). ${parsed.recommendation.slice(0, 360)}`,
      source: "gemini"
    };
  } catch {
    return makeFallback(plan);
  }
}

// server/services/routingService.ts
var ORS_BASE = "https://api.openrouteservice.org";
var key = () => process.env.OPENROUTESERVICE_API_KEY;
async function geocode(place, apiKey) {
  const url = new URL(`${ORS_BASE}/geocode/search`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("text", place);
  url.searchParams.set("size", "1");
  const response = await fetch(url, { signal: AbortSignal.timeout(12e3) });
  if (!response.ok) throw new Error(`Location search failed for \u201C${place}\u201D (${response.status}).`);
  const payload = await response.json();
  const coordinates = payload.features?.[0]?.geometry?.coordinates;
  if (!Array.isArray(coordinates) || coordinates.length < 2 || !Number.isFinite(coordinates[0]) || !Number.isFinite(coordinates[1])) {
    throw new Error(`Could not find a location for \u201C${place}\u201D. Try a city and region.`);
  }
  return [coordinates[0], coordinates[1]];
}
async function getLiveRoutes(input) {
  const apiKey = key();
  if (!apiKey) throw new Error("OpenRouteService is not configured.");
  const locations = await Promise.all([input.origin, ...input.stops, input.destination].map((place) => geocode(place, apiKey)));
  const response = await fetch(`${ORS_BASE}/v2/directions/driving-car/geojson`, {
    method: "POST",
    headers: { Authorization: apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      coordinates: locations,
      instructions: false,
      alternative_routes: { target_count: 3, share_factor: 0.6, weight_factor: 1.4 }
    }),
    signal: AbortSignal.timeout(18e3)
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Route provider returned ${response.status}${detail ? `: ${detail.slice(0, 140)}` : ""}.`);
  }
  const payload = await response.json();
  const features = payload.features ?? [];
  if (!features.length) throw new Error("The route provider returned no route options.");
  return features.map((feature, index) => {
    const summary = feature.properties?.summary;
    const coords = feature.geometry?.coordinates;
    if (!summary || !Number.isFinite(summary.distance) || !Number.isFinite(summary.duration) || !Array.isArray(coords)) {
      throw new Error("The route provider returned incomplete route data.");
    }
    const raw = coords;
    const stride = Math.max(1, Math.ceil(raw.length / 180));
    const sampled = raw.filter((_, pointIndex) => pointIndex % stride === 0 || pointIndex === raw.length - 1);
    return {
      id: `ors-route-${index + 1}`,
      distanceKm: Math.round(summary.distance / 100) / 10,
      durationMinutes: Math.max(1, Math.round(summary.duration / 60)),
      geometry: sampled.map((point) => {
        const pair = point;
        if (!Array.isArray(pair) || pair.length < 2 || !Number.isFinite(pair[0]) || !Number.isFinite(pair[1])) {
          throw new Error("The route provider returned malformed geometry.");
        }
        return [pair[1], pair[0]];
      })
    };
  });
}

// server/services/trafficService.ts
function routeSeed(value) {
  let seed = 19;
  for (const char of value) seed = Math.imul(seed, 31) + char.charCodeAt(0) >>> 0;
  return seed;
}
function estimateTraffic(routeId, distanceKm, mode = "demo") {
  const seed = routeSeed(routeId);
  const congestion = 17 + seed % 57;
  return {
    level: congestion < 34 ? "Low" : congestion < 59 ? "Moderate" : "High",
    congestion,
    delayMinutes: Math.round(congestion / 100 * distanceKm * 0.22),
    source: mode
  };
}

// server/services/weatherService.ts
async function getWeather(point) {
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) throw new Error("OpenWeatherMap is not configured.");
  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.searchParams.set("lat", String(point[0]));
  url.searchParams.set("lon", String(point[1]));
  url.searchParams.set("appid", apiKey);
  const response = await fetch(url, { signal: AbortSignal.timeout(1e4) });
  if (!response.ok) throw new Error(`Weather provider returned ${response.status}.`);
  const payload = await response.json();
  if (!Number.isFinite(payload.main?.temp) || !payload.weather?.[0]) throw new Error("Weather provider returned incomplete data.");
  const condition = payload.weather[0];
  const wet = (condition.id ?? 800) >= 300 && (condition.id ?? 800) < 700;
  return {
    temperatureC: Math.round(payload.main.temp - 273.15),
    condition: condition.description?.replace(/^./, (letter) => letter.toUpperCase()) ?? condition.main ?? "Conditions available",
    rainProbability: wet ? Math.min(95, 35 + Math.round((payload.rain?.["1h"] ?? payload.rain?.["3h"] ?? 0) * 12)) : Math.round((payload.clouds?.all ?? 0) * 0.18),
    windKph: Math.round((payload.wind?.speed ?? 0) * 3.6),
    visibilityKm: Math.round((payload.visibility ?? 1e4) / 1e3 * 10) / 10,
    source: "live"
  };
}

// server/services/plannerService.ts
function midpoint(points) {
  return points[Math.floor(points.length / 2)] ?? [26.8467, 80.9462];
}
function fallbackWeather(index) {
  const options = [
    { temperatureC: 31, condition: "Clear skies", rainProbability: 12, windKph: 10, visibilityKm: 10, source: "demo" },
    { temperatureC: 29, condition: "Partly cloudy", rainProbability: 23, windKph: 13, visibilityKm: 9, source: "demo" },
    { temperatureC: 28, condition: "Light showers", rainProbability: 47, windKph: 18, visibilityKm: 7.2, source: "demo" }
  ];
  return options[index % options.length];
}
async function calculatePlan(input) {
  let plan;
  try {
    const paths = await getLiveRoutes(input);
    const trafficRoutes = paths.map((path3) => ({ ...path3, traffic: estimateTraffic(path3.id, path3.distanceKm) }));
    const enriched = await Promise.all(trafficRoutes.map(async (path3, index) => {
      let weather = fallbackWeather(index);
      try {
        weather = await getWeather(midpoint(path3.geometry));
      } catch {
      }
      return {
        ...path3,
        name: ["Fastest corridor", "Balanced corridor", "Alternative corridor"][index] ?? `Route option ${index + 1}`,
        label: index === 0 ? "FASTEST" : index === 1 ? "BALANCED" : "ALTERNATIVE",
        traffic: path3.traffic,
        weather,
        source: "live"
      };
    }));
    const routes = scoreRoutes(enriched, input.vehicle);
    const weatherSource = routes.every((route) => route.weather.source === "live") ? "live" : "demo";
    plan = {
      origin: input.origin.trim(),
      destination: input.destination.trim(),
      stops: input.stops.map((stop) => stop.trim()).filter(Boolean),
      vehicle: input.vehicle,
      routes,
      sources: { routing: "live", weather: weatherSource, traffic: "demo" },
      calculatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      note: weatherSource === "demo" ? "Live road geometry with demo weather fallback. Traffic indicators are deterministic estimates; no live traffic provider is connected." : "Live road geometry and current weather observations. Traffic indicators are deterministic estimates; no live traffic provider is connected."
    };
  } catch {
    plan = buildDemoPlan(input);
  }
  const explanation = await explainRoutes(plan);
  return { ...plan, explanation };
}

// server/smartrouteRouter.ts
var plannerInput = z2.object({
  origin: z2.string().trim().min(2).max(120),
  destination: z2.string().trim().min(2).max(120),
  stops: z2.array(z2.string().trim().min(2).max(120)).max(5).default([]),
  vehicle: z2.enum(["truck", "van"]),
  departureTime: z2.string().optional()
}).superRefine((value, context) => {
  if (value.origin.trim().toLocaleLowerCase() === value.destination.trim().toLocaleLowerCase()) {
    context.addIssue({ code: "custom", path: ["destination"], message: "Origin and destination need to be different." });
  }
});
var smartRouteRouter = router({
  calculate: publicProcedure.input(plannerInput).mutation(({ input }) => calculatePlan(input))
});

// server/routers.ts
var appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  planner: smartRouteRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  })
  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";

// server/db.ts
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});

// server/db.ts
var _db = null;
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}

// server/_core/sdk.ts
var isNonEmptyString2 = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    return decodeOAuthState(state).redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString2(openId) || !isNonEmptyString2(appId) || !isNonEmptyString2(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    let sessionToken = cookies.get(COOKIE_NAME);
    if (!sessionToken) {
      const authHeader = req.headers.authorization;
      if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
        sessionToken = authHeader.slice(7);
      }
    }
    const session = await this.verifySession(sessionToken);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    if (session.openId.startsWith(CRON_OPEN_ID_PREFIX)) {
      const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
      const taskUid = userInfo.taskUid ?? null;
      if (!taskUid) {
        throw ForbiddenError("Cron session missing task_uid");
      }
      return buildCronUser(userInfo);
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionToken ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var CRON_OPEN_ID_PREFIX = "cron_";
function buildCronUser(userInfo) {
  const now = /* @__PURE__ */ new Date();
  return {
    id: -1,
    openId: userInfo.openId,
    name: userInfo.name || "Manus Scheduled Task",
    email: null,
    loginMethod: null,
    role: "user",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
    taskUid: userInfo.taskUid ?? void 0,
    isCron: true
  };
}
var sdk = new SDKServer();

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/oauth.ts
import { parse as parseCookieHeader2 } from "cookie";
function getQueryParam(req, key2) {
  const value = req.query[key2];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", async (req, res) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    const { nonce } = decodeOAuthState(state);
    const expectedNonce = parseCookieHeader2(req.headers.cookie ?? "")[OAUTH_STATE_COOKIE];
    if (!nonce || nonce !== expectedNonce) {
      res.status(403).json({ error: "invalid oauth state" });
      return;
    }
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/", secure: true, sameSite: "none" });
    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }
      await upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS
      });
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}

// server/_core/storageProxy.ts
function registerStorageProxy(app) {
  app.get("/manus-storage/*", async (req, res) => {
    const key2 = req.params[0];
    if (!key2) {
      res.status(400).send("Missing storage key");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }
    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/"
      );
      forgeUrl.searchParams.set("path", key2);
      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` }
      });
      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = await forgeResp.json();
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}

// server/app.ts
function createApp() {
  const app = express();
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({ router: appRouter, createContext })
  );
  app.get("/api/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });
  return app;
}

// server/_core/vite.ts
import express2 from "express";
import fs2 from "fs";
import { nanoid } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
var PROJECT_ROOT = import.meta.dirname;
var LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
var MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024;
var TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6);
function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}
function trimLogFile(logPath, maxSize) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) {
      return;
    }
    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines = [];
    let keptBytes = 0;
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}
`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }
    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
  }
}
function writeToLogFile(source, entries) {
  if (entries.length === 0) return;
  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);
  const lines = entries.map((entry) => {
    const ts = (/* @__PURE__ */ new Date()).toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });
  fs.appendFileSync(logPath, `${lines.join("\n")}
`, "utf-8");
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}
function vitePluginManusDebugCollector() {
  return {
    name: "manus-debug-collector",
    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") {
        return html;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js",
              defer: true
            },
            injectTo: "head"
          }
        ]
      };
    },
    configureServer(server) {
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }
        const handlePayload = (payload) => {
          if (payload.consoleLogs?.length > 0) {
            writeToLogFile("browserConsole", payload.consoleLogs);
          }
          if (payload.networkRequests?.length > 0) {
            writeToLogFile("networkRequests", payload.networkRequests);
          }
          if (payload.sessionEvents?.length > 0) {
            writeToLogFile("sessionReplay", payload.sessionEvents);
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        };
        const reqBody = req.body;
        if (reqBody && typeof reqBody === "object") {
          try {
            handlePayload(reqBody);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            handlePayload(payload);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
        });
      });
    }
  };
}
var plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), vitePluginManusDebugCollector()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? path2.resolve(import.meta.dirname, "../..", "dist", "public") : path2.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express2.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = createApp();
  const server = createServer(app);
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
startServer().catch(console.error);
