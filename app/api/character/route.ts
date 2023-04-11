import db from "@/db/db"
import { Character } from "@/db/schema/schema"
import { NextResponse } from "next/server"
import { eq } from 'drizzle-orm/expressions'

// Create Character
export async function POST(req: Request) {
  const body = await req.json()
  const { user, name, classes, lvl, race, alignment, background, hp, ac, init } = body

  const values = {
    name: name,
    class: classes,
    lvl: lvl,
    race: race,
    alignment: alignment,
    background: background,
    hp: hp,
    maxhp: hp,
    ac: ac,
    init: init,
    playerid: user.user.id,
  }

  await db.insert(Character).values(values)
  return NextResponse.json({ status: 200, message: "Character created" })
}

// Get Character
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userID = searchParams.get("userid")

  if (!userID) return
  console.log(userID)
  try {
    const character = await db.select().from(Character).where(eq(Character.playerid, userID))
    return NextResponse.json(character[0])
  } catch (e) {
    console.log(e)
    return NextResponse.json(500)
  }
}

//Update character
export async function PATCH(req: Request) {
  const body = await req.json()
  const { user, hp, ac, party } = body

  await db.update(Character)
    .set({
      hp: hp,
      ac: ac,
      party: party,
    })
    .where(eq(Character.playerid, user.user.id))

  return NextResponse.json({ status: 200, message: "Character updated" })
}
