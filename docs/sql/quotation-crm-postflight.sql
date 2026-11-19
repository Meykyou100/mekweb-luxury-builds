-- Read-only checks. Run as postgres AFTER the entire foundation commits.
-- This checks grants/policies, not a real hosted Auth/Storage API request.
do $verify$
declare t text; r record; f regprocedure;
begin
 foreach t in array array['admin_profiles','clients','project_requests','request_requirements','agency_settings','quotes','quote_items','quote_versions','quote_events','projects','documents','activity_logs','pricing_catalog','submission_sessions','background_jobs','delivery_events','rate_limit_buckets'] loop
  if to_regclass('public.'||t) is null then raise exception 'MISSING_TABLE: %',t; end if;
  if not (select relrowsecurity from pg_class where oid=to_regclass('public.'||t)) then raise exception 'RLS_DISABLED: %',t; end if;
  if has_table_privilege('anon','public.'||t,'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') then raise exception 'ANON_TABLE_GRANT: %',t; end if;
  if has_table_privilege('authenticated','public.'||t,'TRUNCATE,REFERENCES,TRIGGER') then raise exception 'EXCESS_AUTH_GRANT: %',t; end if;
  if has_table_privilege('service_role','public.'||t,'TRUNCATE,REFERENCES,TRIGGER') then raise exception 'EXCESS_SERVICE_GRANT: %',t; end if;
 end loop;
 for r in select * from (values
 ('crm_private.has_admin_session()',true,false),('crm_private.is_admin()',true,false),('crm_private.is_owner()',true,false),
 ('crm_private.touch_audit()',false,false),('crm_private.immutable_row()',false,false),
 ('public.crm_admin_session_valid()',true,false),
 ('crm_private.save_quote(uuid,jsonb)',true,false),('public.crm_save_quote(uuid,jsonb)',true,false),
 ('crm_private.finalize_quote(uuid,integer)',true,false),('public.crm_finalize_quote(uuid,integer)',true,false),
 ('crm_private.quote_action(uuid,text,text)',true,false),('public.crm_quote_action(uuid,text,text)',true,false),
 ('crm_private.schedule_purge(uuid)',true,false),('public.crm_schedule_purge(uuid)',true,false),
 ('crm_private.submit_request(uuid,text,jsonb,uuid[],text)',false,true),('public.crm_submit_request(uuid,text,jsonb,uuid[],text)',false,true),
 ('crm_private.rate_limit(text,integer,integer)',false,true),('public.crm_rate_limit(text,integer,integer)',false,true),
 ('crm_private.claim_jobs(integer)',false,true),('public.crm_claim_jobs(integer)',false,true),
 ('crm_private.purge_request(uuid)',false,true),('public.crm_purge_request(uuid)',false,true),
 ('crm_private.queue_retention()',false,true),('public.crm_queue_retention()',false,true)
 ) as expected(signature,allow_authenticated,allow_service) loop
  f=to_regprocedure(r.signature);
  if f is null then raise exception 'MISSING_FUNCTION: %',r.signature; end if;
  if has_function_privilege('anon',f,'EXECUTE') then raise exception 'ANON_EXECUTE: %',r.signature; end if;
  if has_function_privilege('authenticated',f,'EXECUTE') is distinct from r.allow_authenticated then raise exception 'AUTH_EXECUTE_MISMATCH: %',r.signature; end if;
  if has_function_privilege('service_role',f,'EXECUTE') is distinct from r.allow_service then raise exception 'SERVICE_EXECUTE_MISMATCH: %',r.signature; end if;
  if exists(select 1 from pg_proc p cross join lateral aclexplode(coalesce(p.proacl,acldefault('f',p.proowner))) a where p.oid=f and a.grantee=0 and a.privilege_type='EXECUTE') then raise exception 'PUBLIC_EXECUTE: %',r.signature; end if;
 end loop;
 if exists(select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname like 'crm_%' and p.prosecdef) then raise exception 'EXPOSED_DEFINER'; end if;
 if exists(select 1 from pg_proc p where p.pronamespace='crm_private'::regnamespace and p.prosecdef and (pg_get_userbyid(p.proowner)<>'postgres' or not coalesce(p.proconfig @> array['search_path=""'],false))) then raise exception 'UNSAFE_DEFINER_OWNER_OR_PATH'; end if;
 if has_schema_privilege('anon','crm_private','USAGE,CREATE') or has_schema_privilege('authenticated','crm_private','CREATE') or has_schema_privilege('service_role','crm_private','CREATE') then raise exception 'PRIVATE_SCHEMA_PRIVILEGES'; end if;
 if not exists(select 1 from storage.buckets where id='crm-documents' and not public and file_size_limit=5242880 and allowed_mime_types=array['application/pdf','image/jpeg','image/png']) then raise exception 'BUCKET_CONFIG'; end if;
 if not (select relrowsecurity from pg_class where oid='storage.objects'::regclass) then raise exception 'STORAGE_RLS_DISABLED'; end if;
 if not exists(select 1 from pg_policy where polrelid='storage.objects'::regclass and polname='crm_documents_private' and not polpermissive and polcmd='*' and polroles @> array['anon'::regrole::oid,'authenticated'::regrole::oid]) then raise exception 'MISSING_RESTRICTIVE_STORAGE_POLICY'; end if;
if (select count(*) from public.agency_settings)<>1 then raise exception 'SETTINGS_SINGLETON_MISSING'; end if;
end $verify$;
-- On the fresh foundation these three flags must be false; collection stays closed.
select 'PASS: foundation grants, function boundaries, RLS and private bucket checks' as result,
 legal_verified,tax_configured,privacy_verified,privacy_notice_version from public.agency_settings;
