import './globals.css';
import NavBar from '@/components/NavBar';

export const metadata = { title: 'Pi Expenses', description: 'Gastos de Hiram' };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#000000" />
</head>

      <body>
        <div className="container">
          <NavBar />
          {children}
        </div>
      </body>
    </html>
  );
}
