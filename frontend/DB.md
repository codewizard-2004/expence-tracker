CREATE TABLE public.TRIP (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name text,
  description text,
  startDate date,
  endDate date,
  budget numeric,
  currency character varying, (eg "USD", "INR")
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT TRIP_pkey PRIMARY KEY (id)
);
CREATE TABLE public.TRIPLOCATIONS (
  trip_id bigint NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT TRIPLOCATIONS_pkey PRIMARY KEY (trip_id, city, country),
  CONSTRAINT TRIPLOCATIONS_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.TRIP(id)
);
CREATE TABLE public.TRIPOBJECTIVES (
  trip_id bigint NOT NULL,
  title text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  description text,
  CONSTRAINT TRIPOBJECTIVES_pkey PRIMARY KEY (trip_id, title),
  CONSTRAINT TRIPOBJECTIVES_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.TRIP(id)
);
CREATE TABLE public.TRIP_RECEIPTS (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid,
  trip_id bigint,
  url text, # references to the bucket "receipts"
  category text, #food, travel, accommodation, other
  merchant_name text,
  merchant_location text,
  receipt_date date,
  amount numeric,
  currency character varying, # USD, INR etc
  description text,
  status text, #approved, rejected, appealed
  ai_reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT TRIP_RECEIPTS_pkey PRIMARY KEY (id),
  CONSTRAINT TRIP_RECEIPTS_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.TRIP(id),
  CONSTRAINT TRIP_RECEIPTS_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.USERS(id)
);
CREATE TABLE public.USERS (
  id uuid NOT NULL,
  name text,
  email text,
  rank text, # L1, L2 , L3 etc upto L10
  type text, #Employee, Auditor
  logo text
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT USERS_pkey PRIMARY KEY (id)
);
CREATE TABLE public.USERTRIPS (
  user_id uuid NOT NULL,
  trip_id bigint NOT NULL,
  expenditure numeric DEFAULT '0'::numeric, # total expenditure of the user in the trip
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT USERTRIPS_pkey PRIMARY KEY (user_id, trip_id),
  CONSTRAINT USERTRIPS_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.TRIP(id),
  CONSTRAINT USERTRIPS_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.USERS(id)
);