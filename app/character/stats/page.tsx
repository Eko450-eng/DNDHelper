'use client'
import { skills } from '@/app/enums'
import { DetStat, Stat } from '@/db/schema/schema'
import { useUser } from '@clerk/nextjs'
import { Button, Table, NumberInput, Select, Stack, Switch, TextInput, Modal, Group, Center } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconCheck, IconX } from '@tabler/icons-react'
import { stat } from 'fs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Page() {
  const user = useUser()
  const [modal, setModal] = useState(false)
  const [stats, setStats] = useState<Stat[] | null>(null)
  const [detstats, setDetstats] = useState<DetStat[] | null>(null)
  const [detmodal, setDet] = useState<boolean>(false)
  const router = useRouter()
  const form = useForm({
    initialValues: {
      name: "Strength",
      value: 0,
      savingvalue: 0,
      modifier: 0,
      shorthand: ""
    }
  })

  const detForm = useForm({
    initialValues: {
      name: "",
      value: 0,
      proficiency: false,
    }
  })

  async function createUser(values: any) {
    await fetch("/api/character/stats", {
      method: "POST",
      body: JSON.stringify({ user, ...values })
    }).then((res) => {
      if (res.status == 200) form.reset()
    })
  }

  async function createDet(values: any) {
    await fetch("/api/character/detstats", {
      method: "POST",
      body: JSON.stringify({ user, ...values })
    }).then((res) => {
      if (res.status == 200) form.reset()
    })
  }

  async function getStats() {
    if (!user.isSignedIn) return
    const stats = await fetch(`/api/character/stats?userID=${user.user.id}`, { method: "GET", cache: "no-store" }).then(async (res: any) => res)
    const stat = await stats.json()
    setStats(stat.stats)
  }

  async function getDetstats() {
    if (!user.isSignedIn) return
    const detstats = await fetch(`/api/character/detstats?userID=${user.user.id}`, { method: "GET", cache: "no-store" }).then(async (res: any) => res)
    const detstat = await detstats.json()
    setDetstats(detstat.stats)
  }

  function getData() {
    getStats()
    getDetstats()
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div>
      <Center>
        <Group>
          <Button onClick={() => setModal(true)}>Change Stats</Button>
          <Button onClick={getData}>Refresh</Button>
          <Button onClick={() => setDet(true)}>Change Skills</Button>
        </Group>
      </Center>
      <Modal
        opened={modal}
        onClose={() => setModal(false)}
      >
        <form onSubmit={form.onSubmit((values) => createUser(values))}>
          <Select
            data={[
              { label: "Strength", value: "Strength" },
              { label: "Dexterity", value: "Dexterity" },
              { label: "Constitution", value: "Constitution" },
              { label: "Intelligence", value: "Intelligence" },
              { label: "Wisdom", value: "Wisdom" },
              { label: "Charisma", value: "Charisma" },
            ]}
            searchable
            label="Name"
            {...form.getInputProps("name")}
          />

          <NumberInput
            label="Value"
            {...form.getInputProps("value")}
          />

          <NumberInput
            label="Saving value"
            {...form.getInputProps("savingvalue")}
          />

          <NumberInput
            label="modifier"
            {...form.getInputProps("modifier")}
          />

          <Button type="submit">Create</Button>
        </form>
      </Modal>

      <Modal
        opened={detmodal}
        onClose={() => setDet(false)}
      >
        <form onSubmit={detForm.onSubmit(values => createDet(values))}>

          <Select searchable label="Name"
            data={skills}
            {...detForm.getInputProps("name")}
          />
          <NumberInput
            label="Value"
            {...detForm.getInputProps("value")}
          />
          <Switch
            sx={{ margin: "1rem 0" }}
            label="Profficient"
            {...detForm.getInputProps("proficiency")}
          />
          <Button type="submit">Create</Button>
        </form>
      </Modal>

      {
        stats &&
        <Table>
          <thead>
            <tr>
              <th>Stat</th>
              <th>Value</th>
              <th>savingvalue</th>
              <th>modifier</th>
            </tr>
          </thead>
          <tbody>
            {
              stats.map((v: Stat, k: number) => {
                return (
                  <tr key={k}>
                    <td>{v.name}</td>
                    <td>{v.value}</td>
                    <td>{v.savingvalue}</td>
                    <td>{v.modifier}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      }

      {
        detstats &&
        <Table>
          <thead>
            <tr>
              <th>Skill</th>
              <th>Value</th>
              <th>Profficient</th>
            </tr>
          </thead>
          <tbody>
            {
              detstats.map((v: DetStat, k: number) => {
                return (
                  <tr key={k}>
                    <td>{v.name}</td>
                    <td>{v.value}</td>
                    <td>{v.proficiency ? <IconCheck color="green" /> : <IconX color="red" />}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      }
    </div >
  )
}
