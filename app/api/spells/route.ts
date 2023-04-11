import db from "@/db/db"
import { Spell } from "@/db/schema/schema"
import { NextResponse } from "next/server"
import { sql } from "drizzle-orm"
import { asc } from "drizzle-orm/expressions"

// interface IAPILIST {
//   name: string
//   index: string
//   url: string
// }

// interface IAPICLASSES {
//   index: string
//   name: string
//   url: string
// }

// interface IAPIITEM {
//   name: string
//   index: string
//   desc: string[]
//   range: string
//   components: string[]
//   duration: string
//   casting_time: string
//   level: number,
//   classes: IAPICLASSES[]
// }

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
  //DO NOT USE
  // const list = await db.select().from(Spelllist)

  // list.forEach(async (item: any) => {
  //   if (!item.url) return
  //   const i = await fetch(`https://www.dnd5eapi.co${item.url}`)
  //   const it: IAPIITEM = await i.json()

  //   const getClasses = () => {
  //     let classes: string[] = []
  //     it.classes.forEach(cl => {
  //       classes.push(cl.name)
  //     })
  //     return classes
  //   }

  //   await db.insert(Spell).values({
  //     name: it.name,
  //     casting_time: it.casting_time,
  //     components: it.components ? it.components : [],
  //     duration: it.duration,
  //     level: it.level,
  //     range: it.range,
  //     classes: getClasses(),
  //     desc: it.desc[0],
  //     higherdesc: it.desc[1] ? it.desc[1] : "",
  //   })
  // })

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
