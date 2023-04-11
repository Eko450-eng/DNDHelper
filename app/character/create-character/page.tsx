'use client'
import { classes } from '@/app/enums'
import { useUser } from '@clerk/nextjs'
import { Button, NumberInput, Select, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useRouter } from 'next/navigation'

export default function Page() {
  const user = useUser()
  const router = useRouter()
  const form = useForm({
    initialValues: {
      name: "",
      classes: "",
      lvl: 0,
      race: "",
      alignment: "",
      background: "",
      hp: 20,
      ac: 1,
      init: 3,
      playerid: "",
      attacks: 0,
      coins: 0,
      equipment: 0,
      abillitie: 0,
      language: 0,
      stat: 0,
      detstat: 0,
      spellbook: 0,
      party: 0
    }
  })

  async function createUser(values: any) {
    await fetch("/api/character", {
      method: "POST",
      body: JSON.stringify({ user, ...values })
    }).then((res) => {
      if (res.status == 200) router.push("/")
    })
  }

  return (
    <form onSubmit={form.onSubmit((values) => createUser(values))}>
      <TextInput
        label="name"
        {...form.getInputProps("name")}
      />

      <Select
        data={classes}
        searchable
        label="Class"
        {...form.getInputProps("classes")}
      />

      <NumberInput
        label="Level"
        {...form.getInputProps("lvl")}
      />

      <TextInput
        label="Race"
        {...form.getInputProps("race")}
      />

      <TextInput
        label="alignment"
        {...form.getInputProps("alignment")}
      />

      <TextInput
        label="background"
        {...form.getInputProps("background")}
      />

      <NumberInput
        label="hp"
        {...form.getInputProps("hp")}
      />

      <NumberInput
        label="ac"
        {...form.getInputProps("ac")}
      />

      <NumberInput
        label="init"
        {...form.getInputProps("init")}
      />

      <NumberInput
        label="Party"
        {...form.getInputProps("party")}
      />

      <Button type="submit">Create</Button>
    </form>
  )
}
