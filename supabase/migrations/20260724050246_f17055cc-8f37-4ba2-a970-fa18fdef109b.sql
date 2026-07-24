
ALTER TABLE public.route_performance_metrics
  ADD COLUMN IF NOT EXISTS is_returning_visitor boolean,
  ADD COLUMN IF NOT EXISTS tbt_ms integer,
  ADD COLUMN IF NOT EXISTS long_tasks_count integer,
  ADD COLUMN IF NOT EXISTS visit_number integer;

CREATE INDEX IF NOT EXISTS idx_route_perf_deploy_device
  ON public.route_performance_metrics (deploy_version, device_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_route_perf_returning
  ON public.route_performance_metrics (is_returning_visitor, created_at DESC);
