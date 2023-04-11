import db from "@/db/db"
import { Character } from "@/db/schema/schema"
import { and, eq, ne } from "drizzle-orm/expressions"
import { NextResponse } from "next/server"

// Get Character
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const partyid = searchParams.get("partyid")
  const playerid = searchParams.get("playerid")

  if (!partyid || !playerid) return

  try {
    const character = await db.select().from(Character).where(and(eq(Character.party, Number(partyid)), ne(Character.playerid, playerid)))
    return NextResponse.json(character)
  } catch (e) {
    return NextResponse.json(500)
  }
}
