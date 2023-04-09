'use client'
import { Spell, Spellbook } from '@/db/schema/schema'
import { useUser } from '@clerk/nextjs'
import { ActionIcon, Button, Center, Group, Modal, NumberInput, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect, useState } from 'react'
import SpellsView from './spells'
import { IconPlus } from '@tabler/icons-react'
import Link from 'next/link'
export default function Page() {
  const [modal, setModal] = useState(false)
  const [spellbook, setSpellbook] = useState<Spellbook[] | null>(null)
  const user = useUser()
  const form = useForm({
    initialValues: {
      tier: 0,
      slots: 0,
    }
  })

  async function getSpellbooks() {
    if (!user.isSignedIn) return
    const res = await fetch(`/api/character/spellbook?userID=${user.user.id}`, { method: "GET", cache: "no-store" })
    const spell = await res.json()
    setSpellbook(spell)
  }

  async function changeSlots(values: { tier: number, slots: any }) {
    await fetch("/api/character/spellbook", {
      method: "POST",
      body: JSON.stringify({ user, ...values })
    }).then((res) => {
      if (res.status == 200) form.reset()
    })
  }

  useEffect(() => {
    getSpellbooks()
  }, [])

  return (
    <>
      <Center>
        <Group>
          <Button onClick={() => setModal(true)}>Add more</Button>
          <Button onClick={getSpellbooks}>Refresh</Button>
        </Group>
      </Center>
      <Modal opened={modal} onClose={() => setModal(false)}>
        <form onSubmit={form.onSubmit((values) => changeSlots(values))}>
          <NumberInput
            label="Tier"
            {...form.getInputProps("tier")}
          />
          <Button>Add</Button>
        </form>
      </Modal>
      <Text>Your spells</Text>
      {spellbook && spellbook.map((v: Spellbook, k: number) => {
        return (
          <Group sx={{ border: "1px solid white", borderRadius: "25px", padding: ".5rem", margin: ".5rem 0" }} key={`spellbookKey${k}`}>
            <Text>Tier: {v.tier}</Text>
            <NumberInput
              label="Slots"
              onChange={(value) => {
                if (!v.tier && v.tier != 0) return
                changeSlots({ tier: v.tier, slots: value })
              }}
            />
            <Link href={`/spells`}>
              <ActionIcon><IconPlus /></ActionIcon>
            </Link>
            {
              v.spells &&
              <SpellsView spellsId={v.spells} />
            }
          </Group>
        )
      })
      }
    </>
  )
}
