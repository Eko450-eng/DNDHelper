import db from "@/db/db"
import { getAuth } from "@clerk/nextjs/server";
import { Character, Stat } from "@/db/schema/schema"
import { NextResponse } from "next/server"
import { and, eq, exists } from 'drizzle-orm/expressions'

export async function POST(req: Request) {
  const shorthands = {
    Strength: "STR",
    Dexterity: "DEX",
    Constitution: "CON",
    Intelligence: "INT",
    Wisdom: "WIS",
    Charisma: "CHA",
  }
  const body = await req.json()
  const { user, name, value, savingvalue, modifier } = body
  const getShorthand = (name: string) => {
    for (const [key, value] of Object.entries(shorthands)) {
      if (name == key) return value
    }
  }

  const shorthand = getShorthand(name)
  const character = await db.select().from(Character).where(eq(Character.playerid, user.user.id))
  const characterid = character[0].id


  const values = {
    name: name,
    value: value,
    savingvalue: savingvalue,
    modifier: modifier,
    shorthand: shorthand,
    characterid: characterid
  }

  if (!name) return
  const existing = await db.select().from(Stat).where(and(eq(Stat.characterid, characterid), eq(Stat.name, name)))
  if (existing.length = 0) {
    await db.update(Stat)
      .set(values)
      .where(and(eq(Stat.characterid, characterid), eq(Stat.name, name)))
  } else {
    await db.insert(Stat).values(values)
  }

  return NextResponse.json({ status: 200, message: "Character created" })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userID = searchParams.get("userID")

  if (!userID) return
  const character = await db.select().from(Character).where(eq(Character.playerid, userID))
  const stats = await db.select().from(Stat).where(eq(Stat.characterid, character[0].id))

  return NextResponse.json({ stats: stats })
}
