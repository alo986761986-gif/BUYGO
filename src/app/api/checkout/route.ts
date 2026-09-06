import { NextResponse } from 'next/server';import Stripe from 'stripe';import { currentUser } from '@/lib/auth';import { db } from '@/lib/db';
export async function POST(req:Request){
  const user=await currentUser();if(!user)return NextResponse.redirect(new URL('/login',req.url),303);
  if(!process.env.STRIPE_SECRET_KEY)return NextResponse.json({error:'STRIPE_SECRET_KEY non configurata'},{status:503});
  const sql=db();const items=await sql<any[]>`select p.id,p.seller_id,p.name,p.price_cents,p.currency,ci.quantity from carts c join cart_items ci on ci.cart_id=c.id join products p on p.id=ci.product_id where c.user_id=${user.id} and p.active=true and p.stock>=ci.quantity`;
  if(!items.length)return NextResponse.json({error:'Carrello vuoto'},{status:400});
  const currency=items[0].currency;if(items.some((i:any)=>i.currency!==currency))return NextResponse.json({error:'Carrello con valute miste non supportato'},{status:400});
  const total=items.reduce((n:number,i:any)=>n+i.price_cents*i.quantity,0);
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);const origin=process.env.NEXT_PUBLIC_APP_URL||new URL(req.url).origin;
  const order=await sql.begin(async (tx:any)=>{const [o]=await tx<{id:string}[]>`insert into orders(user_id,total_cents,currency) values(${user.id},${total},${currency}) returning id`;for(const i of items){await tx`insert into order_items(order_id,product_id,seller_id,product_name,unit_price_cents,quantity) values(${o.id},${i.id},${i.seller_id},${i.name},${i.price_cents},${i.quantity})`;}return o;});
  const session=await stripe.checkout.sessions.create({mode:'payment',customer_email:user.email,metadata:{buygo_order_id:order.id},line_items:items.map((i:any)=>({quantity:i.quantity,price_data:{currency:i.currency.toLowerCase(),unit_amount:i.price_cents,product_data:{name:i.name}}})),success_url:`${origin}/orders?checkout=success`,cancel_url:`${origin}/cart`});
  await sql`update orders set stripe_session_id=${session.id} where id=${order.id}`;
  return NextResponse.redirect(session.url!,303)
}
