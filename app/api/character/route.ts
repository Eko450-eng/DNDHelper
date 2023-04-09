import db from "@/db/db"
import { Character } from "@/db/schema/schema"
import { NextResponse } from "next/server"
import { eq } from 'drizzle-orm/expressions'

export async function POST(req: Request) {
  const body = await req.json()
  const { user, name, classes, lvl, race, alignment, background, hp, ac, init, playerid, attacks, equipment, coins, abillitie, language, stat, detstat, spellbook } = body

  const values = {
    name: name,
    class: classes,
    lvl: lvl,
    race: race,
    alignment: alignment,
    background: background,
    hp: hp,
    ac: ac,
    init: init,
    playerid: user.user.id,
  }

  await db.insert(Character).values(values)
  return NextResponse.json({ status: 200, message: "Character created" })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userID = searchParams.get("userID")

  if (!userID) return
  const character = await db.select().from(Character).where(eq(Character.playerid, userID))

  return NextResponse.json({ character: character })

}
