'use client'

import { Spell } from "@/db/schema/schema"
import { useEffect, useState } from "react"
import AddSpellToBook from "./AddSpellToBook"
import { Group, Text, Stack, Modal, Table, Button, Center, Select, NumberInput } from "@mantine/core"
import { useUser } from "@clerk/nextjs"
import { classes } from "../enums"

async function getSpells(level: number, classes: string) {
  const res = await fetch(`/api/spells?level=${level}`, {
    method: "POST",
    body: JSON.stringify({
      level: level,
      classes: classes
    })
  })
    .then(async (res) => {
      const result = await res.json()
      return result
    })
  return res.spells
}

export default function Page() {
  const user = useUser()
  const [modalInfo, setModalInfo] = useState<Spell | null>(null)
  const [spells, setSpells] = useState<Spell[] | null>()
  const [config, setConfig] = useState({
    tier: 0,
    class: ""
  })

  async function getSpell() {
    if (user.isSignedIn) {
      const char = await fetch(`/api/character?userID=${user.user.id}`, { method: "GET", cache: "no-store" }).then(async (res) => res)
      const character = await char.json()
      const classes = character.character[0].class
      setConfig({ ...config, class: classes })
    }
    setSpells(await getSpells(config.tier, config.class))
  }

  function openModal(v: Spell) {
    setModalInfo(v)
  }

  useEffect(() => {
    getSpell()
  }, [])

  return (
    <div>
      <Center>
        <Group>
          <Select searchable value={config.class ? config.class : ""} data={classes} label="Class" onChange={(value) => setConfig({ ...config, class: value ? value : "" })} />
          <NumberInput onChange={(value) => setConfig({ ...config, tier: value ? value : 0 })} label="Tier" />
          <Button onClick={getSpell}>Refresh</Button>
        </Group>
      </Center>
      <Modal
        size="100%"
        opened={modalInfo != null}
        onClose={() => setModalInfo(null)}
      >
        {modalInfo &&
          <Stack>
            <Table>
              <thead>
                <tr>
                  <th>Tier</th>
                  <th>Range</th>
                  <th>Classes</th>
                  <th>Duration</th>
                  <th>Components</th>
                  <th>Casting time</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{modalInfo.name}</td>
                  <td>{modalInfo.level}</td>
                  <td>{modalInfo.range}</td>
                  <td>{modalInfo.classes}</td>
                  <td>{modalInfo.duration}</td>
                  <td>{modalInfo.components}</td>
                  <td>{modalInfo.casting_time}</td>
                </tr>
              </tbody>
            </Table>
            <Text>{modalInfo.desc}</Text>
          </Stack>
        }
      </Modal>
      {
        spells && spells.map((v: Spell, k: number) => {
          return (
            <div key={k}>
              <Group sx={{ padding: "1rem", margin: "1rem 0", border: "1px solid white", borderRadius: "25px" }}>
                <AddSpellToBook book={v.level} spell={v} />
                <Stack
                  onClick={() => openModal(v)}
                  sx={{ gap: "0" }}>
                  <Text>{v.name}</Text>
                  <Text>Tier: {v.level.toString()}</Text>
                </Stack>
              </Group>
            </div>
          )
        })
      }
    </div >
  )
}
