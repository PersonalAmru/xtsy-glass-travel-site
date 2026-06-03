-- Temporary grants to allow schema reconstruction via direct connection
GRANT USAGE, CREATE ON SCHEMA public TO sandbox_exec;
GRANT USAGE ON SCHEMA auth TO sandbox_exec;
GRANT SELECT ON auth.users TO sandbox_exec;