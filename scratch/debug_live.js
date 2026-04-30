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
    // Find the creator of "AI Based Crop Health Agent"
    // We need an admin or any token to list ideas
    const creator = await api('/auth/login', 'POST', { email: 'role_creator@test.com', password: 'pass1234', accessCode: 'CREATOR2026' });
    console.log('Creator logged in:', creator.name, '| ID:', creator._id);

    const ideas = await api('/ideas', 'GET', null, creator.token);
    const targetIdea = ideas.find(i => i.title === 'AI Based Crop Health Agent');
    if (targetIdea) {
      console.log('\n=== AI Based Crop Health Agent ===');
      console.log('Idea ID:', targetIdea._id);
      console.log('Created By ID:', targetIdea.createdBy._id || targetIdea.createdBy);
      console.log('Created By Name:', targetIdea.createdBy.name || 'unknown');
      console.log('Creator matches logged-in user?', (targetIdea.createdBy._id || targetIdea.createdBy) === creator._id);
    } else {
      console.log('Idea not found for this creator. All ideas:');
      ideas.forEach(i => console.log(' -', i.title, '| by:', i.createdBy?.name || i.createdBy));
    }

    // Check incoming requests for this creator
    const incoming = await api('/collaborations/incoming-requests', 'GET', null, creator.token);
    console.log('\nIncoming requests for this Creator:', incoming.length);
    incoming.forEach(r => console.log(' -', r.userId?.name, '->', r.ideaId?.title, '| status:', r.status));

    // Also check ALL pending requests in DB (using admin if available)
    console.log('\n--- Checking all requests in DB ---');
    const allIdeas = await api('/ideas', 'GET', null, creator.token);
    console.log('Total ideas in system:', allIdeas.length);
    allIdeas.forEach(i => console.log(' -', i.title, '| createdBy:', i.createdBy?.name, i.createdBy?._id));

  } catch(e) { console.error('Error:', JSON.stringify(e)); }
}
main();
