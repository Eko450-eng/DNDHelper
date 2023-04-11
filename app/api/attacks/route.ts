import db from "@/db/db"
import { Character, Attack } from "@/db/schema/schema"
import { and, eq } from "drizzle-orm/expressions"
import { NextResponse } from "next/server"

// Get Attacks
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  if (!userId) return
  const userColl = await db.select().from(Character).where(eq(Character.playerid, userId))
  const user = userColl[0]

  const attack = await db.select().from(Attack)
    .where(eq(Attack.characterid, user.id))
  return NextResponse.json(attack)
}

// Create Attack
export async function POST(req: Request) {
  const body = await req.json()
  const { name, atk, range, type, userId } = body

  const userColl = await db.select().from(Character)
    .where(eq(Character.playerid, userId))
  const user = userColl[0]

  await db.insert(Attack)
    .values({
      name: name,
      atk: atk,
      range: range,
      type: type,
      characterid: user.id,
    })
  return NextResponse.json({ status: 200, message: "Item created" })
}


//Delete Attack
export async function DELETE(req: Request) {
  const body = await req.json()
  const { name, userId } = body

  const userColl = await db.select().from(Character).where(eq(Character.playerid, userId))
  const user = userColl[0]

  await db.delete(Attack)
    .where(and(eq(Attack.name, name), eq(Attack.characterid, user.id)))

  return NextResponse.json({ status: 200, message: "Item created" })
}
