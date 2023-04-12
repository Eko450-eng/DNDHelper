import db from "@/db/db"
import { Character, Spell, Spellbook } from "@/db/schema/schema"
import { NextResponse } from "next/server"
import { sql } from "drizzle-orm"
import { and, asc, eq } from "drizzle-orm/expressions"

// Get Spells
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const classes = searchParams.get("classes")
  const level = searchParams.get("level")

  async function spells() {
    if ((!level || !classes) && (Number(level) === -1 || level === "-1")) {
      const spells = await db.select().from(Spell).orderBy(asc(Spell.name))
      return spells
    } else {
      // const spells = await db.execute(sql`select * from spell where ${classes}= ANY(classes) AND level = ${level}`)
      const spells = await db.select().from(Spell).where(sql`${classes}= ANY(classes) AND level = ${level}`).orderBy(asc(Spell.name))
      return spells
    }
  }

  return NextResponse.json({ spells: await spells() })
}

// Create Spell
export async function POST(req: Request) {
  const body = await req.json() as Spell
  const { desc, higherdesc, casting_time, name, range, duration, components, level } = body

  try {
    await db.insert(Spell)
      .values({
        casting_time: casting_time,
        components: components,
        desc: desc,
        higherdesc: higherdesc,
        duration: duration,
        name: name,
        range: range,
        classes: body.classes,
        level: level
      })
    return NextResponse.json({ status: 200, message: "Spell created" })
  } catch (e: unknown) {
    return NextResponse.json({ status: 500, message: e })
  }
}


export async function DELETE(req: Request) {
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
