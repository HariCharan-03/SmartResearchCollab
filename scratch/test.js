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
    // 1. Create a Mentor
    const mentorRes = await request('/auth/register', 'POST', {
      name: 'Mentor Test',
      email: 'mentor3@test.com',
      password: 'password123',
      role: 'Mentor',
      accessCode: '2026'
    });
    const mentorToken = mentorRes.token;
    console.log('Mentor created');

    // 2. Mentor Creates a Project
    const projRes = await request('/ideas', 'POST', {
      title: 'Mentor Project',
      description: 'Test project',
      tags: ['Test']
    }, mentorToken);
    const ideaId = projRes._id;
    console.log('Project created:', ideaId);

    // 3. Create a Student
    const studentRes = await request('/auth/register', 'POST', {
      name: 'Student Test',
      email: 'student3@test.com',
      password: 'password123',
      role: 'Student'
    });
    const studentToken = studentRes.token;
    console.log('Student created');

    // 4. Student Sends Request
    const reqRes = await request('/collaborations/request', 'POST', {
      ideaId: ideaId,
      message: 'Let me join!'
    }, studentToken);
    console.log('Request sent:', reqRes._id);

    // 5. Mentor Fetches Requests
    const fetchRes = await request('/collaborations/project/' + ideaId, 'GET', null, mentorToken);
    console.log('Mentor fetched requests:', fetchRes.length);

    // 6. Mentor Accepts Request
    const acceptRes = await request('/collaborations/' + reqRes._id, 'PUT', {
      status: 'Approved'
    }, mentorToken);
    console.log('Mentor accepted request:', acceptRes.status);

  } catch (err) {
    console.error('Error:', err);
  }
}

testFlow();
