import db from "@/db/db"
import { Spell } from "@/db/schema/schema"
import { inArray } from "drizzle-orm/expressions"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()

  const { spellIds } = body

  if (!spellIds) return
  const spells = await db.select().from(Spell).where(inArray(Spell.id, spellIds))
  return NextResponse.json({ message: `The spells are`, spells: spells })
}
