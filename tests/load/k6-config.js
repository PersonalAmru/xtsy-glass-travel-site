// k6 Load Testing Configuration for XTSY Travellers Hostel
// Run with: k6 run tests/load/k6-config.js

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const pageLoadTime = new Trend('page_load_time');
const apiResponseTime = new Trend('api_response_time');
const successfulRequests = new Counter('successful_requests');
const failedRequests = new Counter('failed_requests');

// Configuration for 100-150 concurrent users
export const options = {
  scenarios: {
    // Scenario 1: Gradual ramp-up to 150 users
    load_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 50 },   // Ramp up to 50 users
        { duration: '30s', target: 100 },  // Ramp up to 100 users
        { duration: '1m', target: 150 },   // Ramp up to 150 users
        { duration: '3m', target: 150 },   // Stay at 150 users for 3 minutes
        { duration: '30s', target: 100 },  // Ramp down to 100
        { duration: '30s', target: 0 },    // Ramp down to 0
      ],
      gracefulRampDown: '30s',
    },
    
    // Scenario 2: Spike test (sudden traffic surge)
    spike_test: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 150 },  // Spike to 150 users
        { duration: '1m', target: 150 },   // Maintain spike
        { duration: '10s', target: 0 },    // Drop to 0
      ],
      startTime: '6m30s', // Start after load_test
    },
  },
  
  thresholds: {
    // 95% of requests should complete under 3 seconds
    http_req_duration: ['p(95)<3000'],
    // 99% of requests should complete under 5 seconds
    'http_req_duration{type:page}': ['p(99)<5000'],
    // API calls should be faster
    'http_req_duration{type:api}': ['p(95)<1500'],
    // Error rate should be less than 1%
    errors: ['rate<0.01'],
    // At least 99% of requests should succeed
    http_req_failed: ['rate<0.01'],
  },
};

// Base URLs
const BASE_URL = __ENV.BASE_URL || 'https://xtsy.one';
const SUPABASE_URL = 'https://oidnydyyjyjfnyadhyzn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pZG55ZHl5anlqZm55YWRoeXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MDEwNTUsImV4cCI6MjA2NjA3NzA1NX0.olHw9wNl8VNv-nM6heYMDpJJTARy9RxF30tvBfNLZNc';

// Common headers
const pageHeaders = {
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
};

const apiHeaders = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
};

// Simulated user behavior
export default function () {
  // Randomize user journey
  const journeyType = Math.random();
  
  if (journeyType < 0.4) {
    // 40% - Homepage browsers
    homepageBrowser();
  } else if (journeyType < 0.7) {
    // 30% - Booking flow users
    bookingFlowUser();
  } else if (journeyType < 0.85) {
    // 15% - Travel page explorers
    travelPageExplorer();
  } else {
    // 15% - Quick visitors (bounce)
    quickVisitor();
  }
}

// User journey: Homepage browser
function homepageBrowser() {
  group('Homepage Browser Journey', function () {
    // Load homepage
    let response = http.get(BASE_URL, {
      headers: pageHeaders,
      tags: { type: 'page', name: 'homepage' },
    });
    
    check(response, {
      'homepage status is 200': (r) => r.status === 200,
      'homepage loads under 3s': (r) => r.timings.duration < 3000,
    }) ? successfulRequests.add(1) : failedRequests.add(1);
    
    errorRate.add(response.status !== 200);
    pageLoadTime.add(response.timings.duration);
    
    sleep(randomBetween(2, 5));
    
    // Fetch exchange rates (currency selector)
    response = http.get(`${SUPABASE_URL}/functions/v1/fetch-exchange-rates`, {
      headers: apiHeaders,
      tags: { type: 'api', name: 'exchange-rates' },
    });
    
    check(response, {
      'exchange rates status is 200': (r) => r.status === 200,
      'exchange rates cached': (r) => r.timings.duration < 2000,
    });
    
    errorRate.add(response.status !== 200);
    apiResponseTime.add(response.timings.duration);
    
    sleep(randomBetween(3, 8));
    
    // Maybe visit about page
    if (Math.random() > 0.5) {
      response = http.get(`${BASE_URL}/about`, {
        headers: pageHeaders,
        tags: { type: 'page', name: 'about' },
      });
      
      check(response, {
        'about page status is 200': (r) => r.status === 200,
      });
      
      errorRate.add(response.status !== 200);
      pageLoadTime.add(response.timings.duration);
      
      sleep(randomBetween(2, 4));
    }
  });
}

// User journey: Booking flow
function bookingFlowUser() {
  group('Booking Flow Journey', function () {
    // Load homepage
    let response = http.get(BASE_URL, {
      headers: pageHeaders,
      tags: { type: 'page', name: 'homepage' },
    });
    
    check(response, {
      'homepage status is 200': (r) => r.status === 200,
    });
    
    errorRate.add(response.status !== 200);
    pageLoadTime.add(response.timings.duration);
    
    sleep(randomBetween(1, 3));
    
    // Fetch room types
    response = http.get(`${SUPABASE_URL}/functions/v1/get-room-types`, {
      headers: apiHeaders,
      tags: { type: 'api', name: 'room-types' },
    });
    
    check(response, {
      'room types status is 200': (r) => r.status === 200,
      'room types returns data': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body && (Array.isArray(body) || body.data);
        } catch {
          return false;
        }
      },
    });
    
    errorRate.add(response.status !== 200);
    apiResponseTime.add(response.timings.duration);
    
    sleep(randomBetween(2, 5));
    
    // Check room availability
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() + 7);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 2);
    
    response = http.get(
      `${SUPABASE_URL}/functions/v1/get-room-availability?checkIn=${checkIn.toISOString().split('T')[0]}&checkOut=${checkOut.toISOString().split('T')[0]}`,
      {
        headers: apiHeaders,
        tags: { type: 'api', name: 'room-availability' },
      }
    );
    
    check(response, {
      'room availability status is 200 or 400': (r) => r.status === 200 || r.status === 400,
    });
    
    errorRate.add(response.status >= 500);
    apiResponseTime.add(response.timings.duration);
    
    sleep(randomBetween(3, 7));
    
    // Exchange rates for pricing
    response = http.get(`${SUPABASE_URL}/functions/v1/fetch-exchange-rates`, {
      headers: apiHeaders,
      tags: { type: 'api', name: 'exchange-rates' },
    });
    
    errorRate.add(response.status !== 200);
    apiResponseTime.add(response.timings.duration);
    
    sleep(randomBetween(1, 3));
  });
}

// User journey: Travel page explorer
function travelPageExplorer() {
  group('Travel Explorer Journey', function () {
    // Load travel page directly
    let response = http.get(`${BASE_URL}/travel`, {
      headers: pageHeaders,
      tags: { type: 'page', name: 'travel' },
    });
    
    check(response, {
      'travel page status is 200': (r) => r.status === 200,
      'travel page loads under 4s': (r) => r.timings.duration < 4000,
    });
    
    errorRate.add(response.status !== 200);
    pageLoadTime.add(response.timings.duration);
    
    sleep(randomBetween(3, 8));
    
    // Exchange rates
    response = http.get(`${SUPABASE_URL}/functions/v1/fetch-exchange-rates`, {
      headers: apiHeaders,
      tags: { type: 'api', name: 'exchange-rates' },
    });
    
    errorRate.add(response.status !== 200);
    apiResponseTime.add(response.timings.duration);
    
    sleep(randomBetween(2, 5));
    
    // Maybe visit gallery
    if (Math.random() > 0.6) {
      response = http.get(`${BASE_URL}/gallery`, {
        headers: pageHeaders,
        tags: { type: 'page', name: 'gallery' },
      });
      
      check(response, {
        'gallery page status is 200': (r) => r.status === 200,
      });
      
      errorRate.add(response.status !== 200);
      pageLoadTime.add(response.timings.duration);
      
      sleep(randomBetween(2, 6));
    }
  });
}

// User journey: Quick visitor (bounce)
function quickVisitor() {
  group('Quick Visitor', function () {
    const response = http.get(BASE_URL, {
      headers: pageHeaders,
      tags: { type: 'page', name: 'homepage' },
    });
    
    check(response, {
      'homepage status is 200': (r) => r.status === 200,
    });
    
    errorRate.add(response.status !== 200);
    pageLoadTime.add(response.timings.duration);
    
    // Quick look and leave
    sleep(randomBetween(1, 3));
  });
}

// Helper function for random sleep
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

// Summary handler
export function handleSummary(data) {
  return {
    'tests/load/summary.json': JSON.stringify(data, null, 2),
    'stdout': textSummary(data, { indent: '  ', enableColors: true }),
  };
}

// Text summary helper
function textSummary(data, opts) {
  const { metrics, root_group } = data;
  
  let summary = '\n=== XTSY Load Test Summary ===\n\n';
  
  // Request statistics
  summary += '📊 Request Statistics:\n';
  summary += `  Total Requests: ${metrics.http_reqs?.values?.count || 0}\n`;
  summary += `  Failed Requests: ${metrics.http_req_failed?.values?.passes || 0}\n`;
  summary += `  Error Rate: ${((metrics.errors?.values?.rate || 0) * 100).toFixed(2)}%\n\n`;
  
  // Response times
  summary += '⏱️ Response Times:\n';
  const duration = metrics.http_req_duration?.values || {};
  summary += `  Average: ${duration.avg?.toFixed(0) || 0}ms\n`;
  summary += `  Median: ${duration.med?.toFixed(0) || 0}ms\n`;
  summary += `  95th percentile: ${duration['p(95)']?.toFixed(0) || 0}ms\n`;
  summary += `  99th percentile: ${duration['p(99)']?.toFixed(0) || 0}ms\n\n`;
  
  // Thresholds
  summary += '✅ Threshold Results:\n';
  const thresholds = data.thresholds || {};
  Object.keys(thresholds).forEach(key => {
    const passed = thresholds[key].ok;
    summary += `  ${passed ? '✓' : '✗'} ${key}: ${passed ? 'PASSED' : 'FAILED'}\n`;
  });
  
  summary += '\n=== End Summary ===\n';
  
  return summary;
}
