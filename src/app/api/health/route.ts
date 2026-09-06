import { NextResponse } from 'next/server'; import { db } from '@/lib/db';
export async function GET(){try{await db()`select 1`;return NextResponse.json({ok:true,service:'BUYGO',database:'up'})}catch{return NextResponse.json({ok:false,service:'BUYGO',database:'down'},{status:503})}}
