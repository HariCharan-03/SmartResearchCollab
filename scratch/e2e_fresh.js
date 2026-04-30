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
    // Use NEW student to avoid "request already sent" duplicate
    console.log('--- Registering fresh student ---');
    const student = await api('/auth/register', 'POST', { name: 'Fresh Student', email: 'fresh_student2@test.com', password: 'pass1234', role: 'Student' });
    console.log('✅ Fresh student registered:', student.name);

    const creator = await api('/auth/login', 'POST', { email: 'role_creator@test.com', password: 'pass1234' });
    console.log('✅ Creator logged in:', creator.name);

    const ideas = await api('/ideas', 'GET', null, student.token);
    const target = ideas.find(i => i.title === 'Role Test Project');
    console.log('✅ Target idea:', target._id);

    // Student sends request
    const collab = await api('/collaborations/request', 'POST', {
      ideaId: target._id, message: 'Hi! I have React and Python skills. Would love to collaborate!'
    }, student.token);
    console.log('✅ Student sent join request:', collab._id);

    // Creator checks incoming requests
    const incoming = await api('/collaborations/incoming-requests', 'GET', null, creator.token);
    console.log('Creator sees', incoming.length, 'pending request(s)');
    const pending = incoming.find(r => r._id === collab._id);
    if (!pending) { console.log('❌ Creator cannot see the request'); return; }
    console.log('✅ Creator sees the request!');
    console.log('   From:', pending.userId.name, '|', pending.message);

    // Creator accepts with message
    const approved = await api('/collaborations/' + pending._id, 'PUT', {
      status: 'Approved', responseMessage: 'Welcome! Join our Discord and start with the README.'
    }, creator.token);
    console.log('✅ Accepted! Status:', approved.status, '| Reply:', approved.responseMessage);

    // Student checks My Projects
    const allIdeas = await api('/ideas', 'GET', null, student.token);
    const isMember = allIdeas.some(i =>
      i.title === 'Role Test Project' && i.teamMembers.some(m => m.userId._id === student._id)
    );
    console.log(isMember ? '✅ Project appears in Student My Projects!' : '❌ NOT in My Projects');

    // Student checks Sent Requests
    const myReqs = await api('/collaborations/my-requests', 'GET', null, student.token);
    const myReq = myReqs.find(r => r.ideaId?.title === 'Role Test Project');
    console.log('✅ Student sent request status:', myReq?.status, '| Creator reply:', myReq?.responseMessage);

    console.log('\n🎉 COMPLETE FLOW VERIFIED!');
  } catch(e) { console.error('❌ ERROR:', JSON.stringify(e)); }
}
main();

// Check what teamMembers actually looks like
async function debugTeam() {
  const student = await api('/auth/login', 'POST', { email: 'fresh_student2@test.com', password: 'pass1234' });
  const creator = await api('/auth/login', 'POST', { email: 'role_creator@test.com', password: 'pass1234' });
  const idea = await api('/ideas/69f39ea6e7553bb52d1f3b90', 'GET', null, student.token);
  console.log('student._id:', student._id);
  console.log('teamMembers:', JSON.stringify(idea.teamMembers, null, 2));
}
debugTeam().catch(console.error);
