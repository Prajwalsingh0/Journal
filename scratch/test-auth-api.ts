async function test() {
  const email = `test-${Date.now()}@example.com`;
  const password = 'Password123!';
  
  console.log(`Registering user with email: ${email} and password: ${password}`);
  const registerRes = await fetch('http://localhost:3000/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      name: 'Test User',
      isUnder18: false,
    })
  });
  
  if (!registerRes.ok) {
    console.error('Registration failed:', await registerRes.text());
    return;
  }
  
  console.log('Registration succeeded. Status:', registerRes.status);
  
  console.log('Attempting to login...');
  const loginRes = await fetch('http://localhost:3000/api/auth', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!loginRes.ok) {
    console.error('Login failed:', await loginRes.text());
  } else {
    console.log('Login succeeded. Status:', loginRes.status, await loginRes.json());
  }
}

test().catch(console.error);
