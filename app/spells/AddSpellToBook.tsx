'use client'

import { Spell } from "@/db/schema/schema"
import { useUser } from "@clerk/nextjs"
import { Button } from "@mantine/core"

export default function AddSpellToBook({ book, spell }: { book: number, spell: Spell }) {
  const user = useUser()

  async function addSpell() {
    const values = {
      user: user,
      tier: book,
      spells: spell.id
    }

    await fetch("/api/addToBook", {
      method: "POST",
      body: JSON.stringify(values)
    })
  }

  return (
    <Button onClick={addSpell}>Add</Button>
  )
}
