-- Create profiles table
CREATE TABLE public.profiles (
    id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    PRIMARY KEY (id)
);

-- Enable row level security for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create function to handle new user
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email)
  values (new.id,  new.email);
  return new;
end;
$$;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

create policy "Public profiles are viewable only by authenticated users"
on profiles for select to authenticated using ( true );

CREATE POLICY "Authenticated users can update their own profiles"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id);

ALTER PUBLICATION supabase_realtime ADD TABLE profiles;


CREATE POLICY "authenticated can receive broadcast"
ON "realtime"."messages"
FOR SELECT
TO authenticated
USING (TRUE);

CREATE POLICY "authenticated can emit broadcast"
ON "realtime"."messages"
FOR INSERT
TO authenticated
WITH CHECK (TRUE);