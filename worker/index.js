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

      // /api/inquiries
      if (url.pathname === '/api/inquiries') {
        if (request.method === 'GET') {
          try {
            const data = await env.DAVIS_STORAGE.get('inquiries');
            return new Response(data || '[]', {
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
            const newInq = await request.json();
            const raw = await env.DAVIS_STORAGE.get('inquiries');
            const list = raw ? JSON.parse(raw) : [];
            const updated = [newInq, ...list.filter(i => i.id !== newInq.id)];
            await env.DAVIS_STORAGE.put('inquiries', JSON.stringify(updated));
            return new Response(JSON.stringify({ success: true, count: updated.length }), {
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
          }
        }

        if (request.method === 'DELETE') {
          try {
            const { id } = await request.json();
            const raw = await env.DAVIS_STORAGE.get('inquiries');
            if (raw) {
              const list = JSON.parse(raw);
              const updated = id ? list.filter(i => i.id !== id) : [];
              await env.DAVIS_STORAGE.put('inquiries', JSON.stringify(updated));
            }
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

      // /api/send-email
      if (url.pathname === '/api/send-email') {
        if (request.method === 'POST') {
          try {
            const body = await request.json();
            const { inquiry, config, isTest, testRecipient } = body;
            const recipient = isTest
              ? (testRecipient || config?.recipientEmail || 'charlie@davisfurniturewholesale.com')
              : (config?.recipientEmail || 'charlie@davisfurniturewholesale.com');

            const fromEmail = config?.fromEmail || 'onboarding@resend.dev';
            const fromName = config?.fromName || 'Davis Furniture Wholesale';

            let subject = '';
            if (isTest) {
              subject = '[Davis Furniture] Test Email - Notification Dispatch Verified';
            } else if (inquiry?.type === 'quote') {
              subject = `[New Quote] ${inquiry?.productName || 'Bed Range'} - ${inquiry?.name || 'Client'}`;
            } else {
              subject = `[Trade Inquiry] ${inquiry?.subject || 'General Inquiry'} - ${inquiry?.name || 'Client'}`;
            }

            let htmlContent = '';
            if (isTest) {
              htmlContent = `<div style="font-family: Arial, sans-serif; padding: 20px;"><h2>Davis Furniture Wholesale</h2><p style="color: green; font-weight: bold;">Connection Successful!</p><p>Test notification delivered to ${recipient}.</p></div>`;
            } else {
              htmlContent = `<div style="font-family: Arial, sans-serif; padding: 20px;"><h2>New Inquiry Received</h2><p><strong>Name:</strong> ${inquiry?.name}</p><p><strong>Email:</strong> ${inquiry?.email}</p><p><strong>Phone:</strong> ${inquiry?.phone || '-'}</p><p><strong>Message:</strong> ${inquiry?.message}</p></div>`;
            }

            if (config?.mailProvider === 'resend' && config?.resendApiKey) {
              const resendRes = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${config.resendApiKey.trim()}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  from: `${fromName} <${fromEmail}>`,
                  to: [recipient],
                  cc: config?.ccEmail ? [config.ccEmail.trim()] : undefined,
                  reply_to: inquiry?.email || undefined,
                  subject: subject,
                  html: htmlContent
                })
              });
              const resendData = await resendRes.json();
              return new Response(JSON.stringify(resendData), {
                status: resendRes.status,
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
              });
            }

            return new Response(JSON.stringify({ success: true, simulated: true }), {
              headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
          } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), {
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
          }
        }
      }

      // /api/auth/password
      if (url.pathname === '/api/auth/password') {
        if (request.method === 'POST') {
          try {
            const { password, currentPassword } = await request.json();
            const savedPass = (await env.DAVIS_STORAGE.get('admin_password')) || 'LetmeGetin010203*';
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

      // /api/auth/credentials
      if (url.pathname === '/api/auth/credentials') {
        if (request.method === 'POST') {
          try {
            const { username, password } = await request.json();
            if (username) {
              await env.DAVIS_STORAGE.put('admin_username', username.trim());
            }
            if (password) {
              await env.DAVIS_STORAGE.put('admin_password', password);
            }
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

      // /api/auth/verify
      if (url.pathname === '/api/auth/verify') {
        if (request.method === 'POST') {
          try {
            const { username, password } = await request.json();
            const savedUser = (await env.DAVIS_STORAGE.get('admin_username')) || 'dr4carys';
            const savedPass = (await env.DAVIS_STORAGE.get('admin_password')) || 'LetmeGetin010203*';
            if (username?.trim() === savedUser && password === savedPass) {
              return new Response(JSON.stringify({ success: true }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
              });
            } else {
              return new Response(JSON.stringify({ success: false, error: 'Invalid username or password' }), {
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

    // Handle /product/* fallback for newly created products in KV
    if (url.pathname.startsWith('/product/')) {
      const assetRes = await env.ASSETS.fetch(request);
      if (assetRes.status === 404) {
        const shellUrl = new URL('/product/mars-range', request.url);
        const shellRes = await env.ASSETS.fetch(new Request(shellUrl, request));
        if (shellRes.ok) {
          return new Response(shellRes.body, {
            status: 200,
            headers: {
              ...Object.fromEntries(shellRes.headers),
              'Content-Type': 'text/html;charset=UTF-8',
            },
          });
        }
      }
      return assetRes;
    }

    // Handle /welcome-webmaster/products/edit/* fallback for newly created products in KV
    if (url.pathname.startsWith('/welcome-webmaster/products/edit/')) {
      const assetRes = await env.ASSETS.fetch(request);
      if (assetRes.status === 404) {
        const shellUrl = new URL('/welcome-webmaster/products/edit/2829', request.url);
        const shellRes = await env.ASSETS.fetch(new Request(shellUrl, request));
        if (shellRes.ok) {
          return new Response(shellRes.body, {
            status: 200,
            headers: {
              ...Object.fromEntries(shellRes.headers),
              'Content-Type': 'text/html;charset=UTF-8',
            },
          });
        }
      }
      return assetRes;
    }

    // Default: serve static assets from ./out
    return env.ASSETS.fetch(request);
  },
};

