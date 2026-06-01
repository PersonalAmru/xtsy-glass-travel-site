-- Enable scheduling extensions (idempotent)
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- (Re)schedule the daily analytics loader health summary at 08:00 UTC.
do $$
begin
  if exists (select 1 from cron.job where jobname = 'analytics-loader-daily-summary') then
    perform cron.unschedule('analytics-loader-daily-summary');
  end if;
end $$;

select cron.schedule(
  'analytics-loader-daily-summary',
  '0 8 * * *',
  $$
  select net.http_post(
    url := 'https://oidnydyyjyjfnyadhyzn.functions.supabase.co/analytics-loader-summary',
    headers := '{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pZG55ZHl5anlqZm55YWRoeXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MDEwNTUsImV4cCI6MjA2NjA3NzA1NX0.olHw9wNl8VNv-nM6heYMDpJJTARy9RxF30tvBfNLZNc"}'::jsonb,
    body := '{"hours":24}'::jsonb
  );
  $$
);