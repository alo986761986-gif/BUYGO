import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { db } from '@/lib/db';
import { createSession } from '@/lib/auth';
import { loginSchema } from '@/lib/validators';
export async function POST(req: Request){
  const form=await req.formData(); const parsed=loginSchema.safeParse({email:form.get('email'),password:form.get('password')});
  if(!parsed.success) return NextResponse.json({error:'Credenziali non valide'},{status:400});
  const sql=db(); const rows=await sql<{id:string;email:string;password_hash:string;role:'CUSTOMER'|'SELLER'|'ADMIN';name:string|null}[]>`select id,email,password_hash,role,name from users where email=${parsed.data.email.toLowerCase()} limit 1`; const u=rows[0];
  if(!u || !await bcrypt.compare(parsed.data.password,u.password_hash)) return NextResponse.json({error:'Email o password errati'},{status:401});
  await createSession({id:u.id,email:u.email,role:u.role,name:u.name}); return NextResponse.redirect(new URL('/',req.url),303);
}
