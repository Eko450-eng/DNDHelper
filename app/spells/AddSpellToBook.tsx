'use client'

import { Spell } from "@/db/schema/schema"
import { useUser } from "@clerk/nextjs"
import { Button } from "@mantine/core"
import { showNotification } from "@mantine/notifications"

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
    }).then(async (res) => {
      const response = res.json()
      if (await response !== 500) {
        showNotification({
          title: "Added",
          message: "Spell has been added"
        })
      } else {
        return
      }
    })
  }

  return (
    <Button onClick={addSpell}>Add</Button>
  )
}
