import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: Index });
function Index() {
  return (
    <main style={{ fontFamily: 'system-ui', padding: '3rem' }}>
      <h1>Fieldnotes CMS</h1>
      <p>
        <a href="/admin">Open Payload admin</a>
      </p>
      <p>
        <a href={import.meta.env.VITE_SITE_URL || 'http://localhost:4321'}>
          Open the Astro site
        </a>
      </p>
    </main>
  );
}
