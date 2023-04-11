'use client'
import { Attack } from "@/db/schema/schema"
import { useUser } from "@clerk/nextjs"
import { ActionIcon, Button, Center, Group, Modal, NumberInput, Table, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { IconX } from "@tabler/icons-react"
import { useEffect, useState } from "react"

export default function Page() {
  const { user, isSignedIn, isLoaded } = useUser()
  const [attacks, setAttacks] = useState<Attack[] | null>(null)
  const [modal, setModal] = useState(false)
  const form = useForm({
    initialValues: {
      name: "Attack Name",
      atk: "Dice throw",
      range: 5,
      type: "Type",
    }
  })

  async function getAttacks() {
    if (!isSignedIn) return
    const attack = await fetch(`/api/attacks?userId=${user.id}`, { method: "GET", cache: "no-store" }).then(async (res: any) => res)
    if (attack === 500) return
    const attacks = await attack.json()
    setAttacks(attacks)
    setModal(false)
  }

  async function addAttack(values: { name: string, atk: string, range: number, type: string }, userId: string) {
    const { name, atk, range, type } = values
    await fetch("/api/attacks", { method: "POST", body: JSON.stringify({ name, atk, range, type, userId }) })
    getAttacks()
  }

  async function deleteItem(name: string, userId: string) {
    await fetch("/api/attacks", { method: "DELETE", body: JSON.stringify({ name, userId }) })
    getAttacks()
  }

  useEffect(() => {
    getAttacks()
  }, [])

  return (
    <>
      <Center>
        <Group>
          <Button onClick={() => setModal(true)}>Add Attack</Button>
          <Button onClick={() => getAttacks()}>Refresh</Button>
        </Group>
      </Center>

      {
        isSignedIn &&
        <Modal opened={modal} onClose={() => setModal(false)}>
          <form onSubmit={form.onSubmit((values) => addAttack(values, user.id))}>
            <TextInput label="Name" {...form.getInputProps("name")} />
            <TextInput label="Attack" {...form.getInputProps("atk")} />
            <NumberInput label="Range in feet" {...form.getInputProps("range")} />
            <TextInput label="Type" {...form.getInputProps("type")} />
            <Button type="submit">Add</Button>
          </form>
        </Modal>
      }

      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Attack</th>
            <th>Range</th>
            <th>Type</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {
            (attacks && isSignedIn) && attacks.map((v: Attack, k: number) => {
              return (
                <tr key={k}>
                  <td>{v.name}</td>
                  <td>{v.atk}</td>
                  <td>{v.range}</td>
                  <td>{v.type}</td>
                  <td>
                    <ActionIcon onClick={() => deleteItem(v.name ? v.name : "", user.id)}><IconX /></ActionIcon>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </Table>
    </>
  )
}
