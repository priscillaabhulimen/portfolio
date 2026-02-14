import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Priscilla Abhulimen - Software Engineer',
  description: 'Portfolio of Priscilla Abhulimen, a software engineer specializing in full-stack development and product design. Explore my projects, experience, and contact information.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
