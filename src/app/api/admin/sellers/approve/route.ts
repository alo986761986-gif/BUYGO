import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';
export async function POST(req:Request){
  const admin=await requireRole('ADMIN'); if(!admin)return NextResponse.json({error:'Non autorizzato'},{status:401});
  const f=await req.formData(); const sellerId=String(f.get('sellerId')||'');
  if(!/^[0-9a-f-]{36}$/i.test(sellerId))return NextResponse.json({error:'ID venditore non valido'},{status:400});
  await db()`update seller_profiles set approved=true where user_id=${sellerId}`;
  return NextResponse.redirect(new URL('/admin',req.url),303);
}
