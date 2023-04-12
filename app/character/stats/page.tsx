'use client'
import { skills } from '@/app/enums'
import { DetStat, Stat } from '@/db/schema/schema'
import { useUser } from '@clerk/nextjs'
import { Button, Table, NumberInput, Select, Switch, Modal, Group, Center } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconCheck, IconX } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

interface StatLike {
  name: string,
  value: number,
  savingvalue: number,
  modifier: number,
  shorthand: string
}

interface DetStatLike {
  name: string,
  value: number,
  proficiency: boolean,
}

export default function Page() {
  const user = useUser()
  const [modal, setModal] = useState(false)
  const [stats, setStats] = useState<Stat[] | null>(null)
  const [detstats, setDetstats] = useState<DetStat[] | null>(null)
  const [detmodal, setDet] = useState<boolean>(false)

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

  async function createUser(values: StatLike) {
    await fetch("/api/character/stats", {
      method: "POST",
      body: JSON.stringify({ user, ...values })
    }).then((res) => {
      getData()
      if (res.status == 200) form.reset()
    })
  }

  async function createDet(values: DetStatLike) {
    await fetch("/api/character/detstats", {
      method: "POST",
      body: JSON.stringify({ user, ...values })
    }).then((res) => {
      getData()
      if (res.status == 200) form.reset()
    })
  }

  async function getStats() {
    if (!user.isSignedIn) return
    // TO-DO Set correct type for API
    const stats = await fetch(`/api/character/stats?userid=${user.user.id}`, { method: "GET", cache: "no-store" }).then(async (res: any) => res)
    const stat = await stats.json()
    if (stat === 500) return
    setStats(stat.stats)
  }

  async function getDetstats() {
    if (!user.isSignedIn) return
    // TO-DO Set correct type for API
    const detstats = await fetch(`/api/character/detstats?userid=${user.user.id}`, { method: "GET", cache: "no-store" }).then(async (res: any) => res)
    const detstat = await detstats.json()
    if (detstat === 500) return
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
                  <tr key={`state${k}`}>
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
                  <tr key={`detstat${k}`}>
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
