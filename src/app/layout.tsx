import './globals.css';
import Link from 'next/link';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { currentUser } from '@/lib/auth';

export const metadata: Metadata = { title: 'BUYGO', description: 'Marketplace online BUYGO' };
export default async function RootLayout({ children }: Readonly<{children: ReactNode}>) {
  const user = await currentUser();
  return <html lang="it"><body><header className="top"><div className="wrap nav"><Link className="logo" href="/">BUY<b>GO</b></Link><form className="search" action="/"><input name="q" placeholder="Cerca su BUYGO" aria-label="Cerca prodotti" /></form><nav className="actions"><Link href="/orders">Ordini</Link><Link href="/cart">Carrello</Link>{user?<><Link href={user.role==='ADMIN'?'/admin':user.role==='SELLER'?'/seller':'/'}>{user.role}</Link><form action="/api/auth/logout" method="post"><button className="btn alt" type="submit">Esci</button></form></>:<Link className="btn" href="/login">Accedi</Link>}</nav></div></header>{children}</body></html>;
}
