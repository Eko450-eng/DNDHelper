import db from "@/db/db"
import { Spell } from "@/db/schema/schema"
import { NextResponse } from "next/server"
import { and, eq, inArray, like } from 'drizzle-orm/expressions'
import { sql } from "drizzle-orm"

export async function GET(req: Request) {
  const spells = await db.select().from(Spell)
  return NextResponse.json({ message: `The spells are`, spells: spells })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { level, classes }: { level: number, classes: string } = body

  const spells = await db.execute(sql`select * from spell where ${classes}= ANY(classes) AND level = ${level}`)
  return NextResponse.json({ message: `The spell is`, spells: spells.rows })
}
