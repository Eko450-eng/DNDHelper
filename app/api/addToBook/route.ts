import db from "@/db/db"
import { Character, Spellbook } from "@/db/schema/schema"
import { NextResponse } from "next/server"
import { and, eq } from 'drizzle-orm/expressions'

export async function POST(req: Request) {
  const body = await req.json()
  const { user, tier, spells } = body

  const character = await db.select().from(Character).where(eq(Character.playerid, user.user.id))
  const characterid = character[0].id

  const existing: Spellbook[] = await db.select().from(Spellbook).where(and(eq(Spellbook.characterid, characterid), eq(Spellbook.tier, tier)))

  if (!existing) await db.insert(Spellbook).values({
    spells: spells,
    characterid: characterid,
    slots: 0,
    tier: tier
  })

  const oldSpells = existing[0].spells
  if (oldSpells && oldSpells.includes(spells)) return NextResponse.json(500)

  const newSpells = () => {
    if (!oldSpells) return [spells]
    return [...oldSpells, spells]
  }

  await db.update(Spellbook)
    .set({
      spells: newSpells()
    })
    .where(and(eq(Spellbook.characterid, characterid), eq(Spellbook.tier, tier)))

  return NextResponse.json({ status: 200, message: "Character created" })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userID = searchParams.get("userID")

  if (!userID) return
  const character = await db.select().from(Character).where(eq(Character.playerid, userID))
  try {
    const stats = await db.select().from(Spellbook).where(eq(Spellbook.characterid, character[0].id))
    return NextResponse.json({ stats: stats })
  } catch (e) {
    return NextResponse.json(500)
  }
}
