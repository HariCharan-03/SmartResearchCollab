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
        console.log(`[${method} ${path}] HTTP ${res.statusCode}`);
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
    const student = await req('/auth/login', 'POST', { email: 'debug_student@test.com', password: 'pass1234' });
    const mentor  = await req('/auth/login', 'POST', { email: 'debug_mentor@test.com',  password: 'pass1234', accessCode: '2026' });
    
    // Get all my requests from student (array)
    const myReqs = await req('/collaborations/my-requests', 'GET', null, student.token);
    console.log('Student requests count:', Array.isArray(myReqs) ? myReqs.length : 'NOT ARRAY - got: ' + typeof myReqs);
    console.log('Requests:', JSON.stringify(myReqs).substring(0, 500));
    
    const pending = Array.isArray(myReqs) ? myReqs.find(r => r.status === 'Pending') : null;
    if (!pending) {
      console.log('No pending requests to approve');
      
      // Show current state of all requests
      const allReqs = Array.isArray(myReqs) ? myReqs : [];
      allReqs.forEach(r => console.log('  -> status:', r.status, 'responseMessage:', r.responseMessage));
      return;
    }

    console.log('Approving request:', pending._id);
    const resp = await req('/collaborations/' + pending._id, 'PUT', {
      status: 'Approved', responseMessage: 'Welcome to the team!'
    }, mentor.token);
    console.log('Accept result:', resp.status, '| Response:', resp.responseMessage);

  } catch (e) {
    console.error('Error:', JSON.stringify(e));
  }
}
main();
