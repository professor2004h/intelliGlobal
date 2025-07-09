export default function TestPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: 'green' }}>✅ SERVER IS WORKING!</h1>
      <p>This is a simple test page to verify the server is running correctly.</p>
      <p>Current time: {new Date().toISOString()}</p>
    </div>
  );
}
