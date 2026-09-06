import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createSession } from '@/lib/auth';
import { registerSchema } from '@/lib/validators';
export async function POST(req: Request){
  const form = await req.formData();
  const parsed = registerSchema.safeParse({email:form.get('email'),password:form.get('password'),name:form.get('name')||undefined});
  if(!parsed.success) return NextResponse.json({error:'Dati non validi'},{status:400});
  const sql=db(); const hash=await bcrypt.hash(parsed.data.password,12);
  try { const [u]=await sql<{id:string;email:string;role:'CUSTOMER';name:string|null}[]>`insert into users(email,password_hash,name) values(${parsed.data.email.toLowerCase()},${hash},${parsed.data.name??null}) returning id,email,role,name`; await createSession(u); return NextResponse.redirect(new URL('/',req.url),303); }
  catch { return NextResponse.json({error:'Email già registrata o database non disponibile'},{status:409}); }
}
