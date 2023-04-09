import { Spell } from "@/db/schema/schema";
import { useUser } from "@clerk/nextjs";
import { ActionIcon, Modal, Table, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { getCertainSpell, removeSpell } from "./logic";

export default function SpellsView({ spellsId }: { spellsId: number[] }) {
  const [desc, setDesc] = useState<string[] | null>(null)
  const [spells, setSpells] = useState<Spell[] | null>(null)
  const { user } = useUser()

  async function getData() {
    const func = getCertainSpell(spellsId)
    const spell = await func
    console.log(spell)
    setSpells(spell.spells)
  }

  useEffect(() => {
    getData()
  }, [spellsId])

  return (
    <>
      <Modal opened={desc != null} onClose={() => setDesc(null)}>
        <Text>
          {desc}
        </Text>
      </Modal>
      <Table>
        <thead>
          <tr>
            <td>Spell</td>
            <td>Cating Time</td>
            <td>Duration</td>
            <td>Range</td>
            <td>Components</td>
            <td>Level</td>
            <td>Remove</td>
          </tr>
        </thead>
        <tbody>
          {
            spells && spells.map((v: Spell, k: number) => {
              return (
                <tr key={`spellsKey${k}`}>
                  <td onClick={() => setDesc(v.desc)}>{v.name}</td>
                  <td onClick={() => setDesc(v.desc)}>{v.casting_time}</td>
                  <td onClick={() => setDesc(v.desc)}>{v.duration}</td>
                  <td onClick={() => setDesc(v.desc)}>{v.range}</td>
                  <td onClick={() => setDesc(v.desc)}>{v.components}</td>
                  <td onClick={() => setDesc(v.desc)}>{v.level}</td>
                  <td onClick={() => removeSpell(v.id, v.level, user)}><IconTrash /></td>
                </tr>
              )
            })
          }
        </tbody>
      </Table >
    </>
  )
}
