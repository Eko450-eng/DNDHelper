import db from "@/db/db"
import { Character, Spellbook } from "@/db/schema/schema"
import { eq, and } from "drizzle-orm/expressions"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { spellId, tier, user } = body

  const character = await db.select().from(Character).where(eq(Character.playerid, user.id))
  const characterid = character[0].id

  if (!spellId) return
  const book: Spellbook[] = await db.select().from(Spellbook).where(and(eq(Spellbook.characterid, characterid), eq(Spellbook.tier, tier)))
  const oldSpells = book[0].spells
  const newSpells = oldSpells?.filter(spell => { return spell != spellId })

  const spells = await db.update(Spellbook)
    .set({ spells: newSpells })
    .where(and(eq(Spellbook.characterid, characterid), eq(Spellbook.tier, tier)))
  return NextResponse.json({ message: `The spells are`, spells: spells })
}
