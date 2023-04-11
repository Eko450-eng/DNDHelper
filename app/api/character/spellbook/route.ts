import db from "@/db/db"
import { Character, Spellbook } from "@/db/schema/schema"
import { NextResponse } from "next/server"
import { and, eq } from 'drizzle-orm/expressions'

export async function POST(req: Request) {
  const body = await req.json()
  const { user, tier, slots } = body

  const character = await db.select().from(Character).where(eq(Character.playerid, user.user.id))
  const characterid = character[0].id


  const values = {
    tier: tier,
    slots: slots,
    characterid: characterid
  }

  const existing = await db.select().from(Spellbook).where(and(eq(Spellbook.characterid, characterid), eq(Spellbook.tier, tier)))

  if (existing.length !== 0) {
    await db.update(Spellbook)
      .set(values)
      .where(and(eq(Spellbook.characterid, characterid), eq(Spellbook.tier, tier)))
  } else {
    await db.insert(Spellbook).values(values)
  }

  return NextResponse.json({ status: 200, message: "Character created" })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userID = searchParams.get("userID")

  if (!userID) return
  const character = await db.select().from(Character).where(eq(Character.playerid, userID))
  const spellbook = await db.select().from(Spellbook).where(eq(Spellbook.characterid, character[0].id)).orderBy(Spellbook.tier)

  return NextResponse.json(spellbook)
}
