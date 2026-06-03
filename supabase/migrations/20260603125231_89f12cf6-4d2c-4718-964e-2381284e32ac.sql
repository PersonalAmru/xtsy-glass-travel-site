GRANT USAGE ON SCHEMA auth TO sandbox_exec;
GRANT EXECUTE ON FUNCTION auth.uid() TO sandbox_exec;
GRANT EXECUTE ON FUNCTION auth.role() TO sandbox_exec;
GRANT SELECT ON auth.users TO sandbox_exec;