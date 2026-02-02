# DSAR Portal (Machine Test Submission)

A multi-tenant privacy portal that allows companies to manage Data Subject Access Requests (DSAR). Companies can register, subscribe via Stripe, and receive a white-labeled public form for their customers.

**Built With:** Next.js 15 (App Router), Supabase (Auth, DB, Storage), Stripe, Tailwind CSS, Shadcn UI.

---

## 🚀 Setup & Installation

**1. Clone and Install**

```bash
git clone <your-repo-url>
cd dsar-portal
npm install
```

**2. Environment Variables**

Create a `.env.local` file in the root and add your keys:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**3. Run the App**

```bash
npm run dev
```

Database Setup (Supabase)
Run this SQL script in your Supabase SQL Editor to set up the Tables, Storage, and Security Policies.
Database Setup (Supabase)
Run this SQL script in your Supabase SQL Editor to set up the Tables, Storage, and Security Policies.

Note: Please review the SQL queries and permissions below carefully. Small adjustments may be required depending on your specific Supabase configuration.

```sql
-- 1. Create Tables
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  role text default 'user', -- 'admin' or 'user'
  created_at timestamptz default now()
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id),
  name text not null,
  slug text unique,
  description text,
  region text,
  address text,
  contact_email text,
  contact_phone text,
  logo_url text,
  status text default 'pending', -- pending, approved, rejected
  subscription_status text default 'inactive', -- active, inactive
  stripe_customer_id text,
  created_at timestamptz default now()
);

create table public.dsar_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id),
  requester_name text,
  requester_email text,
  request_type text,
  details text,
  status text default 'open', -- open, in_progress, closed
  created_at timestamptz default now()
);

create table public.request_audit_logs (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.dsar_requests(id),
  changed_by uuid references public.profiles(id),
  old_status text,
  new_status text,
  changed_at timestamptz default now()
);

-- 2. Enable Storage for Logos
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

create policy "Public Access" on storage.objects for select using ( bucket_id = 'logos' );
create policy "Auth Upload" on storage.objects for insert with check ( bucket_id = 'logos' and auth.role() = 'authenticated' );

-- 3. Auto-create Profile on Signup (Trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;

$$
language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
$$

-- 4. Enable Row Level Security (RLS) & Policies

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.dsar_requests enable row level security;
alter table public.request_audit_logs enable row level security;

-- PROFILES Policies
create policy "Public profiles are viewable by everyone"
  on profiles for select using ( true );

create policy "Users can update own profile"
  on profiles for update using ( auth.uid() = id );

-- COMPANIES Policies
-- 1. Public can see approved companies (for the request form)
create policy "Public view approved companies"
  on companies for select
  using ( status = 'approved' );

-- 2. Owners can see their own companies
create policy "Owners view own companies"
  on companies for select
  using ( auth.uid() = owner_id );

-- 3. Owners can register (insert) a new company
create policy "Authenticated users can create companies"
  on companies for insert
  with check ( auth.role() = 'authenticated' );

-- 4. Owners can update their own company
create policy "Owners update own company"
  on companies for update
  using ( auth.uid() = owner_id );

-- DSAR REQUESTS Policies
-- 1. Owners see requests for their *own* companies
create policy "Owners view company requests"
  on dsar_requests for select
  using (
    exists (
      select 1 from companies
      where companies.id = dsar_requests.company_id
      and companies.owner_id = auth.uid()
    )
  );

-- 2. Public (Anyone) can create a request
create policy "Anyone can submit request"
  on dsar_requests for insert
  with check ( true );

-- 3. Owners can update status (close requests)
create policy "Owners update company requests"
  on dsar_requests for update
  using (
    exists (
      select 1 from companies
      where companies.id = dsar_requests.company_id
      and companies.owner_id = auth.uid()
    )
  );
```

### Stripe Configuration

Webhook: Add an endpoint in Stripe Dashboard pointing to https://your-domain.vercel.app/api/webhooks/stripe (or use stripe listen for localhost).

Events: Listen for checkout.session.completed.

Secret: Copy the signing secret (whsec\_...) to your .env.local.

🧪 How to Test (Walkthrough)
Follow these steps to verify the full flow:

1. Register Company (Owner Role)

Go to /auth/signup and create an account.

Fill in the Company Registration form.

Upload a Logo (Required to test Supabase Storage).

Result: Dashboard opens, but status is "Pending".

2. Subscribe (Payment)

Click "Subscribe" on the dashboard.

Use Stripe Test Card: 4242 4242 4242 4242.

Add dummy details

Result: Subscription badge turns Green (Active).

3. Approve Company (Admin Role)

Go to the profiles table in Supabase and manually change your second user's role to admin.

Login as Admin at /auth/login.

Go to /admin and click Approve on the new company.

Result: Company status becomes "Approved".

4. Submit Request (End User)

Go to the public link: /c/[company-slug].

Verify the Logo is visible.

Submit a dummy privacy request.

5. Process Request (Owner)

Log back in as the Owner.

Change request status to In Progress -> Closed.

Result: Status updates and Audit Log is created.
