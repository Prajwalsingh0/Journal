async function test() {
  const url = 'http://localhost:3000/api/entries';
  console.log('Fetching', url);
  const res = await fetch(url);
  if (!res.ok) {
    console.error('Failed to fetch:', res.status, await res.text());
    return;
  }
  const data = await res.json();
  console.log('Returned entries count:', data.length);
  if (data.length > 0) {
    console.log('First entry:', data[0]);
  }
}

test().catch(console.error);
