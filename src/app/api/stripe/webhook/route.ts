import Stripe from 'stripe';import { headers } from 'next/headers';import { db } from '@/lib/db';
export async function POST(req:Request){
  if(!process.env.STRIPE_SECRET_KEY||!process.env.STRIPE_WEBHOOK_SECRET)return new Response('Stripe non configurato',{status:503});
  const stripe=new Stripe(process.env.STRIPE_SECRET_KEY);const sig=(await headers()).get('stripe-signature');if(!sig)return new Response('Firma mancante',{status:400});
  let event:Stripe.Event;try{event=stripe.webhooks.constructEvent(await req.text(),sig,process.env.STRIPE_WEBHOOK_SECRET);}catch{return new Response('Firma non valida',{status:400});}
  const sql=db();
  if(event.type==='checkout.session.completed'){
    const session=event.data.object as Stripe.Checkout.Session;const orderId=session.metadata?.buygo_order_id;
    if(orderId){await sql.begin(async (tx:any)=>{await tx`update orders set status='PAID',updated_at=now() where id=${orderId} and status='PENDING'`;const items=await tx<any[]>`select product_id,quantity from order_items where order_id=${orderId}`;for(const i of items){if(i.product_id)await tx`update products set stock=greatest(stock-${i.quantity},0),updated_at=now() where id=${i.product_id}`;}});}
  }
  return new Response('ok');
}
