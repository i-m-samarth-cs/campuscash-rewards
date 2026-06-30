-- 1. invoices: replace permissive public SELECT with authenticated-only access
DROP POLICY IF EXISTS "Anyone can view invoice for payment" ON public.invoices;

CREATE POLICY "Authenticated users can view invoices"
ON public.invoices
FOR SELECT
TO authenticated
USING (true);

-- 2. vendors: replace permissive public SELECT with authenticated-only access
DROP POLICY IF EXISTS "Anyone can view vendor by id for payments" ON public.vendors;

CREATE POLICY "Authenticated users can view vendors"
ON public.vendors
FOR SELECT
TO authenticated
USING (true);

-- 3. profiles: allow users to read their own profile (previous policy blocked everyone)
DROP POLICY IF EXISTS "Only admin can view profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 4. Drop the unused has_role SECURITY DEFINER function to reduce attack surface
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role);

-- 5. Atomic signup: extend the existing auth-user trigger to create profile and vendor
--    records based on auth metadata, so signup never leaves a half-created account.
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role app_role;
BEGIN
  _role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::app_role,
    'student'::app_role
  );

  -- Assign role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _role)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create profile from metadata
  INSERT INTO public.profiles (user_id, full_name, email, college_id, bch_wallet_address)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    NULLIF(NEW.raw_user_meta_data->>'college_id', ''),
    NULLIF(NEW.raw_user_meta_data->>'bch_wallet_address', '')
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- If vendor, create vendor record from metadata
  IF _role = 'vendor'::app_role THEN
    INSERT INTO public.vendors (user_id, shop_name, vendor_type, bch_address)
    VALUES (
      NEW.id,
      COALESCE(NULLIF(NEW.raw_user_meta_data->>'shop_name', ''), 'My Shop'),
      COALESCE(NULLIF(NEW.raw_user_meta_data->>'vendor_type', ''), 'canteen'),
      COALESCE(NULLIF(NEW.raw_user_meta_data->>'bch_address', ''), '')
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;
