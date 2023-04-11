import db from "@/db/db"
import { Character, Equipment } from "@/db/schema/schema"
import { NextResponse } from "next/server"
import { and, eq } from "drizzle-orm/expressions"

// Create Items
export async function POST(req: Request) {
  const body = await req.json()
  const { name, amount, userId } = body

  const userColl = await db.select().from(Character).where(eq(Character.playerid, userId))
  const user = userColl[0]

  await db.insert(Equipment).values({
    name: name,
    amount: amount,
    characterid: user.id,
  })

  return NextResponse.json({ status: 200, message: "Item created" })
}

// Get Items
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")

  if (!userId) return
  const userColl = await db.select().from(Character).where(eq(Character.playerid, userId))
  const user = userColl[0]

  const items = await db.select().from(Equipment)
    .where(eq(Equipment.characterid, user.id))
  return NextResponse.json(items)
}

// Update Items
export async function PATCH(req: Request) {
  const body = await req.json()
  const { id, amount, userId } = body

  const userColl = await db.select().from(Character).where(eq(Character.playerid, userId))
  const user = userColl[0]

  await db.update(Equipment)
    .set({
      amount: amount
    })
    .where(and(eq(Equipment.id, id), eq(Equipment.characterid, user.id)))
  return NextResponse.json({ status: 200, message: "Item Updated" })
}

//Delete items
export async function DELETE(req: Request) {
  const body = await req.json()
  const { name, userId } = body

  if (!name || !userId) return

  const userColl = await db.select().from(Character).where(eq(Character.playerid, userId))
  const user = userColl[0]

  await db.delete(Equipment).where(and(eq(Equipment.name, name), eq(Equipment.characterid, user.id)))

  return NextResponse.json({ status: 200, message: "Item Deleted" })
}

