import './globals.css';
import NavBar from '@/components/NavBar';
import { ToastProvider } from '@/components/ToastProvider';

export const metadata = { title: 'Pi Expenses AMOLED', description: 'Gastos con AMOLED UI y PWA' };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <ToastProvider>
          <div className="container">
            <NavBar />
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
