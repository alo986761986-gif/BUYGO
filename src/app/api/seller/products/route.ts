import { NextResponse } from 'next/server'; import { requireRole } from '@/lib/auth'; import { db } from '@/lib/db'; import { productSchema } from '@/lib/validators';
export async function POST(req:Request){
  const user=await requireRole('SELLER','ADMIN');if(!user)return NextResponse.json({error:'Non autorizzato'},{status:401});
  const f=await req.formData(); const parsed=productSchema.safeParse({name:f.get('name'),slug:f.get('slug'),description:f.get('description')||'',priceCents:Number(f.get('priceCents')),stock:Number(f.get('stock')),currency:String(f.get('currency')||'EUR').toUpperCase(),active:f.get('active')==='true'});
  if(!parsed.success)return NextResponse.json({error:'Prodotto non valido',issues:parsed.error.issues},{status:400});
  const sql=db();let approved=user.role==='ADMIN'; if(user.role==='SELLER'){const rows=await sql<{approved:boolean}[]>`select approved from seller_profiles where user_id=${user.id}`;approved=Boolean(rows[0]?.approved);}
  const p=parsed.data;await sql`insert into products(seller_id,name,slug,description,price_cents,currency,stock,active) values(${user.id},${p.name},${p.slug},${p.description},${p.priceCents},${p.currency},${p.stock},${approved&&p.active})`;
  return NextResponse.redirect(new URL('/seller',req.url),303)
}
