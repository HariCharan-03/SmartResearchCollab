const http = require('http');
function api(path, method, data, token) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost', port: 5001, path: '/api' + path, method,
      headers: { 'Content-Type': 'application/json', ...(token && { Authorization: 'Bearer ' + token }) }
    };
    const r = http.request(opts, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        console.log(`[${method} ${path}] HTTP ${res.statusCode}`);
        try { const d = JSON.parse(body); if (res.statusCode >= 400) reject({ code: res.statusCode, ...d }); else resolve(d); }
        catch(e) { resolve(body); }
      });
    });
    r.on('error', reject);
    if (data) r.write(JSON.stringify(data));
    r.end();
  });
}

async function main() {
  try {
    // Dr. Sarah is the real Project Creator who owns "AI Based Crop Health Agent"
    // But Dr. Sarah's role is 'Project Creator' so she needs CREATOR2026 to log in
    const sarah = await api('/auth/login', 'POST', { 
      email: 'sarah@research.hub', 
      password: 'password123', 
      accessCode: 'CREATOR2026'  // NEW: required for Project Creator login
    });
    console.log('Dr. Sarah logged in:', sarah.name, '| role:', sarah.role);

    // Check incoming requests
    const incoming = await api('/collaborations/incoming-requests', 'GET', null, sarah.token);
    console.log('Incoming requests for Dr. Sarah:', incoming.length);
    incoming.forEach(r => console.log(' -', r.userId?.name, '| project:', r.ideaId?.title, '| msg:', r.message?.substring(0, 40)));

  } catch(e) { console.error('Error:', JSON.stringify(e)); }
}
main();
