import db from "@/db/db"
import { Spell } from "@/db/schema/schema"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json() as Spell
  const { desc, casting_time, name, range, duration, components, level } = body
  try {
    await db.insert(Spell)
      .values({
        casting_time: casting_time,
        components: components,
        desc: desc,
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
