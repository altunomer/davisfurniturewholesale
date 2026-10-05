export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle API endpoints
    if (url.pathname.startsWith('/api/')) {
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-admin-key',
      };

      if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
      }

      // /api/products
      if (url.pathname === '/api/products') {
        if (request.method === 'GET') {
          try {
            const data = await env.DAVIS_STORAGE.get('products');
            return new Response(data || 'null', {
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), {
              status: 500,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          }
        }

        if (request.method === 'POST') {
          try {
            const body = await request.text();
            // Validate JSON
            const parsed = JSON.parse(body);
            if (!Array.isArray(parsed)) {
              return new Response(JSON.stringify({ error: 'Expected array of products' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
              });
            }
            await env.DAVIS_STORAGE.put('products', body);
            return new Response(JSON.stringify({ success: true, count: parsed.length }), {
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          }
        }
      }

      // /api/slides
      if (url.pathname === '/api/slides') {
        if (request.method === 'GET') {
          try {
            const data = await env.DAVIS_STORAGE.get('slides');
            return new Response(data || 'null', {
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), {
              status: 500,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          }
        }

        if (request.method === 'POST') {
          try {
            const body = await request.text();
            JSON.parse(body);
            await env.DAVIS_STORAGE.put('slides', body);
            return new Response(JSON.stringify({ success: true }), {
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          }
        }
      }

      // /api/settings
      if (url.pathname === '/api/settings') {
        if (request.method === 'GET') {
          try {
            const data = await env.DAVIS_STORAGE.get('settings');
            return new Response(data || 'null', {
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), {
              status: 500,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          }
        }

        if (request.method === 'POST') {
          try {
            const body = await request.text();
            JSON.parse(body);
            await env.DAVIS_STORAGE.put('settings', body);
            return new Response(JSON.stringify({ success: true }), {
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          }
        }
      }

      // /api/auth/password
      if (url.pathname === '/api/auth/password') {
        if (request.method === 'POST') {
          try {
            const { password, currentPassword } = await request.json();
            const savedPass = (await env.DAVIS_STORAGE.get('admin_password')) || 'davis2026';
            if (currentPassword && currentPassword !== savedPass) {
              return new Response(JSON.stringify({ error: 'Current password incorrect' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
              });
            }
            if (password) {
              await env.DAVIS_STORAGE.put('admin_password', password);
              return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
              });
            }
          } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          }
        }
      }

      // /api/auth/verify
      if (url.pathname === '/api/auth/verify') {
        if (request.method === 'POST') {
          try {
            const { password } = await request.json();
            const savedPass = (await env.DAVIS_STORAGE.get('admin_password')) || 'davis2026';
            if (password === savedPass) {
              return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
              });
            } else {
              return new Response(JSON.stringify({ success: false, error: 'Invalid password' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
              });
            }
          } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          }
        }
      }

      return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Default: serve static assets from ./out
    return env.ASSETS.fetch(request);
  },
};
