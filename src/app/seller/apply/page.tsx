import { currentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function SellerApply(){
  const user=await currentUser();
  if(!user) redirect('/login');
  if(user?.role==='SELLER'||user?.role==='ADMIN') redirect('/seller');
  return <main className="wrap"><form className="form" action="/api/seller/apply" method="post"><h1>Apri il tuo negozio BUYGO</h1><p className="muted">La richiesta crea il profilo venditore, ma la pubblicazione resta bloccata fino all&apos;approvazione Admin.</p><label>Nome negozio</label><input name="storeName" minLength={2} maxLength={80} required/><label>Slug negozio</label><input name="slug" pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="mio-negozio" required/><p><button className="btn" type="submit">Invia richiesta</button></p></form></main>
}
