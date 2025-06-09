
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[EDGE-FUNCTION] ${requestId} - get-openai-key called at ${new Date().toISOString()}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`[EDGE-FUNCTION] ${requestId} - CORS preflight request handled`);
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log(`[EDGE-FUNCTION] ${requestId} - Retrieving LoveableKey secret from environment`);
    const OPENAI_API_KEY = Deno.env.get('LoveableKey')
    
    if (!OPENAI_API_KEY) {
      console.error(`[EDGE-FUNCTION] ${requestId} - LoveableKey secret not found in environment variables`);
      console.error(`[EDGE-FUNCTION] ${requestId} - Available env vars: ${Object.keys(Deno.env.toObject()).join(', ')}`);
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Log key characteristics without exposing the actual key
    console.log(`[EDGE-FUNCTION] ${requestId} - LoveableKey found`);
    console.log(`[EDGE-FUNCTION] ${requestId} - Key length: ${OPENAI_API_KEY.length}`);
    console.log(`[EDGE-FUNCTION] ${requestId} - Key prefix: ${OPENAI_API_KEY.substring(0, 7)}...`);
    console.log(`[EDGE-FUNCTION] ${requestId} - Key ends with: ...${OPENAI_API_KEY.substring(OPENAI_API_KEY.length - 4)}`);
    
    // Validate key format
    if (!OPENAI_API_KEY.startsWith('sk-')) {
      console.error(`[EDGE-FUNCTION] ${requestId} - Invalid key format - does not start with 'sk-'`);
      return new Response(
        JSON.stringify({ error: 'Invalid OpenAI API key format' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (OPENAI_API_KEY.length < 20) {
      console.error(`[EDGE-FUNCTION] ${requestId} - Key too short: ${OPENAI_API_KEY.length} characters`);
      return new Response(
        JSON.stringify({ error: 'OpenAI API key appears to be truncated' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`[EDGE-FUNCTION] ${requestId} - Returning valid key to client`);
    return new Response(
      JSON.stringify({ key: OPENAI_API_KEY }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error(`[EDGE-FUNCTION] ${requestId} - Error getting OpenAI key:`, error);
    console.error(`[EDGE-FUNCTION] ${requestId} - Error details:`, {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return new Response(
      JSON.stringify({ error: 'Failed to retrieve OpenAI key' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
