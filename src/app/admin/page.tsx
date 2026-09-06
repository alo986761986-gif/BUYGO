import { requireRole } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
export default async function Admin(){
  const user=await requireRole('ADMIN'); if(!user) redirect('/login'); if(!user)return null;
  let stats={users:0,sellers:0,products:0,orders:0}; let pending:any[]=[];
  try{const sql=db();const [u,s,p,o,ps]=await Promise.all([sql`select count(*)::int as n from users`,sql`select count(*)::int as n from seller_profiles`,sql`select count(*)::int as n from products`,sql`select count(*)::int as n from orders`,sql`select sp.user_id,sp.store_name,sp.slug,u.email from seller_profiles sp join users u on u.id=sp.user_id where sp.approved=false order by sp.created_at asc`]);stats={users:u[0].n,sellers:s[0].n,products:p[0].n,orders:o[0].n};pending=ps as any[];}catch{}
  return <main className="wrap section"><h1>BUYGO Admin</h1><div className="grid"><div className="card"><h3>Utenti</h3><div className="price">{stats.users}</div></div><div className="card"><h3>Venditori</h3><div className="price">{stats.sellers}</div></div><div className="card"><h3>Prodotti</h3><div className="price">{stats.products}</div></div><div className="card"><h3>Ordini</h3><div className="price">{stats.orders}</div></div></div><section className="section"><h2>Venditori da approvare</h2>{pending.length===0?<div className="empty">Nessuna richiesta venditore in attesa.</div>:<div className="grid">{pending.map((s:any)=><div className="card" key={s.user_id}><h3>{s.store_name}</h3><p className="muted">{s.email}</p><form action="/api/admin/sellers/approve" method="post"><input type="hidden" name="sellerId" value={s.user_id}/><button className="btn">Approva venditore</button></form></div>)}</div>}</section></main>
}
