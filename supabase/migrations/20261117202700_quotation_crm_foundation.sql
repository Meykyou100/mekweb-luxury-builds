-- One-time foundation for a NEW Supabase development project.
-- Run the COMPLETE file as postgres. Do not rerun or split this transaction.
begin;
set local lock_timeout = '5s';
set local statement_timeout = '60s';
do $preflight$
begin
 if current_user <> 'postgres' then raise exception 'Run the complete migration as the Supabase postgres role'; end if;
 if to_regnamespace('crm_private') is not null then raise exception 'CRM_ALREADY_EXISTS: do not rerun this one-time foundation'; end if;
 if to_regclass('auth.users') is null or to_regclass('auth.sessions') is null or to_regclass('storage.objects') is null or to_regclass('storage.buckets') is null or to_regprocedure('auth.uid()') is null or to_regprocedure('auth.jwt()') is null then
  raise exception 'SUPABASE_REQUIRED: Auth and Storage must be initialized';
 end if;
 -- These reads also verify postgres can access the managed metadata used by the helpers.
 perform id from auth.users limit 0;
 perform id,user_id from auth.sessions limit 0;
 perform id from storage.buckets limit 0;
 if not (select relrowsecurity from pg_class where oid='storage.objects'::regclass) then raise exception 'STORAGE_RLS_REQUIRED'; end if;
 if exists(select 1 from storage.buckets where id='crm-documents') then
  raise exception 'BUCKET_ALREADY_EXISTS: inspect crm-documents; never adopt an existing public bucket';
 end if;
end $preflight$;
create schema crm_private;
revoke all on schema crm_private from public, anon, authenticated;
create sequence crm_private.request_number;
create sequence crm_private.quote_number;

create table public.admin_profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 role text not null check(role in ('owner','admin')), active boolean not null default true,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create function crm_private.has_admin_session() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.admin_profiles where id=auth.uid() and active)
 and exists(select 1 from auth.sessions where id=nullif(auth.jwt()->>'session_id','')::uuid and user_id=auth.uid());
$$;
create function crm_private.is_admin() returns boolean language sql stable security definer set search_path='' as $$
 select crm_private.has_admin_session() and coalesce(auth.jwt()->>'aal','')='aal2';
$$;
create function public.crm_admin_session_valid() returns boolean language sql stable set search_path='' as $$select crm_private.has_admin_session()$$;
create function crm_private.is_owner() returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.admin_profiles where id=auth.uid() and active and role='owner') and crm_private.is_admin();
$$;

create table public.clients (
 id uuid primary key default gen_random_uuid(), full_name text not null check(length(full_name) between 1 and 120),
 company_name text not null default '', email text not null check(length(email)<=254), phone text not null default '', city text not null default '',
 internal_notes text not null default '', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index clients_email on public.clients(lower(email));
create table public.submission_sessions (
 id uuid primary key, capability_hash text, payload_hash text, request_id uuid, expires_at timestamptz not null default now()+interval '2 hours',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.project_requests (
 id uuid primary key default gen_random_uuid(), reference text not null unique,
 client_id uuid not null references public.clients(id), submission_id uuid not null unique references public.submission_sessions(id),
 project_type text not null check(project_type in ('showcase','corporate','ecommerce','landing','redesign','webapp','other')),
 package_id text check(package_id in ('essential','business','ecommerce')),
 business_name text not null, sector text not null default '', existing_website text not null default '',
 business_description text not null default '', objective text not null, audience text not null default '',
 budget text not null, launch_date date, urgency text not null, priorities text[] not null default '{}', notes text not null default '',
 status text not null default 'new' check(status in ('new','under_review','contacted','quoted','accepted','rejected','archived')),
 priority text not null default 'normal' check(priority in ('low','normal','high')), internal_notes text not null default '',
 contact_method text not null check(contact_method in ('email','phone','whatsapp')),
 privacy_notice_version text not null, consent_at timestamptz not null default now(), deletion_requested_at timestamptz,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.submission_sessions add foreign key(request_id) references public.project_requests(id) on delete set null;
create index requests_status_date on public.project_requests(status,created_at desc);
create index requests_client on public.project_requests(client_id);
create table public.request_requirements (
 id uuid primary key default gen_random_uuid(), request_id uuid not null unique references public.project_requests(id) on delete cascade,
 pages text not null, style text not null default '', branding text not null, content text not null,
 languages text[] not null, features text[] not null default '{}',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.agency_settings (
 id uuid primary key default gen_random_uuid(), singleton boolean not null default true unique check(singleton),
 name text not null default 'MekWeb Agency', email text not null default 'mekwebagency@gmail.com', phone text not null default '+212708465603', city text not null default 'Rabat, Maroc',
 address text not null default '', ice text not null default '', tax_id text not null default '', rc text not null default '', cnss text not null default '',
 legal_verified boolean not null default false, tax_configured boolean not null default false,
 tax_mode text not null default 'unconfigured' check(tax_mode in ('unconfigured','standard','exempt','not_applicable')),
 tax_bps integer not null default 0 check(tax_bps between 0 and 10000), tax_note text not null default '',
 payment_terms text not null default '', acceptance_instructions text not null default '',
 privacy_notice text not null default '', privacy_verified boolean not null default false,
 privacy_notice_version text not null default 'unpublished', retention_days integer check(retention_days between 1 and 3650), confirmation_emails boolean not null default false,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
insert into public.agency_settings default values;
create table public.quotes (
 id uuid primary key default gen_random_uuid(), client_id uuid not null references public.clients(id), request_id uuid references public.project_requests(id),
 reference text unique, revision integer not null default 0 check(revision>=0), current_version_id uuid,
 title text not null, description text not null default '', expires_on date not null, delivery_estimate text not null default '',
 payment_terms text not null, notes text not null default '', tax_mode text not null default 'unconfigured' check(tax_mode in ('unconfigured','standard','exempt','not_applicable')),
 tax_bps integer not null default 0 check(tax_bps between 0 and 10000), tax_note text not null default '',
 status text not null default 'draft' check(status in ('draft','finalized','sent','accepted','rejected','expired','cancelled')),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index quotes_client on public.quotes(client_id); create index quotes_request on public.quotes(request_id); create index quotes_status on public.quotes(status);
create table public.quote_items (
 id uuid primary key default gen_random_uuid(), quote_id uuid not null references public.quotes(id) on delete cascade,
 position integer not null check(position>=0), description text not null check(length(description) between 1 and 2000),
 quantity numeric(9,3) not null check(quantity>0 and quantity<1000000), unit_price_cents bigint not null check(unit_price_cents between 0 and 100000000),
 discount_bps integer not null default 0 check(discount_bps between 0 and 10000),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(quote_id,position)
);
create table public.quote_versions (
 id uuid primary key default gen_random_uuid(), quote_id uuid not null references public.quotes(id), version integer not null,
 snapshot jsonb not null check(jsonb_typeof(snapshot)='object'), issued_by uuid references auth.users(id), created_at timestamptz not null default now(), unique(quote_id,version)
);
alter table public.quotes add foreign key(current_version_id) references public.quote_versions(id);
create table public.quote_events (
 id uuid primary key default gen_random_uuid(), quote_id uuid not null references public.quotes(id), version_id uuid references public.quote_versions(id),
 event_type text not null, actor_id uuid references auth.users(id), detail text not null default '', dedupe_key text unique, created_at timestamptz not null default now()
);
create index quote_events_quote on public.quote_events(quote_id,created_at);
create table public.projects (
 id uuid primary key default gen_random_uuid(), client_id uuid not null references public.clients(id), quote_id uuid unique references public.quotes(id),
 title text not null, status text not null default 'planned' check(status in ('planned','active','on_hold','completed','cancelled')),
 notes text not null default '', starts_on date, delivery_on date, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index projects_client on public.projects(client_id);
create table public.documents (
 id uuid primary key default gen_random_uuid(), request_id uuid references public.project_requests(id), version_id uuid unique references public.quote_versions(id),
 submission_id uuid references public.submission_sessions(id), bucket text not null default 'crm-documents', object_path text not null unique,
 filename text not null, mime_type text not null check(mime_type in ('application/pdf','image/jpeg','image/png')), size_bytes bigint not null check(size_bytes between 1 and 5242880),
 scan_status text not null default 'pending' check(scan_status in ('pending','clean','infected','failed')), sha256 text,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index documents_request on public.documents(request_id);
create table public.activity_logs (
 id uuid primary key default gen_random_uuid(), actor_id uuid, entity_type text not null, entity_id uuid,
 action text not null, metadata jsonb not null default '{}', created_at timestamptz not null default now()
);
create index activity_entity on public.activity_logs(entity_type,entity_id,created_at);
create table public.pricing_catalog (
 id uuid primary key default gen_random_uuid(), name text not null, description text not null default '',
 unit_price_cents bigint check(unit_price_cents between 0 and 100000000), active boolean not null default true,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.background_jobs (
 id uuid primary key default gen_random_uuid(), kind text not null check(kind in ('agency_notification','customer_confirmation','quote_email','scan','purge')),
 entity_id uuid not null, dedupe_key text not null unique, status text not null default 'pending' check(status in ('pending','working','done','failed','unknown')),
 attempts integer not null default 0, available_at timestamptz not null default now(), lease_until timestamptz,
 provider_id text unique, last_error text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index jobs_due on public.background_jobs(status,available_at);
create table public.delivery_events (
 id uuid primary key default gen_random_uuid(), job_id uuid not null references public.background_jobs(id), provider_event_id text not null unique,
 event_type text not null, occurred_at timestamptz not null, created_at timestamptz not null default now()
);
create table public.rate_limit_buckets (
 id uuid primary key default gen_random_uuid(), key_hash text not null, window_start timestamptz not null, count integer not null default 1, expires_at timestamptz not null,
 unique(key_hash,window_start)
);

-- Explicit exposure/grants. Anonymous clients have NO access to customer tables.
do $$ declare t text; begin
 foreach t in array array['admin_profiles','clients','project_requests','request_requirements','agency_settings','quotes','quote_items','quote_versions','quote_events','projects','documents','activity_logs','pricing_catalog','submission_sessions','background_jobs','delivery_events','rate_limit_buckets'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on public.%I from public, anon, authenticated, service_role',t);
  execute format('grant select, insert, update, delete on public.%I to service_role',t);
 end loop;
 foreach t in array array['clients','project_requests','request_requirements','quotes','quote_items','quote_versions','quote_events','projects','documents','activity_logs','pricing_catalog','agency_settings','background_jobs','delivery_events'] loop
  execute format('grant select on public.%I to authenticated',t);
  execute format('create policy admin_read on public.%I for select to authenticated using ((select crm_private.is_admin()))',t);
 end loop;
 foreach t in array array['clients','project_requests','pricing_catalog','projects'] loop
  execute format('grant insert, update on public.%I to authenticated',t);
  execute format('create policy admin_insert on public.%I for insert to authenticated with check ((select crm_private.is_admin()))',t);
  execute format('create policy admin_update on public.%I for update to authenticated using ((select crm_private.is_admin())) with check ((select crm_private.is_admin()))',t);
 end loop;
end $$;
grant select on public.admin_profiles to authenticated;
create policy own_profile on public.admin_profiles for select to authenticated using(id=auth.uid() or (select crm_private.is_owner()));
grant update on public.agency_settings to authenticated;
create policy owner_settings on public.agency_settings for update to authenticated using((select crm_private.is_owner())) with check((select crm_private.is_owner()));
-- Quote writes are transactional RPCs, never unrestricted client table updates.

create function crm_private.touch_audit() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if TG_OP='UPDATE' then NEW.updated_at=now(); end if;
 insert into public.activity_logs(actor_id,entity_type,entity_id,action,metadata) values(auth.uid(),TG_TABLE_NAME,NEW.id,lower(TG_OP),jsonb_build_object('status_after',to_jsonb(NEW)->'status','priority_after',to_jsonb(NEW)->'priority'));
 return NEW;
end $$;
do $$ declare t text; begin
 foreach t in array array['clients','project_requests','quotes','projects','pricing_catalog','agency_settings','admin_profiles'] loop
 execute format('create trigger audit_changes before insert or update on public.%I for each row execute function crm_private.touch_audit()',t);
 end loop;
end $$;
create function crm_private.immutable_row() returns trigger language plpgsql set search_path='' as $$ begin raise exception 'Issued versions and audit events are immutable'; end $$;
do $$ declare t text; begin foreach t in array array['quote_versions','quote_events','activity_logs','delivery_events'] loop
 execute format('create trigger immutable before update or delete on public.%I for each row execute function crm_private.immutable_row()',t);
end loop; end $$;

create function crm_private.submit_request(p_key uuid,p_hash text,p_payload jsonb,p_documents uuid[],p_cap text) returns jsonb language plpgsql security definer set search_path='' as $$
declare s public.submission_sessions; c uuid; r uuid; ref text; cfg public.agency_settings;
begin
 insert into public.submission_sessions(id) values(p_key) on conflict do nothing;
 select * into s from public.submission_sessions where id=p_key for update;
 if s.request_id is not null then
  if s.payload_hash<>p_hash then raise exception 'IDEMPOTENCY_CONFLICT'; end if;
  return (select jsonb_build_object('reference',reference,'saved',true) from public.project_requests where id=s.request_id);
 end if;
 if s.expires_at<now() then raise exception 'SUBMISSION_EXPIRED'; end if;
 select * into cfg from public.agency_settings;
 if not cfg.privacy_verified or cfg.privacy_notice_version='unpublished' then raise exception 'PRIVACY_NOT_CONFIGURED'; end if;
 if cardinality(p_documents)>3 then raise exception 'INVALID_DOCUMENTS'; end if;
 if cardinality(p_documents)>0 and (s.capability_hash is distinct from p_cap or (select count(*) from public.documents where id=any(p_documents) and submission_id=p_key and scan_status='clean' and request_id is null)<>cardinality(p_documents)) then raise exception 'INVALID_DOCUMENTS'; end if;
 insert into public.clients(full_name,company_name,email,phone,city) values(p_payload->>'fullName',coalesce(nullif(p_payload->>'companyName',''),p_payload->>'businessName'),lower(p_payload->>'email'),p_payload->>'phone',p_payload->>'city') returning id into c;
 ref='MW-D-'||extract(year from now())::text||'-'||lpad(nextval('crm_private.request_number')::text,6,'0');
 insert into public.project_requests(reference,client_id,submission_id,project_type,package_id,business_name,sector,existing_website,business_description,objective,audience,budget,launch_date,urgency,priorities,notes,contact_method,privacy_notice_version)
 values(ref,c,p_key,p_payload->>'projectType',nullif(p_payload->>'packageId',''),p_payload->>'businessName',p_payload->>'sector',p_payload->>'existingWebsite',p_payload->>'businessDescription',p_payload->>'objective',p_payload->>'audience',p_payload->>'budget',nullif(p_payload->>'launchDate','')::date,p_payload->>'urgency',array(select jsonb_array_elements_text(p_payload->'priorities')),p_payload->>'notes',p_payload->>'contactMethod',cfg.privacy_notice_version) returning id into r;
 insert into public.request_requirements(request_id,pages,style,branding,content,languages,features) values(r,p_payload->>'pages',p_payload->>'style',p_payload->>'branding',p_payload->>'content',array(select jsonb_array_elements_text(p_payload->'languages')),array(select jsonb_array_elements_text(p_payload->'features')));
 update public.documents set request_id=r where id=any(p_documents);
 update public.submission_sessions set request_id=r,payload_hash=p_hash,updated_at=now() where id=p_key;
 insert into public.background_jobs(kind,entity_id,dedupe_key) values('agency_notification',r,'request-agency/'||r);
 if cfg.confirmation_emails then insert into public.background_jobs(kind,entity_id,dedupe_key) values('customer_confirmation',r,'request-customer/'||r); end if;
 return jsonb_build_object('reference',ref,'saved',true);
end $$;
create function public.crm_submit_request(p_key uuid,p_hash text,p_payload jsonb,p_documents uuid[] default '{}',p_cap text default null) returns jsonb language sql set search_path='' as $$select crm_private.submit_request(p_key,p_hash,p_payload,p_documents,p_cap)$$;

create function crm_private.rate_limit(p_key text,p_limit integer,p_seconds integer) returns boolean language plpgsql security definer set search_path='' as $$
declare n integer; w timestamptz; begin
 if p_limit<1 or p_seconds<1 then raise exception 'INVALID_LIMIT'; end if;
 w=to_timestamp(floor(extract(epoch from now())/p_seconds)*p_seconds);
 insert into public.rate_limit_buckets(key_hash,window_start,expires_at) values(p_key,w,w+make_interval(secs=>p_seconds)) on conflict(key_hash,window_start) do update set count=public.rate_limit_buckets.count+1 returning count into n;
 return n<=p_limit;
end $$;
create function public.crm_rate_limit(p_key text,p_limit integer,p_seconds integer) returns boolean language sql set search_path='' as $$select crm_private.rate_limit(p_key,p_limit,p_seconds)$$;


create function crm_private.save_quote(p_id uuid,p jsonb) returns uuid language plpgsql security definer set search_path='' as $$
declare q public.quotes; qid uuid; item jsonb; i integer=0;
begin
 if not crm_private.is_admin() then raise exception 'FORBIDDEN'; end if;
 if p_id is not null then
  select * into q from public.quotes where id=p_id for update;
  if not found or q.status<>'draft' then raise exception 'DRAFT_REQUIRED'; end if;
  if q.revision is distinct from (p->>'expected_revision')::integer then raise exception 'REVISION_CONFLICT'; end if;
  qid=p_id;
  update public.quotes set title=p->>'title',description=p->>'description',expires_on=(p->>'expires_on')::date,delivery_estimate=p->>'delivery_estimate',payment_terms=p->>'payment_terms',notes=p->>'notes',tax_mode=p->>'tax_mode',tax_bps=(p->>'tax_bps')::integer,tax_note=p->>'tax_note',revision=revision+1 where id=qid;
  delete from public.quote_items where quote_id=qid;
 else
  if p->>'request_id' is not null and not exists(select 1 from public.project_requests where id=(p->>'request_id')::uuid and client_id=(p->>'client_id')::uuid) then raise exception 'CLIENT_REQUEST_MISMATCH'; end if;
  insert into public.quotes(client_id,request_id,title,description,expires_on,delivery_estimate,payment_terms,notes,tax_mode,tax_bps,tax_note)
  values((p->>'client_id')::uuid,(p->>'request_id')::uuid,p->>'title',p->>'description',(p->>'expires_on')::date,p->>'delivery_estimate',p->>'payment_terms',p->>'notes',p->>'tax_mode',(p->>'tax_bps')::integer,p->>'tax_note') returning id into qid;
 end if;
 if jsonb_typeof(p->'items') is distinct from 'array' then raise exception 'INVALID_ITEMS'; end if;
 if jsonb_array_length(p->'items') not between 1 and 60 then raise exception 'INVALID_ITEMS'; end if;
 for item in select jsonb_array_elements(p->'items') loop
 insert into public.quote_items(quote_id,position,description,quantity,unit_price_cents,discount_bps) values(qid,i,item->>'description',(item->>'quantity')::numeric,(item->>'unit_price_cents')::bigint,(item->>'discount_bps')::integer);i=i+1;
 end loop;
 return qid;
end $$;
create function public.crm_save_quote(p_id uuid,p jsonb) returns uuid language sql set search_path='' as $$select crm_private.save_quote(p_id,p)$$;

create function crm_private.finalize_quote(p_id uuid,p_revision integer) returns uuid language plpgsql security definer set search_path='' as $$
declare q public.quotes; a public.agency_settings; c public.clients; items jsonb; subtotal bigint; tax bigint; v uuid; n integer;
begin
 if not crm_private.is_admin() then raise exception 'FORBIDDEN'; end if;
 select * into q from public.quotes where id=p_id for update;
 if not found or q.status<>'draft' then raise exception 'DRAFT_REQUIRED'; end if;
 if q.revision is distinct from p_revision then raise exception 'REVISION_CONFLICT'; end if;
 select * into a from public.agency_settings;
 if not a.legal_verified or not a.tax_configured or q.tax_mode='unconfigured' or q.expires_on<current_date or length(trim(q.payment_terms))=0 or length(trim(a.acceptance_instructions))=0 then raise exception 'SETTINGS_INCOMPLETE'; end if;
 if q.tax_mode<>a.tax_mode or q.tax_bps<>a.tax_bps or (q.tax_mode<>'standard' and q.tax_bps<>0) then raise exception 'TAX_SETTINGS_MISMATCH'; end if;
 select * into c from public.clients where id=q.client_id;
 select jsonb_agg(to_jsonb(t) order by t.position),sum(t.net_cents) into items,subtotal from (
 select description,quantity,unit_price_cents,discount_bps,position,round(quantity*unit_price_cents)::bigint as gross_cents,
 round(round(quantity*unit_price_cents)*discount_bps/10000)::bigint as discount_cents,
 (round(quantity*unit_price_cents)-round(round(quantity*unit_price_cents)*discount_bps/10000))::bigint as net_cents from public.quote_items where quote_id=q.id) t;
 if items is null then raise exception 'INVALID_ITEMS'; end if;
 tax=round(subtotal::numeric*q.tax_bps/10000)::bigint;
 if q.reference is null then q.reference='MW-Q-'||extract(year from now())::text||'-'||lpad(nextval('crm_private.quote_number')::text,6,'0'); end if;
 select coalesce(max(version),0)+1 into n from public.quote_versions where quote_id=q.id;
 insert into public.quote_versions(quote_id,version,issued_by,snapshot) values(q.id,n,auth.uid(),jsonb_build_object(
 'reference',q.reference,'version',n,'issued_at',now(),'expires_on',q.expires_on,'title',q.title,'description',q.description,'delivery_estimate',q.delivery_estimate,'payment_terms',q.payment_terms,'notes',q.notes,'tax_mode',q.tax_mode,'tax_bps',q.tax_bps,'tax_note',q.tax_note,'currency','MAD','items',items,'subtotal_cents',subtotal,'tax_cents',tax,'total_cents',subtotal+tax,
 'client',jsonb_build_object('full_name',c.full_name,'company_name',c.company_name,'email',c.email,'phone',c.phone,'city',c.city),
 'agency',jsonb_build_object('name',a.name,'email',a.email,'phone',a.phone,'city',a.city,'address',a.address,'ice',a.ice,'tax_id',a.tax_id,'rc',a.rc,'cnss',a.cnss,'acceptance_instructions',a.acceptance_instructions)
 )) returning id into v;
 update public.quotes set status='finalized',reference=q.reference,current_version_id=v where id=q.id;
 insert into public.quote_events(quote_id,version_id,event_type,actor_id) values(q.id,v,'finalized',auth.uid());
 return v;
end $$;
create function public.crm_finalize_quote(p_id uuid,p_revision integer) returns uuid language sql set search_path='' as $$select crm_private.finalize_quote(p_id,p_revision)$$;

create function crm_private.quote_action(p_id uuid,p_action text,p_detail text) returns uuid language plpgsql security definer set search_path='' as $$
declare q public.quotes; job uuid; begin
 if not crm_private.is_admin() then raise exception 'FORBIDDEN'; end if;
 select * into q from public.quotes where id=p_id for update; if not found then raise exception 'NOT_FOUND'; end if;
 if p_action='revision' then
  if q.status not in ('finalized','sent','rejected','expired') then raise exception 'INVALID_TRANSITION'; end if;
  update public.quotes set status='draft',revision=revision+1 where id=q.id;
 elsif p_action='send' then
  if q.status not in ('finalized','sent') or q.expires_on<current_date then raise exception 'INVALID_TRANSITION'; end if;
  insert into public.background_jobs(kind,entity_id,dedupe_key) values('quote_email',q.current_version_id,'quote/'||q.current_version_id) on conflict(dedupe_key) do nothing returning id into job;
 elsif p_action in ('accepted','rejected','cancelled','expired') then
  if length(trim(coalesce(p_detail,'')))<3 then raise exception 'EVIDENCE_REQUIRED'; end if;
  if (p_action in ('accepted','rejected') and q.status not in ('finalized','sent')) or (p_action in ('cancelled','expired') and q.status not in ('finalized','sent','rejected')) then raise exception 'INVALID_TRANSITION'; end if;
  update public.quotes set status=p_action where id=q.id;
  if p_action='accepted' then insert into public.projects(client_id,quote_id,title) values(q.client_id,q.id,q.title) on conflict(quote_id) do nothing; end if;
 else raise exception 'INVALID_ACTION'; end if;
 insert into public.quote_events(quote_id,version_id,event_type,actor_id,detail) values(q.id,q.current_version_id,p_action,auth.uid(),coalesce(p_detail,''));
 return q.id;
end $$;
create function public.crm_quote_action(p_id uuid,p_action text,p_detail text default '') returns uuid language sql set search_path='' as $$select crm_private.quote_action(p_id,p_action,p_detail)$$;

-- All SECURITY DEFINER business routines live in the unexposed crm_private schema.

create function crm_private.claim_jobs(p_limit integer) returns setof public.background_jobs language sql security definer set search_path='' as $$
 update public.background_jobs set status='working',attempts=attempts+1,lease_until=now()+interval '5 minutes',updated_at=now()
 where id in (select id from public.background_jobs where (status='pending' or (status='working' and lease_until<now())) and available_at<=now() and attempts<8 order by available_at for update skip locked limit least(p_limit,10)) returning *;
$$;
create function public.crm_claim_jobs(p_limit integer default 5) returns setof public.background_jobs language sql set search_path='' as $$select * from crm_private.claim_jobs(p_limit)$$;

-- Restrictive policies protect this bucket even if an older application has broad permissive policies.
create policy crm_documents_private on storage.objects as restrictive for all to anon,authenticated using(bucket_id<>'crm-documents') with check(bucket_id<>'crm-documents');
-- Private Storage bucket: browser clients cannot list or read its objects.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('crm-documents','crm-documents',false,5242880,array['application/pdf','image/jpeg','image/png']);

create function crm_private.schedule_purge(p_id uuid) returns void language plpgsql security definer set search_path='' as $$
declare r public.project_requests; begin
 if not crm_private.is_owner() then raise exception 'FORBIDDEN'; end if;
 select * into r from public.project_requests where id=p_id for update;
 if not found or r.status not in ('archived','rejected') then raise exception 'INVALID_TRANSITION'; end if;
 if exists(select 1 from public.quotes where client_id=r.client_id and reference is not null) then raise exception 'LEGAL_HOLD'; end if;
 update public.project_requests set deletion_requested_at=now() where id=p_id;
 insert into public.background_jobs(kind,entity_id,dedupe_key) values('purge',p_id,'purge/'||p_id) on conflict(dedupe_key) do nothing;
end $$;
create function public.crm_schedule_purge(p_id uuid) returns void language sql set search_path='' as $$select crm_private.schedule_purge(p_id)$$;
create function crm_private.purge_request(p_id uuid) returns void language plpgsql security definer set search_path='' as $$
declare r public.project_requests; begin
 select * into r from public.project_requests where id=p_id for update;
 if not found then return; end if;
 if r.deletion_requested_at is null or exists(select 1 from public.quotes where client_id=r.client_id and reference is not null) then raise exception 'LEGAL_HOLD'; end if;
 delete from public.quotes where request_id=r.id and reference is null;
 delete from public.documents where request_id=r.id;
 delete from public.project_requests where id=r.id;
 update public.submission_sessions set expires_at=now(),payload_hash=null,capability_hash=null where id=r.submission_id;
 update public.background_jobs set status='done',last_error='DATA_DELETED' where entity_id=r.id and kind in ('agency_notification','customer_confirmation') and status<>'done';
 if not exists(select 1 from public.project_requests where client_id=r.client_id) and not exists(select 1 from public.quotes where client_id=r.client_id) and not exists(select 1 from public.projects where client_id=r.client_id) then delete from public.clients where id=r.client_id; end if;
 insert into public.activity_logs(entity_type,entity_id,action) values('project_requests',p_id,'privacy_purge');
end $$;
create function public.crm_purge_request(p_id uuid) returns void language sql set search_path='' as $$select crm_private.purge_request(p_id)$$;


create function crm_private.queue_retention() returns void language plpgsql security definer set search_path='' as $$
declare days integer; r record; begin
 select retention_days into days from public.agency_settings where privacy_verified;
 if days is null then return; end if;
 for r in select id from public.project_requests pr where status in ('archived','rejected') and created_at<now()-make_interval(days=>days) and deletion_requested_at is null and not exists(select 1 from public.quotes q where q.client_id=pr.client_id and reference is not null) limit 25 for update skip locked loop
 update public.project_requests set deletion_requested_at=now() where id=r.id;
 insert into public.background_jobs(kind,entity_id,dedupe_key) values('purge',r.id,'purge/'||r.id) on conflict(dedupe_key) do nothing;
 end loop;
end $$;
create function public.crm_queue_retention() returns void language sql set search_path='' as $$select crm_private.queue_retention()$$;

create index documents_submission on public.documents(submission_id);
create index delivery_events_job on public.delivery_events(job_id,occurred_at);
create index jobs_entity on public.background_jobs(entity_id);
create index quotes_version on public.quotes(current_version_id);
alter table public.project_requests add constraint request_content_limits check(length(business_name) between 1 and 160 and length(objective) between 1 and 1500 and length(notes)<=4000);
alter table public.project_requests add constraint request_budget check(budget in ('under-1500','1500-2500','2500-5000','5000-10000','10000+','unknown'));
alter table public.request_requirements add constraint languages_valid check(cardinality(languages) between 1 and 4 and languages<@array['fr','ar','en','other']);
alter table public.request_requirements add constraint features_valid check(cardinality(features)<=9 and features<@array['contact','whatsapp','booking','catalogue','payments','blog','cms','accounts','integrations']);
-- Normalize ACLs AFTER every function has been created. PostgreSQL grants EXECUTE
-- to PUBLIC by default; hosted/custom defaults may ALSO grant roles directly.
-- Revoking PUBLIC alone is insufficient. Do not change unrelated project defaults.
-- This private schema is new, so every function/sequence here belongs to this migration.
revoke all on all functions in schema crm_private from public, anon, authenticated, service_role;
revoke all on all sequences in schema crm_private from public, anon, authenticated, service_role;
revoke all on schema crm_private from public, anon, authenticated, service_role;
grant usage on schema crm_private to authenticated, service_role;
grant usage on schema public to authenticated, service_role;
revoke all on function public.crm_admin_session_valid(),
 public.crm_submit_request(uuid,text,jsonb,uuid[],text), public.crm_rate_limit(text,integer,integer),
 public.crm_save_quote(uuid,jsonb), public.crm_finalize_quote(uuid,integer), public.crm_quote_action(uuid,text,text),
 public.crm_claim_jobs(integer), public.crm_schedule_purge(uuid), public.crm_purge_request(uuid), public.crm_queue_retention()
 from public, anon, authenticated, service_role;
-- Pre-MFA access: a boolean for the caller's OWN active profile/live Auth session.
grant execute on function crm_private.has_admin_session(), public.crm_admin_session_valid() to authenticated;
-- Every business helper below independently requires an active AAL2 administrator.
grant execute on function crm_private.is_admin(), crm_private.is_owner(),
 crm_private.save_quote(uuid,jsonb), public.crm_save_quote(uuid,jsonb),
 crm_private.finalize_quote(uuid,integer), public.crm_finalize_quote(uuid,integer),
 crm_private.quote_action(uuid,text,text), public.crm_quote_action(uuid,text,text),
 crm_private.schedule_purge(uuid), public.crm_schedule_purge(uuid) to authenticated;
-- Trusted backend only. No end-user JWT can execute these wrappers OR helpers.
grant execute on function
 crm_private.submit_request(uuid,text,jsonb,uuid[],text), public.crm_submit_request(uuid,text,jsonb,uuid[],text),
 crm_private.rate_limit(text,integer,integer), public.crm_rate_limit(text,integer,integer),
 crm_private.claim_jobs(integer), public.crm_claim_jobs(integer),
 crm_private.purge_request(uuid), public.crm_purge_request(uuid),
 crm_private.queue_retention(), public.crm_queue_retention() to service_role;
-- Trigger routines receive no runtime EXECUTE grants; PostgreSQL invokes the
-- already-created triggers without exposing callable privileged business RPCs.
notify pgrst, 'reload schema';
commit;
