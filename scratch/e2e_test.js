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
        try {
          const d = JSON.parse(body);
          if (res.statusCode >= 400) reject({ code: res.statusCode, ...d });
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
    console.log('\n--- STEP 1: Login as Student and Project Creator ---');
    const student = await api('/auth/login', 'POST', { email: 'role_student@test.com', password: 'pass1234' });
    console.log('Student:', student.name, '| role:', student.role);

    const creator = await api('/auth/login', 'POST', { email: 'role_creator@test.com', password: 'pass1234' });
    console.log('Creator:', creator.name, '| role:', creator.role);

    console.log('\n--- STEP 2: Student sends a join request ---');
    const ideas = await api('/ideas', 'GET', null, student.token);
    const target = ideas.find(i => i.title === 'Role Test Project');
    if (!target) { console.log('❌ Target idea not found. Ideas:', ideas.map(i => i.title)); return; }
    console.log('Found idea:', target.title, target._id);

    const collab = await api('/collaborations/request', 'POST', {
      ideaId: target._id, message: 'Hi, I want to join your project! I have Python skills.'
    }, student.token).catch(e => {
      if (e.message === 'Request already sent') {
        console.log('(Request already exists from a previous test, continuing...)');
        return null;
      }
      throw e;
    });
    if (collab) console.log('✅ Student sent request:', collab._id);

    console.log('\n--- STEP 3: Creator sees the incoming request ---');
    const incoming = await api('/collaborations/incoming-requests', 'GET', null, creator.token);
    console.log('Creator incoming requests count:', incoming.length);
    const pending = incoming.find(r => r.ideaId?._id === target._id || r.ideaId === target._id);
    if (!pending) { console.log('❌ Creator does NOT see the request!', JSON.stringify(incoming[0])); return; }
    console.log('✅ Creator sees the request!');
    console.log('   Student:', pending.userId.name);
    console.log('   Message:', pending.message);
    console.log('   Status:', pending.status);

    console.log('\n--- STEP 4: Creator accepts with a response message ---');
    const approved = await api('/collaborations/' + pending._id, 'PUT', {
      status: 'Approved',
      responseMessage: 'Welcome to the team! Please check our GitHub repo and join the Discord.'
    }, creator.token);
    console.log('✅ Creator accepted! Status:', approved.status);
    console.log('   Response message saved:', approved.responseMessage);

    console.log('\n--- STEP 5: Check student\'s My Projects (should include this project) ---');
    const allIdeas = await api('/ideas', 'GET', null, student.token);
    const myProjects = allIdeas.filter(idea =>
      idea.createdBy._id === student._id ||
      idea.teamMembers.some(m => m.userId._id === student._id || m.userId === student._id)
    );
    const isNowMember = myProjects.some(p => p._id === target._id || p.title === 'Role Test Project');
    console.log(isNowMember ? '✅ Project now shows in Student My Projects!' : '❌ Project NOT in student My Projects');

    console.log('\n--- STEP 6: Student sees the response message in Sent Requests ---');
    const myReqs = await api('/collaborations/my-requests', 'GET', null, student.token);
    const myReq = myReqs.find(r => r.ideaId?._id === target._id || (r.ideaId && r.ideaId.title === 'Role Test Project'));
    if (myReq) {
      console.log('✅ Student sees their request');
      console.log('   Status:', myReq.status);
      console.log('   Mentor reply:', myReq.responseMessage || '(no response message)');
    } else {
      console.log('❌ Student cannot see their request');
    }

    console.log('\n✅ ALL DONE — FLOW COMPLETE');
  } catch(e) { console.error('\n❌ ERROR:', JSON.stringify(e)); }
}
main();
