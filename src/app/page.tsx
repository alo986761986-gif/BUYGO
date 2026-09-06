import Link from 'next/link';
import { db } from '@/lib/db';

type Product = { id:string; name:string; slug:string; price_cents:number; currency:string; stock:number; image_url:string|null };
export default async function Home({ searchParams }: { searchParams: Promise<{q?: string}> }) {
  const { q = '' } = await searchParams;
  let products: Product[] = [];
  let dbReady = true;
  try {
    const sql = db();
    products = q.trim()
      ? await sql<Product[]>`select id,name,slug,price_cents,currency,stock,image_url from products where active=true and stock>0 and name ilike ${'%'+q.trim()+'%'} order by created_at desc limit 40`
      : await sql<Product[]>`select id,name,slug,price_cents,currency,stock,image_url from products where active=true and stock>0 order by created_at desc limit 40`;
  } catch { dbReady = false; }
  return <main className="wrap"><section className="hero"><span className="badge">BUYGO MARKETPLACE</span><h1>Tutto quello che cerchi.<br/>Quando c&apos;è davvero.</h1><p>BUYGO parte vuoto: nessun prodotto finto, nessuna recensione inventata. Qui appariranno solo prodotti inseriti da venditori reali e approvati.</p></section><section className="section"><h2>{q?`Risultati per “${q}”`:'Prodotti'}</h2>{!dbReady?<div className="empty"><h3>Database non ancora collegato</h3><p>Configura DATABASE_URL e inizializza lo schema BUYGO.</p></div>:products.length===0?<div className="empty"><h3>Nessun prodotto disponibile</h3><p>Il catalogo è vuoto. I prodotti compariranno dopo l&apos;inserimento e l&apos;approvazione.</p><Link className="btn" href="/seller">Seller Center</Link></div>:<div className="grid">{products.map(p=><Link className="card" key={p.id} href={`/products/${p.slug}`}><h3>{p.name}</h3><div className="price">{(p.price_cents/100).toLocaleString('it-IT',{style:'currency',currency:p.currency})}</div><p className="muted">Disponibili: {p.stock}</p></Link>)}</div>}</section></main>;
}
