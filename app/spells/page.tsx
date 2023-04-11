'use client'
import { Spell } from "@/db/schema/schema"
import { useEffect, useState } from "react"
import AddSpellToBook from "./AddSpellToBook"
import { Group, Text, Stack, Modal, Button, Center, Select, NumberInput, TextInput } from "@mantine/core"
import { useUser } from "@clerk/nextjs"
import { classes } from "../enums"
import Link from "next/link"

async function getSpells(level: number, classes: string) {
  const res = await fetch(`/api/spells?level=${level}&classes=${classes}`, { method: "GET", cache: "no-store" })
    .then(async (res) => {
      const result = await res.json()
      return result
    })
  return res.spells
}

export default function Page() {
  const user = useUser()
  const role = user.user?.unsafeMetadata.role as number
  const [modalInfo, setModalInfo] = useState<Spell | null>(null)
  const [spells, setSpells] = useState<Spell[] | null>()
  const [searchParam, setSearchParam] = useState("")
  const [config, setConfig] = useState({
    tier: -1,
    class: ""
  })

  async function getSpell() {
    if (user.isLoaded && user.isSignedIn) {
      const char = await fetch(`/api/character?userid=${user.user.id}`, { method: "GET", cache: "no-store" }).then(async (res) => res)
      const character = await char.json()
      setConfig({ ...config, class: character.class })
    }
    setSpells(await getSpells(config.tier, config.class))
  }

  function openModal(v: Spell) {
    setModalInfo(v)
  }

  async function getRole() {
    const role = user.user?.publicMetadata?.role
    return role
  }

  useEffect(() => {
    if (!user.isSignedIn) return
    getRole()
  })

  return (
    <div>
      <Center>
        <Group>
          <Select searchable value={config.class} data={classes} label="Class" onChange={(value) => setConfig({ ...config, class: value ? value : "" })} />
          <NumberInput onChange={(value) => setConfig({ ...config, tier: value ? value : 0 })} defaultValue={config.tier} label="Tier" />
          <TextInput label="Search" onChange={(v) => setSearchParam(v.currentTarget.value.toLowerCase())} />
          <Button onClick={getSpell}>Search</Button>
        </Group>
      </Center>
      <Modal
        size="100%"
        opened={modalInfo != null}
        onClose={() => setModalInfo(null)}
      >
        {modalInfo &&
          <Stack>
            <Text>{modalInfo.name}</Text>
            <Text>{modalInfo.desc}</Text>
            <Text>At higher levels: {modalInfo.higherdesc}</Text>
            <Text>Tier: {modalInfo.level}</Text>
            <Text>Range: {modalInfo.range}</Text>
            <Text>Classes: {modalInfo.classes}</Text>
            <Text>Duration: {modalInfo.duration}</Text>
            <Text>Components: {modalInfo.components}</Text>
            <Text>Casting Time: {modalInfo.casting_time}</Text>
          </Stack>
        }
      </Modal>

      {(user.isSignedIn && role >= 8) &&
        <Link href="/spells/createspell">Create Spell</Link>
      }

      {
        spells ? spells.map((v: Spell, k: number) => {
          {
            if (v.name.toLowerCase().includes(searchParam)) {
              return (
                <Group key={`${k}-spellOf-${v.id}`} sx={{ padding: "1rem", margin: "1rem 0", border: "1px solid white", borderRadius: "25px" }}>
                  <AddSpellToBook book={v.level} spell={v} />
                  <Stack
                    onClick={() => openModal(v)}
                    sx={{ gap: "0" }}>
                    <Text>{v.name}</Text>
                    <Text>Tier: {v.level.toString()}</Text>
                  </Stack>
                </Group>
              )
            }
            else {
              return
            }
          }
        })
          :
          <Center>
            <Text>Loading...</Text>
          </Center>
      }
    </div >
  )
}
