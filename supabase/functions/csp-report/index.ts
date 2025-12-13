import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getCorsHeaders } from '../_shared/cors.ts'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface CSPReport {
  'csp-report': {
    'document-uri': string;
    'referrer': string;
    'violated-directive': string;
    'effective-directive': string;
    'original-policy': string;
    'disposition': string;
    'blocked-uri': string;
    'line-number'?: number;
    'column-number'?: number;
    'source-file'?: string;
  };
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only accept POST requests for CSP reports
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    const report: CSPReport = await req.json();
    const cspReport = report['csp-report'];
    
    if (!cspReport) {
      return new Response(
        JSON.stringify({ error: 'Invalid CSP report format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('CSP Violation Report:', {
      uri: cspReport['document-uri'],
      directive: cspReport['violated-directive'],
      blockedUri: cspReport['blocked-uri'],
      disposition: cspReport['disposition']
    });

    // Determine severity based on violation type
    let severity = 'low';
    const violatedDirective = cspReport['violated-directive'];
    
    if (violatedDirective.includes('script-src')) {
      severity = 'high'; // Script violations are critical
    } else if (violatedDirective.includes('connect-src')) {
      severity = 'medium'; // Network violations are concerning
    } else if (violatedDirective.includes('img-src')) {
      severity = 'low'; // Image violations are less critical
    }

    // Filter out common false positives
    const blockedUri = cspReport['blocked-uri'] || '';
    const isFalsePositive = [
      'chrome-extension:', 
      'moz-extension:', 
      'safari-extension:',
      'about:blank',
      'data:',
      'blob:'
    ].some(prefix => blockedUri.startsWith(prefix));

    // Only log non-false-positive violations
    if (!isFalsePositive) {
      // Store CSP violation in security alerts
      await supabase
        .from('security_alerts')
        .insert({
          alert_type: 'csp_violation',
          severity,
          details: {
            document_uri: cspReport['document-uri'],
            violated_directive: cspReport['violated-directive'],
            effective_directive: cspReport['effective-directive'],
            blocked_uri: cspReport['blocked-uri'],
            source_file: cspReport['source-file'],
            line_number: cspReport['line-number'],
            column_number: cspReport['column-number'],
            disposition: cspReport['disposition'],
            user_agent: req.headers.get('user-agent'),
            timestamp: new Date().toISOString()
          },
          ip_address: req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown'
        });

      // Log high-severity violations immediately
      if (severity === 'high') {
        console.error('HIGH SEVERITY CSP VIOLATION:', {
          directive: violatedDirective,
          blockedUri: blockedUri,
          documentUri: cspReport['document-uri'],
          sourceFile: cspReport['source-file']
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        received: true, 
        severity,
        false_positive: isFalsePositive 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('CSP report processing error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});