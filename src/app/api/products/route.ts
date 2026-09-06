import { NextResponse } from 'next/server'; import { db } from '@/lib/db';
export async function GET(){const rows=await db()`select id,name,slug,description,price_cents,currency,stock,image_url from products where active=true and stock>0 order by created_at desc limit 100`;return NextResponse.json({products:rows})}
