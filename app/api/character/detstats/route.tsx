import db from "@/db/db"
import { Character, DetStat } from "@/db/schema/schema"
import { NextResponse } from "next/server"
import { and, eq } from 'drizzle-orm/expressions'

export async function POST(req: Request) {
  const body = await req.json()
  const { user, name, value, proficiency } = body

  const character = await db.select().from(Character).where(eq(Character.playerid, user.user.id))
  const characterid = character[0].id

  const values = {
    name: name,
    value: value,
    proficiency: proficiency,
    characterid: characterid
  }

  if (!name) return
  const existing = await db.select().from(DetStat).where(and(eq(DetStat.characterid, characterid), eq(DetStat.name, name)))
  if (existing.length > 0) {
    await db.update(DetStat)
      .set(values)
      .where(and(eq(DetStat.characterid, characterid), eq(DetStat.name, name)))
  } else {
    await db.insert(DetStat).values(values)
  }

  return NextResponse.json({ status: 200, message: "Character created" })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userID = searchParams.get("userid")

  if (!userID) return
  const character = await db.select().from(Character).where(eq(Character.playerid, userID))
  try {
    const stats = await db.select().from(DetStat).where(eq(DetStat.characterid, character[0].id))
    return NextResponse.json({ stats: stats })
  } catch (e) {
    return NextResponse.json(500)
  }
}
