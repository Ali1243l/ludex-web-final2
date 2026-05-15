async function test() {
  const res = await fetch('http://localhost:3000/api/admin/profiles/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: "test-id", email: "test@pixel.com", name: "Test User" })
  });
  console.log(res.status, await res.text());
}
test();
