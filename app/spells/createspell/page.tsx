'use client'
import { Spell } from "@/db/schema/schema"
import { Button, MultiSelect, NumberInput, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { classes } from "../../enums"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

export default function Page() {
  const { user } = useUser()
  const role = user?.unsafeMetadata.role as number
  const router = useRouter()

  const form = useForm({
    initialValues: {
      name: "",
      desc: "",
      higherdesc: "",
      casting_time: "",
      duration: "",
      range: "",
      components: [""],
      classes: [""],
      level: 0
    }
  })

  async function createSpell(values: Spell) {
    if (role < 8) return
    await fetch("/api/spells", { method: "POST", body: JSON.stringify({ ...values }) })
    router.push("/spells")
  }

  return (
    <form onSubmit={form.onSubmit((values) => createSpell(values as Spell))}>
      <TextInput label="Name" {...form.getInputProps("name")} />
      <TextInput label="Description" {...form.getInputProps("desc")} />
      <TextInput label="Higher Desc" {...form.getInputProps("higherdesc")} />
      <TextInput label="Casting time" {...form.getInputProps("casting_time")} />
      <TextInput label="Duration" {...form.getInputProps("duration")} />
      <TextInput label="Range" {...form.getInputProps("range")} />
      <MultiSelect
        label="Components"
        data={[
          { value: "V", label: "V" },
          { value: "S", label: "S" },
          { value: "M", label: "M" }
        ]}
        {...form.getInputProps("components")}
      />

      <MultiSelect
        label="Classes"
        data={classes}
        {...form.getInputProps("classes")}
      />

      <NumberInput label="Level" {...form.getInputProps("level")} />
      <Button type="submit">Create</Button>
    </form>
  )
}
