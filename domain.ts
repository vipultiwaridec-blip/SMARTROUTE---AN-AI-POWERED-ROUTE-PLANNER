// Shared domain names and values, exactly as the check constraints in 06-PHYSICAL-SCHEMA §3.

export type Role = "resident" | "worker" | "admin" | "supervisor" | "higher_authority";

/** Kind of work for the worker role (migration 0800): a driver runs vehicle trips. */
export type WorkerType = "collector" | "driver";

export type ReportStatus =
  | "submitted"
  | "assigned"
  | "returned"
  | "awaiting_review"
  | "disputed"
  | "closed"
  | "reopened"
  | "cancelled"
  | "rejected";

export type PickupStatus = "requested" | "scheduled" | "collected" | "cancelled" | "declined" | "missed" | "refused";

export type IssueType =
  | "overflowing_bin"
  | "garbage_on_road"
  | "missed_collection"
  | "illegal_dumping"
  | "improper_segregation"
  | "other";

export type WasteCategory = "wet" | "dry" | "biomedical" | "hazardous" | "e_waste" | "mixed_uncertain";

export type FeedbackResult = "resolved" | "partly" | "not_resolved";

export type Satisfaction = "satisfied" | "neutral" | "unsatisfied";

export type LocationSource = "gps" | "registered" | "manual" | "qr" | "pickup";
