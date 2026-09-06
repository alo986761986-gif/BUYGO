import { NextResponse } from 'next/server';
import { currentUser, createSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';
const schema=z.object({storeName:z.string().trim().min(2).max(80),slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100)});
export async function POST(req:Request){
  const user=await currentUser(); if(!user)return NextResponse.json({error:'Login richiesto'},{status:401});
  const f=await req.formData(); const parsed=schema.safeParse({storeName:f.get('storeName'),slug:f.get('slug')});
  if(!parsed.success)return NextResponse.json({error:'Dati negozio non validi'},{status:400});
  const sql=db();
  try{
    await sql.begin(async (tx:any)=>{await tx`insert into seller_profiles(user_id,store_name,slug,approved) values(${user.id},${parsed.data.storeName},${parsed.data.slug},false)`;await tx`update users set role='SELLER',updated_at=now() where id=${user.id}`;});
    await createSession({...user,role:'SELLER'});
    return NextResponse.redirect(new URL('/seller',req.url),303);
  }catch{return NextResponse.json({error:'Negozio già esistente o slug non disponibile'},{status:409});}
}
