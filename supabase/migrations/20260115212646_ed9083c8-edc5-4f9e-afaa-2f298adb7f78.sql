-- Drop existing SELECT policy on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Create a policy that denies all SELECT access (only service role bypasses RLS)
CREATE POLICY "Only admin can view profiles"
ON public.profiles
FOR SELECT
USING (false);