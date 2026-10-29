const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' };
function json(data, status = 200) { return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS }); }
function clean(value, max = 200) { return String(value ?? '').trim().slice(0, max); }
function sameOrigin(request) { const origin = request.headers.get('Origin'); return !origin || origin === new URL(request.url).origin; }
function isAdmin(request, env) { const supplied = request.headers.get('X-Admin-Password') || ''; return !!env.ADMIN_PASSWORD && supplied.length === env.ADMIN_PASSWORD.length && supplied === env.ADMIN_PASSWORD; }
function priceObject(row) { return { id: row.id, deviceType: row.device_type, brand: row.brand, model: row.model, repair: row.repair, priceCents: row.price_cents, note: row.note || '', active: !!row.active }; }
export default {
 async fetch(request, env) {
   const url = new URL(request.url);
   if (url.pathname.startsWith('/api/')) {
     if (!sameOrigin(request)) return json({ ok:false, error:'origin_not_allowed' }, 403);
     if (url.pathname === '/api/prices' && request.method === 'GET') {
       try { const { results = [] } = await env.DB.prepare('SELECT id, device_type, brand, model, repair, price_cents, note, active FROM prices WHERE active = 1 ORDER BY device_type, brand, model, repair').all(); return json({ ok:true, prices:results.map(priceObject) }); }
       catch (e) { return json({ ok:false, error:'database_not_ready' }, 503); }
     }
     if (url.pathname.startsWith('/api/admin/')) {
       if (url.pathname === '/api/admin/prices' && request.method === 'GET') {
         try { const { results=[] } = await env.DB.prepare('SELECT id, device_type, brand, model, repair, price_cents, note, active FROM prices ORDER BY device_type, brand, model, repair').all(); return json({ok:true,prices:results.map(priceObject)}); }
         catch(e) { return json({ok:false,error:'database_not_ready'},503); }
       }
       if (url.pathname === '/api/admin/prices' && request.method === 'POST') {
         try {
           const p = await request.json();
           const deviceType = clean(p.deviceType, 40), brand = clean(p.brand, 80), model = clean(p.model, 120), repair = clean(p.repair, 120), note = clean(p.note, 240);
           const price = Number(p.price);
           if (!deviceType || !brand || !model || !repair || !Number.isFinite(price) || price < 0 || price > 100000) return json({ok:false,error:'invalid_fields'},400);
           const cents = Math.round(price * 100), active = p.active ? 1 : 0;
           if (p.id) {
             await env.DB.prepare('UPDATE prices SET device_type=?, brand=?, model=?, repair=?, price_cents=?, note=?, active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').bind(deviceType,brand,model,repair,cents,note,active,Number(p.id)).run();
           } else {
             await env.DB.prepare('INSERT INTO prices (device_type,brand,model,repair,price_cents,note,active) VALUES (?,?,?,?,?,?,?) ON CONFLICT(device_type,brand,model,repair) DO UPDATE SET price_cents=excluded.price_cents,note=excluded.note,active=excluded.active,updated_at=CURRENT_TIMESTAMP').bind(deviceType,brand,model,repair,cents,note,active).run();
           }
           return json({ok:true});
         } catch(e) { return json({ok:false,error:'save_failed'},400); }
       }
       const match = url.pathname.match(/^\/api\/admin\/prices\/(\d+)$/);
       if (match && request.method === 'DELETE') { try { await env.DB.prepare('DELETE FROM prices WHERE id=?').bind(Number(match[1])).run(); return json({ok:true}); } catch(e) { return json({ok:false,error:'delete_failed'},500); } }
       return json({ok:false,error:'not_found'},404);
     }
     return json({ok:false,error:'not_found'},404);
   }
   return env.ASSETS.fetch(request);
 }
};
