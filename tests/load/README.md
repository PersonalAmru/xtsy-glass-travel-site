# XTSY Load Testing Guide

This directory contains k6 load testing configurations to verify the app handles 100-150 concurrent visitors properly.

## Prerequisites

1. **Install k6**:
   ```bash
   # macOS
   brew install k6
   
   # Windows (using Chocolatey)
   choco install k6
   
   # Linux (Debian/Ubuntu)
   sudo gpg -k
   sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
   echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
   sudo apt-get update
   sudo apt-get install k6
   
   # Docker
   docker pull grafana/k6
   ```

## Running Load Tests

### Basic Load Test
```bash
# Run with default settings (production URL)
k6 run tests/load/k6-config.js

# Run against staging/preview URL
k6 run tests/load/k6-config.js -e BASE_URL=https://your-preview-url.lovable.app

# Run with cloud output (requires k6 Cloud account)
k6 run tests/load/k6-config.js --out cloud
```

### Quick Smoke Test (5 users)
```bash
k6 run tests/load/k6-config.js --vus 5 --duration 30s
```

### Custom Concurrency
```bash
# Test with exactly 100 concurrent users
k6 run tests/load/k6-config.js --vus 100 --duration 2m

# Test with 150 concurrent users for 5 minutes
k6 run tests/load/k6-config.js --vus 150 --duration 5m
```

## Test Scenarios

The configuration includes two main scenarios:

### 1. Load Test (Gradual Ramp-up)
- Gradually ramps from 0 to 150 users over 2 minutes
- Maintains 150 concurrent users for 3 minutes
- Ramps down gracefully

### 2. Spike Test
- Suddenly jumps to 150 users
- Maintains spike for 1 minute
- Drops to 0 immediately

## User Journey Simulation

The tests simulate realistic user behavior:

| Journey Type | Percentage | Description |
|--------------|------------|-------------|
| Homepage Browser | 40% | Views homepage, checks exchange rates, may visit about page |
| Booking Flow | 30% | Full booking journey: homepage → room types → availability |
| Travel Explorer | 15% | Views travel page, may browse gallery |
| Quick Visitor | 15% | Bounces after viewing homepage briefly |

## Performance Thresholds

The tests will **FAIL** if:
- 95% of requests take longer than 3 seconds
- 99% of page loads take longer than 5 seconds
- 95% of API calls take longer than 1.5 seconds
- Error rate exceeds 1%

## Interpreting Results

After running, check:

1. **Error Rate**: Should be < 1%
2. **p95 Response Time**: Should be < 3000ms
3. **Successful Requests**: Should be > 99%
4. **API Response Time**: Should be < 1500ms (p95)

### Sample Output
```
=== XTSY Load Test Summary ===

📊 Request Statistics:
  Total Requests: 15,432
  Failed Requests: 12
  Error Rate: 0.08%

⏱️ Response Times:
  Average: 542ms
  Median: 384ms
  95th percentile: 1,247ms
  99th percentile: 2,103ms

✅ Threshold Results:
  ✓ http_req_duration: PASSED
  ✓ errors: PASSED
  ✓ http_req_failed: PASSED
```

## Edge Function Endpoints Tested

| Endpoint | Purpose | Expected Response Time |
|----------|---------|------------------------|
| `/functions/v1/fetch-exchange-rates` | Currency conversion | < 500ms (cached) |
| `/functions/v1/get-room-types` | Room listing | < 1000ms |
| `/functions/v1/get-room-availability` | Availability check | < 1500ms |

## Troubleshooting

### High Error Rates
- Check Supabase edge function logs
- Verify database connection pool limits
- Check rate limiting configuration

### Slow Response Times
- Monitor Supabase instance CPU/memory
- Check if caching is working (exchange rates should be cached)
- Consider upgrading Supabase instance size

### Connection Timeouts
- May indicate Supabase connection limits reached
- Consider implementing connection pooling
- Check for long-running database queries

## CI/CD Integration

Add to GitHub Actions:
```yaml
- name: Install k6
  run: |
    sudo gpg -k
    sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
    echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
    sudo apt-get update
    sudo apt-get install k6

- name: Run Load Tests
  run: k6 run tests/load/k6-config.js --vus 50 --duration 1m
```

## Performance Optimization Tips

If tests reveal performance issues:

1. **Frontend**: Enable aggressive caching, lazy loading
2. **Edge Functions**: Implement persistent caching (already done for exchange rates)
3. **Database**: Add indexes, optimize RLS policies
4. **CDN**: Ensure static assets are cached at edge
5. **Instance Size**: Upgrade Supabase compute if needed
