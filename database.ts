
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  
  "public": {
          Tables: {
            "admin_audit_log": {
                  Row: {
                    "action": string,"actor_id": string | null,"created_at": string,"id": string,"new_json": Json | null,"old_json": Json | null,"org_id": string,"record_id": string,"table_name": string
                  }
                  Insert: {
                    "action": string,"actor_id"?: string | null,"created_at"?: string,"id"?: string,"new_json"?: Json | null,"old_json"?: Json | null,"org_id": string,"record_id": string,"table_name": string
                  }
                  Update: {
                    "action"?: string,"actor_id"?: string | null,"created_at"?: string,"id"?: string,"new_json"?: Json | null,"old_json"?: Json | null,"org_id"?: string,"record_id"?: string,"table_name"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "admin_audit_log_actor_id_fkey"
      columns: ["actor_id"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "admin_audit_log_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"ai_runs": {
                  Row: {
                    "category": string | null,"confidence": string | null,"created_at": string,"error": string | null,"feature": string,"id": string,"latency_ms": number | null,"model": string | null,"org_id": string,"output_json": Json | null,"provider": string | null,"record_id": string | null,"record_type": string | null,"user_id": string
                  }
                  Insert: {
                    "category"?: string | null,"confidence"?: string | null,"created_at"?: string,"error"?: string | null,"feature"?: string,"id"?: string,"latency_ms"?: number | null,"model"?: string | null,"org_id": string,"output_json"?: Json | null,"provider"?: string | null,"record_id"?: string | null,"record_type"?: string | null,"user_id": string
                  }
                  Update: {
                    "category"?: string | null,"confidence"?: string | null,"created_at"?: string,"error"?: string | null,"feature"?: string,"id"?: string,"latency_ms"?: number | null,"model"?: string | null,"org_id"?: string,"output_json"?: Json | null,"provider"?: string | null,"record_id"?: string | null,"record_type"?: string | null,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "ai_runs_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "ai_runs_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    }
                  ]
                },"areas": {
                  Row: {
                    "active": boolean,"created_at": string,"id": string,"name": string,"org_id": string
                  }
                  Insert: {
                    "active"?: boolean,"created_at"?: string,"id"?: string,"name": string,"org_id": string
                  }
                  Update: {
                    "active"?: boolean,"created_at"?: string,"id"?: string,"name"?: string,"org_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "areas_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"collection_runs": {
                  Row: {
                    "created_at": string,"id": string,"org_id": string,"run_date": string,"schedule_id": string,"status": string,"trip_id": string | null
                  }
                  Insert: {
                    "created_at"?: string,"id"?: string,"org_id": string,"run_date": string,"schedule_id": string,"status": string,"trip_id"?: string | null
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"org_id"?: string,"run_date"?: string,"schedule_id"?: string,"status"?: string,"trip_id"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "collection_runs_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "collection_runs_schedule_id_fkey"
      columns: ["schedule_id"]
isOneToOne: false
      referencedRelation: "collection_schedules"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "collection_runs_trip_id_fkey"
      columns: ["trip_id"]
isOneToOne: false
      referencedRelation: "vehicle_trips"
      referencedColumns: ["id"]
    }
                  ]
                },"collection_schedules": {
                  Row: {
                    "active": boolean,"area_id": string,"created_at": string,"days_of_week": (number)[],"driver_id": string | null,"end_time": string,"id": string,"org_id": string,"start_time": string,"vehicle_id": string | null,"waste_type": string
                  }
                  Insert: {
                    "active"?: boolean,"area_id": string,"created_at"?: string,"days_of_week": (number)[],"driver_id"?: string | null,"end_time": string,"id"?: string,"org_id": string,"start_time": string,"vehicle_id"?: string | null,"waste_type": string
                  }
                  Update: {
                    "active"?: boolean,"area_id"?: string,"created_at"?: string,"days_of_week"?: (number)[],"driver_id"?: string | null,"end_time"?: string,"id"?: string,"org_id"?: string,"start_time"?: string,"vehicle_id"?: string | null,"waste_type"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "collection_schedules_area_id_fkey"
      columns: ["area_id"]
isOneToOne: false
      referencedRelation: "areas"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "collection_schedules_area_id_org_id_fkey"
      columns: ["area_id","org_id"]
isOneToOne: false
      referencedRelation: "areas"
      referencedColumns: ["id","org_id"]
    },{
      foreignKeyName: "collection_schedules_driver_id_fkey"
      columns: ["driver_id"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "collection_schedules_driver_id_org_id_fkey"
      columns: ["driver_id","org_id"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id","org_id"]
    },{
      foreignKeyName: "collection_schedules_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "collection_schedules_vehicle_id_fkey"
      columns: ["vehicle_id"]
isOneToOne: false
      referencedRelation: "vehicles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "collection_schedules_vehicle_id_org_id_fkey"
      columns: ["vehicle_id","org_id"]
isOneToOne: false
      referencedRelation: "vehicles"
      referencedColumns: ["id","org_id"]
    }
                  ]
                },"location_risk": {
                  Row: {
                    "computed_for_date": string,"created_at": string,"factors_json": NonNullable<Json>,"id": string,"location_id": string,"org_id": string,"score": number
                  }
                  Insert: {
                    "computed_for_date": string,"created_at"?: string,"factors_json": NonNullable<Json>,"id"?: string,"location_id": string,"org_id": string,"score": number
                  }
                  Update: {
                    "computed_for_date"?: string,"created_at"?: string,"factors_json"?: NonNullable<Json>,"id"?: string,"location_id"?: string,"org_id"?: string,"score"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "location_risk_location_id_fkey"
      columns: ["location_id"]
isOneToOne: false
      referencedRelation: "locations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "location_risk_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"locations": {
                  Row: {
                    "active": boolean,"address": string | null,"area_id": string | null,"created_at": string,"geofence_m": number | null,"id": string,"kind": string,"lat": number | null,"lng": number | null,"name": string,"org_id": string,"qr_code": string | null
                  }
                  Insert: {
                    "active"?: boolean,"address"?: string | null,"area_id"?: string | null,"created_at"?: string,"geofence_m"?: number | null,"id"?: string,"kind": string,"lat"?: number | null,"lng"?: number | null,"name": string,"org_id": string,"qr_code"?: string | null
                  }
                  Update: {
                    "active"?: boolean,"address"?: string | null,"area_id"?: string | null,"created_at"?: string,"geofence_m"?: number | null,"id"?: string,"kind"?: string,"lat"?: number | null,"lng"?: number | null,"name"?: string,"org_id"?: string,"qr_code"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "locations_area_id_fkey"
      columns: ["area_id"]
isOneToOne: false
      referencedRelation: "areas"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "locations_area_id_org_id_fkey"
      columns: ["area_id","org_id"]
isOneToOne: false
      referencedRelation: "areas"
      referencedColumns: ["id","org_id"]
    },{
      foreignKeyName: "locations_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"notifications": {
                  Row: {
                    "created_at": string,"id": string,"message": string,"org_id": string,"read_at": string | null,"record_id": string | null,"record_type": string | null,"type": string,"user_id": string
                  }
                  Insert: {
                    "created_at"?: string,"id"?: string,"message": string,"org_id": string,"read_at"?: string | null,"record_id"?: string | null,"record_type"?: string | null,"type": string,"user_id": string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"message"?: string,"org_id"?: string,"read_at"?: string | null,"record_id"?: string | null,"record_type"?: string | null,"type"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "notifications_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "notifications_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    }
                  ]
                },"organizations": {
                  Row: {
                    "afternoon_slot_end": string,"ai_daily_limit_per_org": number,"ai_daily_limit_per_user": number,"created_at": string,"daily_report_limit": number,"deadline_hours_json": NonNullable<Json>,"disposal_geofence_m": number,"escalation_after_hours": number,"escalation_level2_after_hours": number,"far_from_site_m": number,"hazardous_deadline_hours": number,"id": string,"is_demo": boolean,"max_open_pickups": number,"morning_slot_end": string,"name": string,"no_reply_hours": number,"perf_min_cases": number,"perf_period_days": number,"perf_sla_threshold_pct": number,"points_per_verified_report": number,"recurrence_threshold": number,"recurrence_window_days": number,"reopen_window_days": number,"segregation_policy": string,"segregation_warn_threshold": number,"segregation_warn_window_days": number,"signed_link_minutes": number,"timezone": string,"type": string
                  }
                  Insert: {
                    "afternoon_slot_end"?: string,"ai_daily_limit_per_org"?: number,"ai_daily_limit_per_user"?: number,"created_at"?: string,"daily_report_limit"?: number,"deadline_hours_json"?: NonNullable<Json>,"disposal_geofence_m"?: number,"escalation_after_hours"?: number,"escalation_level2_after_hours"?: number,"far_from_site_m"?: number,"hazardous_deadline_hours"?: number,"id"?: string,"is_demo"?: boolean,"max_open_pickups"?: number,"morning_slot_end"?: string,"name": string,"no_reply_hours"?: number,"perf_min_cases"?: number,"perf_period_days"?: number,"perf_sla_threshold_pct"?: number,"points_per_verified_report"?: number,"recurrence_threshold"?: number,"recurrence_window_days"?: number,"reopen_window_days"?: number,"segregation_policy"?: string,"segregation_warn_threshold"?: number,"segregation_warn_window_days"?: number,"signed_link_minutes"?: number,"timezone"?: string,"type": string
                  }
                  Update: {
                    "afternoon_slot_end"?: string,"ai_daily_limit_per_org"?: number,"ai_daily_limit_per_user"?: number,"created_at"?: string,"daily_report_limit"?: number,"deadline_hours_json"?: NonNullable<Json>,"disposal_geofence_m"?: number,"escalation_after_hours"?: number,"escalation_level2_after_hours"?: number,"far_from_site_m"?: number,"hazardous_deadline_hours"?: number,"id"?: string,"is_demo"?: boolean,"max_open_pickups"?: number,"morning_slot_end"?: string,"name"?: string,"no_reply_hours"?: number,"perf_min_cases"?: number,"perf_period_days"?: number,"perf_sla_threshold_pct"?: number,"points_per_verified_report"?: number,"recurrence_threshold"?: number,"recurrence_window_days"?: number,"reopen_window_days"?: number,"segregation_policy"?: string,"segregation_warn_threshold"?: number,"segregation_warn_window_days"?: number,"signed_link_minutes"?: number,"timezone"?: string,"type"?: string
                  }
                  Relationships: [
                    
                  ]
                },"performance_flags": {
                  Row: {
                    "created_at": string,"id": string,"metric": string,"org_id": string,"outcome": string | null,"outcome_note": string | null,"period_end": string,"period_start": string,"raised_to_role": string,"status": string,"subject_id": string,"subject_type": string,"threshold": number,"value": number
                  }
                  Insert: {
                    "created_at"?: string,"id"?: string,"metric": string,"org_id": string,"outcome"?: string | null,"outcome_note"?: string | null,"period_end": string,"period_start": string,"raised_to_role": string,"status"?: string,"subject_id": string,"subject_type": string,"threshold": number,"value": number
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"metric"?: string,"org_id"?: string,"outcome"?: string | null,"outcome_note"?: string | null,"period_end"?: string,"period_start"?: string,"raised_to_role"?: string,"status"?: string,"subject_id"?: string,"subject_type"?: string,"threshold"?: number,"value"?: number
                  }
                  Relationships: [
                    {
      foreignKeyName: "performance_flags_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"pickup_events": {
                  Row: {
                    "actor_id": string | null,"created_at": string,"id": string,"note": string | null,"old_date": string | null,"old_slot": string | null,"org_id": string,"pickup_id": string,"type": string
                  }
                  Insert: {
                    "actor_id"?: string | null,"created_at"?: string,"id"?: string,"note"?: string | null,"old_date"?: string | null,"old_slot"?: string | null,"org_id": string,"pickup_id": string,"type": string
                  }
                  Update: {
                    "actor_id"?: string | null,"created_at"?: string,"id"?: string,"note"?: string | null,"old_date"?: string | null,"old_slot"?: string | null,"org_id"?: string,"pickup_id"?: string,"type"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "pickup_events_actor_id_fkey"
      columns: ["actor_id"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "pickup_events_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "pickup_events_pickup_id_fkey"
      columns: ["pickup_id"]
isOneToOne: false
      referencedRelation: "pickup_requests"
      referencedColumns: ["id"]
    }
                  ]
                },"pickup_requests": {
                  Row: {
                    "address": string | null,"assigned_worker_id": string | null,"created_at": string,"decline_reason": string | null,"id": string,"lat": number | null,"lng": number | null,"note": string | null,"org_id": string,"photo_url": string | null,"preferred_date": string,"refuse_reason": string | null,"requester_id": string,"segregation_ok": boolean | null,"slot": string,"status": string,"updated_at": string,"waste_type": string
                  }
                  Insert: {
                    "address"?: string | null,"assigned_worker_id"?: string | null,"created_at"?: string,"decline_reason"?: string | null,"id"?: string,"lat"?: number | null,"lng"?: number | null,"note"?: string | null,"org_id": string,"photo_url"?: string | null,"preferred_date": string,"refuse_reason"?: string | null,"requester_id": string,"segregation_ok"?: boolean | null,"slot": string,"status"?: string,"updated_at"?: string,"waste_type": string
                  }
                  Update: {
                    "address"?: string | null,"assigned_worker_id"?: string | null,"created_at"?: string,"decline_reason"?: string | null,"id"?: string,"lat"?: number | null,"lng"?: number | null,"note"?: string | null,"org_id"?: string,"photo_url"?: string | null,"preferred_date"?: string,"refuse_reason"?: string | null,"requester_id"?: string,"segregation_ok"?: boolean | null,"slot"?: string,"status"?: string,"updated_at"?: string,"waste_type"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "pickup_requests_assigned_worker_id_fkey"
      columns: ["assigned_worker_id"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "pickup_requests_assigned_worker_id_org_id_fkey"
      columns: ["assigned_worker_id","org_id"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id","org_id"]
    },{
      foreignKeyName: "pickup_requests_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "pickup_requests_requester_id_fkey"
      columns: ["requester_id"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    }
                  ]
                },"prevention_reviews": {
                  Row: {
                    "action": string | null,"created_at": string,"created_by": string,"id": string,"location_id": string,"org_id": string,"outcome_note": string | null,"owner_name": string | null,"review_date": string | null,"status": string,"suspected_cause": string | null
                  }
                  Insert: {
                    "action"?: string | null,"created_at"?: string,"created_by": string,"id"?: string,"location_id": string,"org_id": string,"outcome_note"?: string | null,"owner_name"?: string | null,"review_date"?: string | null,"status"?: string,"suspected_cause"?: string | null
                  }
                  Update: {
                    "action"?: string | null,"created_at"?: string,"created_by"?: string,"id"?: string,"location_id"?: string,"org_id"?: string,"outcome_note"?: string | null,"owner_name"?: string | null,"review_date"?: string | null,"status"?: string,"suspected_cause"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "prevention_reviews_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "prevention_reviews_location_id_fkey"
      columns: ["location_id"]
isOneToOne: false
      referencedRelation: "locations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "prevention_reviews_location_id_org_id_fkey"
      columns: ["location_id","org_id"]
isOneToOne: false
      referencedRelation: "locations"
      referencedColumns: ["id","org_id"]
    },{
      foreignKeyName: "prevention_reviews_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"report_events": {
                  Row: {
                    "actor_id": string | null,"created_at": string,"data": Json | null,"id": string,"note": string | null,"org_id": string,"photo_url": string | null,"report_id": string,"type": string
                  }
                  Insert: {
                    "actor_id"?: string | null,"created_at"?: string,"data"?: Json | null,"id"?: string,"note"?: string | null,"org_id": string,"photo_url"?: string | null,"report_id": string,"type": string
                  }
                  Update: {
                    "actor_id"?: string | null,"created_at"?: string,"data"?: Json | null,"id"?: string,"note"?: string | null,"org_id"?: string,"photo_url"?: string | null,"report_id"?: string,"type"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "report_events_actor_id_fkey"
      columns: ["actor_id"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "report_events_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "report_events_report_id_fkey"
      columns: ["report_id"]
isOneToOne: false
      referencedRelation: "reports"
      referencedColumns: ["id"]
    }
                  ]
                },"report_followers": {
                  Row: {
                    "created_at": string,"id": string,"org_id": string,"report_id": string,"user_id": string
                  }
                  Insert: {
                    "created_at"?: string,"id"?: string,"org_id": string,"report_id": string,"user_id": string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"org_id"?: string,"report_id"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "report_followers_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "report_followers_report_id_fkey"
      columns: ["report_id"]
isOneToOne: false
      referencedRelation: "reports"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "report_followers_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    }
                  ]
                },"reports": {
                  Row: {
                    "ai_category": string | null,"ai_confidence": string | null,"ai_hazard": boolean | null,"ai_reason": string | null,"assigned_worker_id": string | null,"attempt_count": number,"close_reason": string | null,"closed_as_valid": boolean | null,"closed_at": string | null,"completion_lat": number | null,"completion_lng": number | null,"completion_note": string | null,"completion_photo_url": string | null,"created_at": string,"device_lat": number | null,"device_lng": number | null,"due_at": string,"escalated": boolean,"escalation_level": number,"far_from_site": boolean,"feedback": string,"feedback_comment": string | null,"id": string,"is_new_incident": boolean,"issue_type": string,"lat": number | null,"lng": number | null,"location_accuracy_m": number | null,"location_corrected": boolean,"location_id": string | null,"location_mismatch": boolean,"location_source": string | null,"note": string | null,"org_id": string,"overdue_notified": boolean,"photo_url": string | null,"reopen_count": number,"reporter_id": string,"satisfaction": string | null,"schedule_id": string | null,"sla_met": boolean | null,"source": string,"source_pickup_id": string | null,"status": string,"waste_category": string | null
                  }
                  Insert: {
                    "ai_category"?: string | null,"ai_confidence"?: string | null,"ai_hazard"?: boolean | null,"ai_reason"?: string | null,"assigned_worker_id"?: string | null,"attempt_count"?: number,"close_reason"?: string | null,"closed_as_valid"?: boolean | null,"closed_at"?: string | null,"completion_lat"?: number | null,"completion_lng"?: number | null,"completion_note"?: string | null,"completion_photo_url"?: string | null,"created_at"?: string,"device_lat"?: number | null,"device_lng"?: number | null,"due_at": string,"escalated"?: boolean,"escalation_level"?: number,"far_from_site"?: boolean,"feedback"?: string,"feedback_comment"?: string | null,"id"?: string,"is_new_incident"?: boolean,"issue_type": string,"lat"?: number | null,"lng"?: number | null,"location_accuracy_m"?: number | null,"location_corrected"?: boolean,"location_id"?: string | null,"location_mismatch"?: boolean,"location_source"?: string | null,"note"?: string | null,"org_id": string,"overdue_notified"?: boolean,"photo_url"?: string | null,"reopen_count"?: number,"reporter_id": string,"satisfaction"?: string | null,"schedule_id"?: string | null,"sla_met"?: boolean | null,"source"?: string,"source_pickup_id"?: string | null,"status"?: string,"waste_category"?: string | null
                  }
                  Update: {
                    "ai_category"?: string | null,"ai_confidence"?: string | null,"ai_hazard"?: boolean | null,"ai_reason"?: string | null,"assigned_worker_id"?: string | null,"attempt_count"?: number,"close_reason"?: string | null,"closed_as_valid"?: boolean | null,"closed_at"?: string | null,"completion_lat"?: number | null,"completion_lng"?: number | null,"completion_note"?: string | null,"completion_photo_url"?: string | null,"created_at"?: string,"device_lat"?: number | null,"device_lng"?: number | null,"due_at"?: string,"escalated"?: boolean,"escalation_level"?: number,"far_from_site"?: boolean,"feedback"?: string,"feedback_comment"?: string | null,"id"?: string,"is_new_incident"?: boolean,"issue_type"?: string,"lat"?: number | null,"lng"?: number | null,"location_accuracy_m"?: number | null,"location_corrected"?: boolean,"location_id"?: string | null,"location_mismatch"?: boolean,"location_source"?: string | null,"note"?: string | null,"org_id"?: string,"overdue_notified"?: boolean,"photo_url"?: string | null,"reopen_count"?: number,"reporter_id"?: string,"satisfaction"?: string | null,"schedule_id"?: string | null,"sla_met"?: boolean | null,"source"?: string,"source_pickup_id"?: string | null,"status"?: string,"waste_category"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "reports_assigned_worker_id_fkey"
      columns: ["assigned_worker_id"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reports_assigned_worker_id_org_id_fkey"
      columns: ["assigned_worker_id","org_id"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id","org_id"]
    },{
      foreignKeyName: "reports_location_id_fkey"
      columns: ["location_id"]
isOneToOne: false
      referencedRelation: "locations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reports_location_id_org_id_fkey"
      columns: ["location_id","org_id"]
isOneToOne: false
      referencedRelation: "locations"
      referencedColumns: ["id","org_id"]
    },{
      foreignKeyName: "reports_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reports_reporter_id_fkey"
      columns: ["reporter_id"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reports_schedule_id_fkey"
      columns: ["schedule_id"]
isOneToOne: false
      referencedRelation: "collection_schedules"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reports_schedule_id_org_id_fkey"
      columns: ["schedule_id","org_id"]
isOneToOne: false
      referencedRelation: "collection_schedules"
      referencedColumns: ["id","org_id"]
    },{
      foreignKeyName: "reports_source_pickup_id_fkey"
      columns: ["source_pickup_id"]
isOneToOne: false
      referencedRelation: "pickup_requests"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reports_source_pickup_id_org_id_fkey"
      columns: ["source_pickup_id","org_id"]
isOneToOne: false
      referencedRelation: "pickup_requests"
      referencedColumns: ["id","org_id"]
    }
                  ]
                },"reward_events": {
                  Row: {
                    "created_at": string,"id": string,"org_id": string,"points": number,"reason": string,"report_id": string,"user_id": string
                  }
                  Insert: {
                    "created_at"?: string,"id"?: string,"org_id": string,"points": number,"reason": string,"report_id": string,"user_id": string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"org_id"?: string,"points"?: number,"reason"?: string,"report_id"?: string,"user_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "reward_events_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reward_events_report_id_fkey"
      columns: ["report_id"]
isOneToOne: false
      referencedRelation: "reports"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "reward_events_user_id_fkey"
      columns: ["user_id"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    }
                  ]
                },"staff_roster": {
                  Row: {
                    "added_by": string | null,"claimed_at": string | null,"claimed_by": string | null,"created_at": string,"email": string,"id": string,"org_id": string,"role": string,"staff_id": string,"worker_type": string | null
                  }
                  Insert: {
                    "added_by"?: string | null,"claimed_at"?: string | null,"claimed_by"?: string | null,"created_at"?: string,"email": string,"id"?: string,"org_id": string,"role": string,"staff_id": string,"worker_type"?: string | null
                  }
                  Update: {
                    "added_by"?: string | null,"claimed_at"?: string | null,"claimed_by"?: string | null,"created_at"?: string,"email"?: string,"id"?: string,"org_id"?: string,"role"?: string,"staff_id"?: string,"worker_type"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "staff_roster_added_by_fkey"
      columns: ["added_by"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "staff_roster_claimed_by_fkey"
      columns: ["claimed_by"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "staff_roster_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"trip_events": {
                  Row: {
                    "accuracy_m": number | null,"created_at": string,"driver_id": string,"id": string,"lat": number | null,"lng": number | null,"org_id": string,"photo_url": string | null,"scan_method": string | null,"stop_id": string | null,"trip_id": string,"type": string
                  }
                  Insert: {
                    "accuracy_m"?: number | null,"created_at"?: string,"driver_id": string,"id"?: string,"lat"?: number | null,"lng"?: number | null,"org_id": string,"photo_url"?: string | null,"scan_method"?: string | null,"stop_id"?: string | null,"trip_id": string,"type": string
                  }
                  Update: {
                    "accuracy_m"?: number | null,"created_at"?: string,"driver_id"?: string,"id"?: string,"lat"?: number | null,"lng"?: number | null,"org_id"?: string,"photo_url"?: string | null,"scan_method"?: string | null,"stop_id"?: string | null,"trip_id"?: string,"type"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "trip_events_driver_id_fkey"
      columns: ["driver_id"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "trip_events_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "trip_events_stop_id_fkey"
      columns: ["stop_id"]
isOneToOne: false
      referencedRelation: "trip_stops"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "trip_events_trip_id_fkey"
      columns: ["trip_id"]
isOneToOne: false
      referencedRelation: "vehicle_trips"
      referencedColumns: ["id"]
    }
                  ]
                },"trip_points": {
                  Row: {
                    "accuracy_m": number | null,"id": string,"lat": number,"lng": number,"org_id": string,"recorded_at": string,"trip_id": string
                  }
                  Insert: {
                    "accuracy_m"?: number | null,"id"?: string,"lat": number,"lng": number,"org_id": string,"recorded_at"?: string,"trip_id": string
                  }
                  Update: {
                    "accuracy_m"?: number | null,"id"?: string,"lat"?: number,"lng"?: number,"org_id"?: string,"recorded_at"?: string,"trip_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "trip_points_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "trip_points_trip_id_org_id_fkey"
      columns: ["trip_id","org_id"]
isOneToOne: false
      referencedRelation: "vehicle_trips"
      referencedColumns: ["id","org_id"]
    }
                  ]
                },"trip_stops": {
                  Row: {
                    "created_at": string,"id": string,"location_id": string | null,"org_id": string,"pickup_id": string | null,"segregation_ok": boolean | null,"seq": number,"skip_reason": string | null,"status": string,"trip_id": string
                  }
                  Insert: {
                    "created_at"?: string,"id"?: string,"location_id"?: string | null,"org_id": string,"pickup_id"?: string | null,"segregation_ok"?: boolean | null,"seq": number,"skip_reason"?: string | null,"status"?: string,"trip_id": string
                  }
                  Update: {
                    "created_at"?: string,"id"?: string,"location_id"?: string | null,"org_id"?: string,"pickup_id"?: string | null,"segregation_ok"?: boolean | null,"seq"?: number,"skip_reason"?: string | null,"status"?: string,"trip_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "trip_stops_location_id_fkey"
      columns: ["location_id"]
isOneToOne: false
      referencedRelation: "locations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "trip_stops_location_id_org_id_fkey"
      columns: ["location_id","org_id"]
isOneToOne: false
      referencedRelation: "locations"
      referencedColumns: ["id","org_id"]
    },{
      foreignKeyName: "trip_stops_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "trip_stops_pickup_id_fkey"
      columns: ["pickup_id"]
isOneToOne: false
      referencedRelation: "pickup_requests"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "trip_stops_pickup_id_org_id_fkey"
      columns: ["pickup_id","org_id"]
isOneToOne: false
      referencedRelation: "pickup_requests"
      referencedColumns: ["id","org_id"]
    },{
      foreignKeyName: "trip_stops_trip_id_fkey"
      columns: ["trip_id"]
isOneToOne: false
      referencedRelation: "vehicle_trips"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "trip_stops_trip_id_org_id_fkey"
      columns: ["trip_id","org_id"]
isOneToOne: false
      referencedRelation: "vehicle_trips"
      referencedColumns: ["id","org_id"]
    }
                  ]
                },"users": {
                  Row: {
                    "active": boolean,"area_id": string | null,"created_at": string,"email": string,"id": string,"name": string,"org_id": string,"phone": string | null,"role": string,"show_on_leaderboard": boolean,"staff_id": string | null,"worker_type": string | null
                  }
                  Insert: {
                    "active"?: boolean,"area_id"?: string | null,"created_at"?: string,"email": string,"id": string,"name": string,"org_id": string,"phone"?: string | null,"role"?: string,"show_on_leaderboard"?: boolean,"staff_id"?: string | null,"worker_type"?: string | null
                  }
                  Update: {
                    "active"?: boolean,"area_id"?: string | null,"created_at"?: string,"email"?: string,"id"?: string,"name"?: string,"org_id"?: string,"phone"?: string | null,"role"?: string,"show_on_leaderboard"?: boolean,"staff_id"?: string | null,"worker_type"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "users_area_id_fkey"
      columns: ["area_id"]
isOneToOne: false
      referencedRelation: "areas"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "users_area_id_org_id_fkey"
      columns: ["area_id","org_id"]
isOneToOne: false
      referencedRelation: "areas"
      referencedColumns: ["id","org_id"]
    },{
      foreignKeyName: "users_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"vehicle_trips": {
                  Row: {
                    "created_at": string,"disposal_check": string,"disposal_site_id": string | null,"distance_m": number,"driver_id": string,"ended_at": string | null,"from_area_id": string | null,"id": string,"is_simulated": boolean,"last_accuracy_m": number | null,"last_lat": number | null,"last_lng": number | null,"last_seen_at": string | null,"org_id": string,"schedule_id": string | null,"started_at": string | null,"status": string,"to_area_id": string | null,"trip_date": string,"unapproved_stop_count": number,"vehicle_id": string
                  }
                  Insert: {
                    "created_at"?: string,"disposal_check"?: string,"disposal_site_id"?: string | null,"distance_m"?: number,"driver_id": string,"ended_at"?: string | null,"from_area_id"?: string | null,"id"?: string,"is_simulated"?: boolean,"last_accuracy_m"?: number | null,"last_lat"?: number | null,"last_lng"?: number | null,"last_seen_at"?: string | null,"org_id": string,"schedule_id"?: string | null,"started_at"?: string | null,"status"?: string,"to_area_id"?: string | null,"trip_date": string,"unapproved_stop_count"?: number,"vehicle_id": string
                  }
                  Update: {
                    "created_at"?: string,"disposal_check"?: string,"disposal_site_id"?: string | null,"distance_m"?: number,"driver_id"?: string,"ended_at"?: string | null,"from_area_id"?: string | null,"id"?: string,"is_simulated"?: boolean,"last_accuracy_m"?: number | null,"last_lat"?: number | null,"last_lng"?: number | null,"last_seen_at"?: string | null,"org_id"?: string,"schedule_id"?: string | null,"started_at"?: string | null,"status"?: string,"to_area_id"?: string | null,"trip_date"?: string,"unapproved_stop_count"?: number,"vehicle_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "vehicle_trips_disposal_site_id_fkey"
      columns: ["disposal_site_id"]
isOneToOne: false
      referencedRelation: "locations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "vehicle_trips_disposal_site_id_org_id_fkey"
      columns: ["disposal_site_id","org_id"]
isOneToOne: false
      referencedRelation: "locations"
      referencedColumns: ["id","org_id"]
    },{
      foreignKeyName: "vehicle_trips_driver_id_fkey"
      columns: ["driver_id"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "vehicle_trips_driver_id_org_id_fkey"
      columns: ["driver_id","org_id"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id","org_id"]
    },{
      foreignKeyName: "vehicle_trips_from_area_id_org_id_fkey"
      columns: ["from_area_id","org_id"]
isOneToOne: false
      referencedRelation: "areas"
      referencedColumns: ["id","org_id"]
    },{
      foreignKeyName: "vehicle_trips_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "vehicle_trips_schedule_id_fkey"
      columns: ["schedule_id"]
isOneToOne: false
      referencedRelation: "collection_schedules"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "vehicle_trips_schedule_id_org_id_fkey"
      columns: ["schedule_id","org_id"]
isOneToOne: false
      referencedRelation: "collection_schedules"
      referencedColumns: ["id","org_id"]
    },{
      foreignKeyName: "vehicle_trips_to_area_id_org_id_fkey"
      columns: ["to_area_id","org_id"]
isOneToOne: false
      referencedRelation: "areas"
      referencedColumns: ["id","org_id"]
    },{
      foreignKeyName: "vehicle_trips_vehicle_id_fkey"
      columns: ["vehicle_id"]
isOneToOne: false
      referencedRelation: "vehicles"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "vehicle_trips_vehicle_id_org_id_fkey"
      columns: ["vehicle_id","org_id"]
isOneToOne: false
      referencedRelation: "vehicles"
      referencedColumns: ["id","org_id"]
    }
                  ]
                },"vehicles": {
                  Row: {
                    "active": boolean,"created_at": string,"default_driver_id": string | null,"id": string,"kind": string,"number": string,"org_id": string,"qr_code": string | null
                  }
                  Insert: {
                    "active"?: boolean,"created_at"?: string,"default_driver_id"?: string | null,"id"?: string,"kind": string,"number": string,"org_id": string,"qr_code"?: string | null
                  }
                  Update: {
                    "active"?: boolean,"created_at"?: string,"default_driver_id"?: string | null,"id"?: string,"kind"?: string,"number"?: string,"org_id"?: string,"qr_code"?: string | null
                  }
                  Relationships: [
                    {
      foreignKeyName: "vehicles_default_driver_id_fkey"
      columns: ["default_driver_id"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "vehicles_default_driver_id_org_id_fkey"
      columns: ["default_driver_id","org_id"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id","org_id"]
    },{
      foreignKeyName: "vehicles_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    }
                  ]
                },"worker_checkins": {
                  Row: {
                    "area_id": string,"checked_in_at": string,"id": string,"org_id": string,"worker_id": string
                  }
                  Insert: {
                    "area_id": string,"checked_in_at"?: string,"id"?: string,"org_id": string,"worker_id": string
                  }
                  Update: {
                    "area_id"?: string,"checked_in_at"?: string,"id"?: string,"org_id"?: string,"worker_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "worker_checkins_area_id_org_id_fkey"
      columns: ["area_id","org_id"]
isOneToOne: false
      referencedRelation: "areas"
      referencedColumns: ["id","org_id"]
    },{
      foreignKeyName: "worker_checkins_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "worker_checkins_worker_id_org_id_fkey"
      columns: ["worker_id","org_id"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id","org_id"]
    }
                  ]
                },"worker_duties": {
                  Row: {
                    "area_id": string,"created_at": string,"created_by": string | null,"done_at": string | null,"done_lat": number | null,"done_lng": number | null,"done_note": string | null,"duty_date": string,"end_time": string,"id": string,"location_id": string | null,"org_id": string,"photo_url": string | null,"start_lat": number | null,"start_lng": number | null,"start_time": string,"started_at": string | null,"status": string,"task": string,"worker_id": string
                  }
                  Insert: {
                    "area_id": string,"created_at"?: string,"created_by"?: string | null,"done_at"?: string | null,"done_lat"?: number | null,"done_lng"?: number | null,"done_note"?: string | null,"duty_date": string,"end_time": string,"id"?: string,"location_id"?: string | null,"org_id": string,"photo_url"?: string | null,"start_lat"?: number | null,"start_lng"?: number | null,"start_time": string,"started_at"?: string | null,"status"?: string,"task": string,"worker_id": string
                  }
                  Update: {
                    "area_id"?: string,"created_at"?: string,"created_by"?: string | null,"done_at"?: string | null,"done_lat"?: number | null,"done_lng"?: number | null,"done_note"?: string | null,"duty_date"?: string,"end_time"?: string,"id"?: string,"location_id"?: string | null,"org_id"?: string,"photo_url"?: string | null,"start_lat"?: number | null,"start_lng"?: number | null,"start_time"?: string,"started_at"?: string | null,"status"?: string,"task"?: string,"worker_id"?: string
                  }
                  Relationships: [
                    {
      foreignKeyName: "worker_duties_area_id_org_id_fkey"
      columns: ["area_id","org_id"]
isOneToOne: false
      referencedRelation: "areas"
      referencedColumns: ["id","org_id"]
    },{
      foreignKeyName: "worker_duties_created_by_fkey"
      columns: ["created_by"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "worker_duties_location_id_org_id_fkey"
      columns: ["location_id","org_id"]
isOneToOne: false
      referencedRelation: "locations"
      referencedColumns: ["id","org_id"]
    },{
      foreignKeyName: "worker_duties_org_id_fkey"
      columns: ["org_id"]
isOneToOne: false
      referencedRelation: "organizations"
      referencedColumns: ["id"]
    },{
      foreignKeyName: "worker_duties_worker_id_org_id_fkey"
      columns: ["worker_id","org_id"]
isOneToOne: false
      referencedRelation: "users"
      referencedColumns: ["id","org_id"]
    }
                  ]
                }
          }
          Views: {
            [_ in never]: never
          }
          Functions: {
            "add_delay_note":
{ Args: { "p_next_step": string,"p_reason": string,"p_report": string }; Returns: undefined
                           },
"add_evidence":
{ Args: { "p_note": string,"p_photo": string,"p_report": string }; Returns: undefined
                           },
"add_instruction":
{ Args: { "p_note": string,"p_report": string }; Returns: undefined
                           },
"add_staff_id":
{ Args: { "p_email": string,"p_role": string,"p_staff_id": string,"p_worker_type"?: string }; Returns: string
                           },
"ai_quota_left":
{ Args: Record<PropertyKey, never>; Returns: {
              "org_left": number,"user_left": number
            }[]
                           },
"assign_report":
{ Args: { "p_report": string,"p_worker": string }; Returns: undefined
                           },
"authority_cases":
{ Args: Record<PropertyKey, never>; Returns: string[]
                           },
"cancel_duty":
{ Args: { "p_duty": string }; Returns: undefined
                           },
"cancel_pickup":
{ Args: { "p_pickup": string }; Returns: undefined
                           },
"case_people":
{ Args: { "p_report": string }; Returns: {
              "reporter_first_name": string,"worker_first_name": string
            }[]
                           },
"case_summary":
{ Args: { "p_report": string }; Returns: {
              "area_name": string,"created_at": string,"due_at": string,"escalation_level": number,"event_types": Json,"issue_type": string,"location_name": string,"overdue": boolean,"report_id": string,"status": string
            }[]
                           },
"check_in":
{ Args: { "p_area": string }; Returns: undefined
                           },
"close_report":
{ Args: { "p_reason": string,"p_report": string,"p_valid": boolean }; Returns: undefined
                           },
"collect_pickup":
{ Args: { "p_photo_url"?: string,"p_pickup": string,"p_segregation_ok": boolean }; Returns: undefined
                           },
"complete_duty":
{ Args: { "p_duty": string,"p_lat"?: number,"p_lng"?: number,"p_note"?: string,"p_photo": string }; Returns: undefined
                           },
"complete_report":
{ Args: { "p_lat": number,"p_lng": number,"p_note": string,"p_photo_url": string,"p_report": string }; Returns: undefined
                           },
"correct_issue_type":
{ Args: { "p_report": string,"p_type": string }; Returns: undefined
                           },
"create_duties":
{ Args: { "p_area": string,"p_dates": (string)[],"p_end": string,"p_location": string,"p_start": string,"p_task": string,"p_worker": string }; Returns: number
                           },
"create_pickup":
{ Args: { "p_address": string,"p_id": string,"p_note": string,"p_preferred_date": string,"p_slot": string,"p_waste_type": string }; Returns: string
                           },
"create_report":
{ Args: { "p_accuracy_m": number,"p_ai_run_id"?: string,"p_device_lat"?: number,"p_device_lng"?: number,"p_id": string,"p_issue_type": string,"p_lat": number,"p_lng": number,"p_location_corrected"?: boolean,"p_location_id": string,"p_location_source": string,"p_note": string,"p_photo_url": string,"p_schedule_id"?: string,"p_waste_category": string }; Returns: string
                           },
"deactivate_user":
{ Args: { "p_user": string }; Returns: undefined
                           },
"decline_pickup":
{ Args: { "p_pickup": string,"p_reason": string }; Returns: undefined
                           },
"edit_pickup":
{ Args: { "p_address": string,"p_note": string,"p_pickup": string,"p_preferred_date": string,"p_slot": string,"p_waste_type": string }; Returns: undefined
                           },
"end_trip":
{ Args: { "p_lat"?: number,"p_lng"?: number,"p_trip": string }; Returns: undefined
                           },
"follow_report":
{ Args: { "p_report": string }; Returns: undefined
                           },
"followed_cases":
{ Args: Record<PropertyKey, never>; Returns: string[]
                           },
"get_leaderboard":
{ Args: { "p_area"?: string }; Returns: {
              "area_name": string,"first_name": string,"points": number
            }[]
                           },
"get_live_vehicles":
{ Args: Record<PropertyKey, never>; Returns: {
              "accuracy_m": number,"driver_first_name": string,"from_area": string,"is_mine": boolean,"last_seen_at": string,"lat": number,"lng": number,"started_at": string,"to_area": string,"trip_id": string,"vehicle_kind": string,"vehicle_number": string
            }[]
                           },
"get_next_collection":
{ Args: Record<PropertyKey, never>; Returns: {
              "collection_date": string,"end_time": string,"start_time": string,"waste_type": string
            }[]
                           },
"get_qr_sheet":
{ Args: Record<PropertyKey, never>; Returns: {
              "id": string,"kind": string,"name": string,"qr_code": string
            }[]
                           },
"get_trip_history":
{ Args: { "p_days"?: number }; Returns: {
              "distance_m": number,"driver_name": string,"ended_at": string,"from_area": string,"points": number,"started_at": string,"status": string,"to_area": string,"trip_id": string,"vehicle_number": string
            }[]
                           },
"get_vehicle_qr_sheet":
{ Args: Record<PropertyKey, never>; Returns: {
              "id": string,"kind": string,"number": string,"qr_code": string
            }[]
                           },
"list_areas_for_signup":
{ Args: { "p_org": string }; Returns: {
              "id": string,"name": string
            }[]
                           },
"list_orgs_for_signup":
{ Args: Record<PropertyKey, never>; Returns: {
              "id": string,"name": string,"type": string
            }[]
                           },
"open_case_at":
{ Args: { "p_location": string }; Returns: {
              "created_at": string,"issue_type": string,"report_id": string,"status": string
            }[]
                           },
"reactivate_user":
{ Args: { "p_user": string }; Returns: undefined
                           },
"refuse_pickup":
{ Args: { "p_photo_url": string,"p_pickup": string,"p_reason": string }; Returns: undefined
                           },
"reject_report":
{ Args: { "p_reason": string,"p_report": string }; Returns: undefined
                           },
"remove_staff_id":
{ Args: { "p_id": string }; Returns: undefined
                           },
"reopen_report":
{ Args: { "p_photo"?: string,"p_reason": string,"p_report": string }; Returns: undefined
                           },
"reschedule_pickup":
{ Args: { "p_date": string,"p_pickup": string,"p_slot": string }; Returns: undefined
                           },
"reserve_ai_run":
{ Args: { "p_model": string,"p_user": string }; Returns: string
                           },
"resolve_qr":
{ Args: { "p_code": string }; Returns: {
              "id": string,"kind": string,"lat": number,"lng": number,"name": string
            }[]
                           },
"return_report":
{ Args: { "p_reason": string,"p_report": string }; Returns: undefined
                           },
"schedule_pickup":
{ Args: { "p_date": string,"p_pickup": string,"p_slot": string,"p_worker"?: string }; Returns: undefined
                           },
"set_worker_area":
{ Args: { "p_area": string,"p_worker": string }; Returns: undefined
                           },
"start_duty":
{ Args: { "p_duty": string,"p_lat"?: number,"p_lng"?: number }; Returns: undefined
                           },
"start_trip":
{ Args: { "p_accuracy_m"?: number,"p_code": string,"p_from_area": string,"p_lat"?: number,"p_lng"?: number,"p_scan_method": string,"p_to_area": string }; Returns: string
                           },
"submit_feedback":
{ Args: { "p_comment": string,"p_feedback": string,"p_report": string,"p_satisfaction"?: string }; Returns: undefined
                           },
"update_trip_position":
{ Args: { "p_accuracy_m"?: number,"p_lat": number,"p_lng": number,"p_trip": string }; Returns: undefined
                           }
          }
          Enums: {
            [_ in never]: never
          }
          CompositeTypes: {
            [_ in never]: never
          }
        }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export const Constants = {
  "public": {
          Enums: {
            
          }
        }
} as const

