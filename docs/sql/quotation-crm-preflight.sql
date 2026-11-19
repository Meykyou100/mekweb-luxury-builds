-- Read-only. Run in the NEW development project's SQL Editor as postgres.
-- A PASS result means the prerequisites below hold, not that the migration ran.
do $preflight$
declare t text;
begin
 if current_user <> 'postgres' then raise exception 'Choose the postgres role in SQL Editor'; end if;
 if to_regnamespace('crm_private') is not null then raise exception 'CRM_ALREADY_EXISTS: stop; do not rerun the foundation'; end if;
 if to_regclass('auth.users') is null or to_regclass('auth.sessions') is null or to_regclass('storage.objects') is null or to_regclass('storage.buckets') is null or to_regprocedure('auth.uid()') is null or to_regprocedure('auth.jwt()') is null then raise exception 'SUPABASE_REQUIRED: Auth and Storage must be initialized'; end if;
 perform id from auth.users limit 0;
 perform id,user_id from auth.sessions limit 0;
 if not (select relrowsecurity from pg_class where oid='storage.objects'::regclass) then raise exception 'STORAGE_RLS_REQUIRED'; end if;
 if exists(select 1 from storage.buckets where id='crm-documents') then raise exception 'BUCKET_ALREADY_EXISTS: stop and inspect; do not adopt the bucket'; end if;
 foreach t in array array['admin_profiles','clients','project_requests','request_requirements','agency_settings','quotes','quote_items','quote_versions','quote_events','projects','documents','activity_logs','pricing_catalog','submission_sessions','background_jobs','delivery_events','rate_limit_buckets'] loop
  if to_regclass('public.'||t) is not null then raise exception 'APPLICATION_TABLE_ALREADY_EXISTS: %',t; end if;
 end loop;
 if exists(select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname in ('crm_admin_session_valid','crm_submit_request','crm_rate_limit','crm_save_quote','crm_finalize_quote','crm_quote_action','crm_claim_jobs','crm_schedule_purge','crm_purge_request','crm_queue_retention')) then raise exception 'CRM_RPC_ALREADY_EXISTS'; end if;
end $preflight$;
select 'PASS: fresh-project prerequisites; the migration has NOT been applied' as result,current_user as migration_role;
