const http = require('http');
function req(path, method, data, token) {
  return new Promise((resolve, reject) => {
    const opts = { hostname: 'localhost', port: 5001, path: '/api' + path, method, headers: { 'Content-Type': 'application/json', ...(token && { 'Authorization': 'Bearer ' + token }) } };
    const r = http.request(opts, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try { const d = JSON.parse(body); if (res.statusCode >= 400) reject({ status: res.statusCode, ...d }); else resolve(d); }
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
    // Register Student (no code needed)
    const student = await req('/auth/register', 'POST', { name: 'Role Student', email: 'role_student@test.com', password: 'pass1234', role: 'Student' });
    console.log('✅ Student registered (no code needed)');

    // Register Project Creator with code
    const creator = await req('/auth/register', 'POST', { name: 'Role Creator', email: 'role_creator@test.com', password: 'pass1234', role: 'Project Creator', accessCode: 'CREATOR2026' });
    console.log('✅ Project Creator registered with CREATOR2026');

    // Register Mentor with code
    const mentor = await req('/auth/register', 'POST', { name: 'Role Mentor', email: 'role_mentor@test.com', password: 'pass1234', role: 'Mentor', accessCode: '2026' });
    console.log('✅ Mentor registered with 2026');

    // Creator posts a project
    const idea = await req('/ideas', 'POST', { title: 'Role Test Project', description: 'Testing', tags: ['Test'] }, creator.token);
    console.log('✅ Creator posted idea:', idea._id);

    // Student tries to post - should fail
    await req('/ideas', 'POST', { title: 'Unauthorized', description: 'Test', tags: [] }, student.token)
      .then(() => console.log('❌ Student should NOT be able to post ideas'))
      .catch(e => console.log('✅ Student correctly blocked from posting idea:', e.message));

    // Student sends join request
    const collab = await req('/collaborations/request', 'POST', { ideaId: idea._id, message: 'I want to join!' }, student.token);
    console.log('✅ Student sent request:', collab._id);

    // Mentor tries to accept - should be BLOCKED
    await req('/collaborations/' + collab._id, 'PUT', { status: 'Approved' }, mentor.token)
      .then(() => console.log('❌ Mentor should NOT be able to accept requests'))
      .catch(e => console.log('✅ Mentor correctly blocked from accepting:', e.message));

    // Creator accepts request - should work
    const approved = await req('/collaborations/' + collab._id, 'PUT', { status: 'Approved', responseMessage: 'Welcome!' }, creator.token);
    console.log('✅ Creator accepted request! Status:', approved.status, '| Message:', approved.responseMessage);

    // Verify student is now a team member
    const ideaData = await req('/ideas/' + idea._id, 'GET', null, student.token);
    const isMember = ideaData.teamMembers.some(m => m.userId._id === student._id);
    console.log('✅ Student is now a team member:', isMember);

  } catch(e) { console.error('❌ Error:', JSON.stringify(e)); }
}
main();
