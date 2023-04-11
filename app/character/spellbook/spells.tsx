import { Spell } from "@/db/schema/schema";
import { useUser } from "@clerk/nextjs";
import { Modal, Table, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { getCertainSpell, removeSpell } from "./logic";

export default function SpellsView({ spellsId }: { spellsId: number[] }) {
  const [desc, setDesc] = useState({
    desc: "",
    higherdesc: ""
  })
  const [spells, setSpells] = useState<Spell[] | null>(null)
  const { user } = useUser()

  async function getData() {
    const func = getCertainSpell(spellsId)
    const spell = await func
    if (!spell) return
    setSpells(spell.spells)
  }

  useEffect(() => {
    getData()
  })

  return (
    <>
      <Modal opened={desc.desc.length > 0} onClose={() => setDesc({ desc: "", higherdesc: "" })}>
        <Text>
          {desc.desc}
        </Text>
        <Text sx={{ marginTop: "1rem" }}>
          {desc.higherdesc.length > 0 && `At higher levels: ${desc.higherdesc}`}
        </Text>
      </Modal>
      <Table fontSize="xs">
        <thead>
          <tr>
            <td>Spell</td>
            <td>CT</td>
            <td>Duration</td>
            <td>Range</td>
            <td>Remove</td>
          </tr>
        </thead>
        <tbody>
          {
            spells && spells.map((v: Spell, k: number) => {
              return (
                <tr key={`spellsKey${k}`}>
                  <td className="btn" onClick={() => setDesc({ desc: v.desc ? v.desc : "", higherdesc: v.higherdesc ? v.higherdesc : "" })}>{v.name}</td>
                  <td className="btn" onClick={() => setDesc({ desc: v.desc ? v.desc : "", higherdesc: v.higherdesc ? v.higherdesc : "" })}>{v.casting_time}</td>
                  <td className="btn" onClick={() => setDesc({ desc: v.desc ? v.desc : "", higherdesc: v.higherdesc ? v.higherdesc : "" })}>{v.duration}</td>
                  <td className="btn" onClick={() => setDesc({ desc: v.desc ? v.desc : "", higherdesc: v.higherdesc ? v.higherdesc : "" })}>{v.range}</td>
                  <td className="btn" onClick={() => removeSpell(v.id, v.level, user)}><IconTrash /></td>
                </tr>
              )
            })
          }
        </tbody>
      </Table >
    </>
  )
}
