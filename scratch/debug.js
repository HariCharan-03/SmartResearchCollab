const http = require('http');

function req(path, method, data, token) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost', port: 5001,
      path: '/api' + path, method,
      headers: { 'Content-Type': 'application/json', ...(token && { 'Authorization': 'Bearer ' + token }) }
    };
    const r = http.request(opts, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const d = JSON.parse(body);
          console.log(`[${method} ${path}] HTTP ${res.statusCode}:`, JSON.stringify(d).substring(0, 300));
          if (res.statusCode >= 400) reject(d);
          else resolve(d);
        } catch(e) { resolve(body); }
      });
    });
    r.on('error', reject);
    if (data) r.write(JSON.stringify(data));
    r.end();
  });
}

async function main() {
  try {
    // Step 1: Register student
    const student = await req('/auth/register', 'POST', {
      name: 'Debug Student', email: 'debug_student@test.com', password: 'pass1234', role: 'Student'
    });
    const studentToken = student.token;
    const studentId = student._id;
    console.log('\n=== Student ID:', studentId, '===\n');

    // Step 2: Register mentor  
    const mentor = await req('/auth/register', 'POST', {
      name: 'Debug Mentor', email: 'debug_mentor@test.com', password: 'pass1234', role: 'Mentor', accessCode: '2026'
    });
    const mentorToken = mentor.token;
    const mentorId = mentor._id;
    console.log('\n=== Mentor ID:', mentorId, '===\n');

    // Step 3: Register creator to own a project
    const creator = await req('/auth/register', 'POST', {
      name: 'Debug Creator', email: 'debug_creator@test.com', password: 'pass1234', role: 'Project Creator'
    });
    const creatorToken = creator.token;

    // Step 4: Creator posts project
    const idea = await req('/ideas', 'POST', {
      title: 'Debug Project', description: 'Test', tags: ['Test']
    }, creatorToken);
    const ideaId = idea._id;
    console.log('\n=== Idea ID:', ideaId, '===\n');

    // Step 5: Student sends request
    const collab = await req('/collaborations/request', 'POST', {
      ideaId, message: 'I want to join!'
    }, studentToken);
    const requestId = collab._id;
    console.log('\n=== Request ID:', requestId, '===\n');

    // Step 6: Mentor fetches incoming requests (GLOBAL)
    const incoming = await req('/collaborations/incoming-requests', 'GET', null, mentorToken);
    console.log('\n=== Mentor sees incoming requests:', incoming.length, '===\n');

    // Step 7: Mentor accepts request with message
    const resp = await req('/collaborations/' + requestId, 'PUT', {
      status: 'Approved', responseMessage: 'Welcome! Check Slack.'
    }, mentorToken);
    console.log('\n=== Accept response status:', resp.status, '===\n');
    console.log('=== responseMessage stored:', resp.responseMessage, '===\n');

    // Step 8: Student checks my-requests (should show responseMessage)
    const myReqs = await req('/collaborations/my-requests', 'GET', null, studentToken);
    console.log('\n=== Student sent requests:', myReqs.map(r => ({ status: r.status, responseMessage: r.responseMessage })), '===\n');

    // Step 9: Check if student is now a team member of the idea
    const ideaData = await req('/ideas/' + ideaId, 'GET', null, studentToken);
    const isMember = ideaData.teamMembers.some(m => m.userId._id === studentId);
    console.log('\n=== Student is team member:', isMember, '===\n');

  } catch (e) {
    console.error('\n!!! ERROR:', e, '\n');
  }
}
main();
