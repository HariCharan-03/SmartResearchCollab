const http = require('http');

function request(path, method, data, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: '/api' + path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (token) {
      options.headers['Authorization'] = 'Bearer ' + token;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (res.statusCode >= 400) reject(parsed);
          else resolve(parsed);
        } catch(e) { resolve(body); }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function testFlow() {
  try {
    // login student3@test.com
    const studentRes = await request('/auth/login', 'POST', {
      email: 'student3@test.com',
      password: 'password123'
    });
    const studentToken = studentRes.token;
    const studentId = studentRes._id;
    console.log('Student logged in, ID:', studentId);

    // fetch the idea
    // Note: need the ideaId. Let's get all ideas and find 'Mentor Project'
    const ideas = await request('/ideas', 'GET', null, studentToken);
    const ideaId = ideas.find(i => i.title === 'Mentor Project')._id;

    const idea = await request('/ideas/' + ideaId, 'GET', null, studentToken);
    console.log('Team Members array:');
    console.log(JSON.stringify(idea.teamMembers, null, 2));

    const isTeamMember = idea.teamMembers.some(m => m.userId._id === studentId);
    console.log('isTeamMember:', isTeamMember);

  } catch (err) {
    console.error('Error:', err);
  }
}

testFlow();
