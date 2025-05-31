import React from 'react';

export const metadata = {
  title: 'Biblio',
  description: 'Book reviews site',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Biblio</title>
      </head>
      <body>
        <header style={{
          backgroundColor: '#1969d2',
          color: 'white',
          padding: '1rem',
          textAlign: 'left',
        }}>
          <h1>Biblio</h1>
        </header>

        <main style={{ padding: '2rem' }}>
          {children}
        </main>

        <footer style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p>© 2025 Biblio</p>
        </footer>
      </body>
    </html>
  );
}
