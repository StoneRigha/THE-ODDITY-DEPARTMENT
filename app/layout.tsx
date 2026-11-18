import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';
export const metadata: Metadata = { title: 'The Oddity Department — Your life, suspiciously foretold.', description: 'A highly unofficial department for extremely specific predictions about your otherwise ordinary existence.', metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'), openGraph: { title: 'The Oddity Department', description: 'The universe has a weird sense of humour. Get your personal omen.', type: 'website' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className="noise"><Toaster theme="dark" position="bottom-right" richColors />{children}</body></html>; }
