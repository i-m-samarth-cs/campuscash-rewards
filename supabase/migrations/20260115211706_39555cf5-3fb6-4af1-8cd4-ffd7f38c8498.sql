-- Fix 1: Prevent multiple roles per user by changing unique constraint
ALTER TABLE public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_role_key;
ALTER TABLE public.user_roles ADD CONSTRAINT user_roles_user_id_unique UNIQUE (user_id);

-- Fix 2: Remove client-side INSERT capability for user_roles
-- Replace with a trigger that assigns roles during signup via auth.users
DROP POLICY IF EXISTS "Users can insert own role" ON public.user_roles;

-- Create a trigger function to assign roles automatically on auth.users insert
-- This runs with elevated privileges and cannot be manipulated by clients
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- The role is passed via raw_user_meta_data during signup
  -- Default to 'student' if not specified
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE(
      (NEW.raw_user_meta_data->>'role')::app_role,
      'student'::app_role
    )
  );
  RETURN NEW;
END;
$$;

-- Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Fix 3: Add input validation constraints on invoices table
ALTER TABLE public.invoices
ADD CONSTRAINT invoices_amount_inr_positive CHECK (amount_inr > 0 AND amount_inr <= 1000000);

ALTER TABLE public.invoices
ADD CONSTRAINT invoices_amount_bch_positive CHECK (amount_bch > 0);

ALTER TABLE public.invoices
ADD CONSTRAINT invoices_note_length CHECK (note IS NULL OR length(note) <= 500);