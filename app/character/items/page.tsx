'use client'
import { Equipment } from "@/db/schema/schema"
import { useUser } from "@clerk/nextjs"
import { ActionIcon, Button, Center, Group, Modal, NumberInput, Table, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { IconX } from "@tabler/icons-react"
import { useEffect, useState } from "react"

export default function Page() {
  const { user, isSignedIn, isLoaded } = useUser()
  const [items, setItems] = useState<Equipment[] | null>(null)
  const [modal, setModal] = useState(false)
  const form = useForm({
    initialValues: {
      name: "Item",
      amount: 1
    }
  })

  async function getEquipment() {
    if (!isSignedIn) return
    const items = await fetch(`/api/items?userId=${user.id}`, { method: "GET", cache: "no-store" }).then(async (res: any) => res)
    const equipment = await items.json()
    setItems(equipment)
    setModal(false)
  }

  async function addItem(name: string, amount: number, userId: string) {
    await fetch("/api/items", { method: "POST", body: JSON.stringify({ name, amount, userId }) })
    getEquipment()
  }

  async function deleteItem(name: string, userId: string) {
    await fetch(`/api/items`, { method: "DELETE", body: JSON.stringify({ name, userId }) })
    getEquipment()
  }

  async function setAmount(id: number, amount: number, userId: string) {
    await fetch("/api/items", { method: "PATCH", body: JSON.stringify({ id, amount, userId }) })
    getEquipment()
  }

  useEffect(() => {
    getEquipment()
  })

  return (
    <>
      <Center>
        <Group>
          <Button onClick={() => setModal(true)}>Add item</Button>
          <Button onClick={() => getEquipment()}>Refresh</Button>
        </Group>
      </Center>
      {
        isSignedIn &&
        <Modal opened={modal} onClose={() => setModal(false)}>
          <form onSubmit={form.onSubmit((values) => addItem(values.name, values.amount, user.id))}>
            <TextInput label="Name" {...form.getInputProps("name")} />
            <NumberInput
              label="Amount"
              {...form.getInputProps("amount")}
            />
            <Button type="submit">Add</Button>
          </form>
        </Modal>
      }

      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {
            (items && isSignedIn) && items.map((v: Equipment, k: number) => {
              {
                if (v.amount && v.amount > 0) return (
                  <tr key={k}>
                    <td>{v.name}</td>
                    <td>
                      <Group>
                        <NumberInput
                          label="Amount"
                          defaultValue={v.amount}
                          onChange={(value: number) => setAmount(v.id, value, user.id)}
                        />
                        <ActionIcon onClick={() => deleteItem(v.name ? v.name : "", user.id)}><IconX /></ActionIcon>
                      </Group>
                    </td>
                  </tr>
                )
              }
            })
          }
        </tbody>
      </Table>
    </>
  )
}
