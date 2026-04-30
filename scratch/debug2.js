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
    // Use existing test accounts
    const student = await req('/auth/login', 'POST', { email: 'debug_student@test.com', password: 'pass1234' });
    const mentor  = await req('/auth/login', 'POST', { email: 'debug_mentor@test.com',  password: 'pass1234', accessCode: '2026' });
    const creator = await req('/auth/login', 'POST', { email: 'debug_creator@test.com', password: 'pass1234' });
    console.log('All logged in OK');

    const ideas = await req('/ideas', 'GET', null, student.token);
    const debugIdea = ideas.find(i => i.title === 'Debug Project');
    console.log('Found idea:', debugIdea._id);

    // Fresh request from student
    const collab = await req('/collaborations/request', 'POST', {
      ideaId: debugIdea._id, message: 'Please let me join!'
    }, student.token).catch(e => { console.log('Request send error:', e); return null; });

    if (!collab) {
      // Maybe already sent - fetch existing
      const myReqs = await req('/collaborations/my-requests', 'GET', null, student.token);
      const existing = myReqs.find(r => r.status === 'Pending');
      if (!existing) { console.log('No pending request found'); return; }
      console.log('Using existing request:', existing._id);
      
      // Mentor approves
      const resp = await req('/collaborations/' + existing._id, 'PUT', {
        status: 'Approved', responseMessage: 'Welcome! Check Slack.'
      }, mentor.token);
      console.log('Accept result:', resp.status, resp.responseMessage);
      return;
    }

    console.log('Request sent:', collab._id);

    // Mentor fetches global incoming requests
    const incoming = await req('/collaborations/incoming-requests', 'GET', null, mentor.token);
    console.log('Mentor incoming count:', incoming.length);
    const myReq = incoming.find(r => r._id === collab._id);
    console.log('Mentor can see THIS request:', !!myReq);

    // Mentor accepts with message
    const resp = await req('/collaborations/' + collab._id, 'PUT', {
      status: 'Approved', responseMessage: 'Welcome! Check Slack.'
    }, mentor.token);
    console.log('Accept result:', resp.status, '| Response message:', resp.responseMessage);

    // Check student's my-requests for the response
    const myReqs = await req('/collaborations/my-requests', 'GET', null, student.token);
    const updated = myReqs.find(r => r._id === collab._id);
    console.log('Student sees status:', updated?.status, '| Mentor reply:', updated?.responseMessage);

    // Confirm student is now a team member
    const ideaDetail = await req('/ideas/' + debugIdea._id, 'GET', null, student.token);
    const isMember = ideaDetail.teamMembers.some(m => m.userId._id === student._id);
    console.log('Student is team member now:', isMember);

  } catch (e) {
    console.error('Error:', e);
  }
}
main();
