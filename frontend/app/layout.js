import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Kỷ Niệm Sự Kiện',
  description: 'Xem lại những khoảnh khắc đáng nhớ',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}