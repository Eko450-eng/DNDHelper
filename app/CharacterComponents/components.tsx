'use client'

import { Character } from "@/db/schema/schema"
import { useUser } from "@clerk/nextjs"
import { Button, Center, Group, NumberInput, Progress, Stack, Text } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function ShowCharacterInfo({ character }: { character: Character }) {
  return (
    <Group>
      <Stack spacing={0} >
        <Text sx={{ marginBottom: "0" }}><h2 style={{ marginBottom: "0" }}>{character.name}</h2></Text>
        <Text>{character.class}</Text>
      </Stack>
      <Stack spacing={0} >
        <Text>Init: {character.init}</Text>
        <Text>Level: {character.lvl}</Text>
      </Stack>
    </Group>
  )
}

export function ShowHealth({ character }: { character: Character }) {
  const maxAc = character.ac ? character.ac : 0
  const maxHp = character.maxhp ? character.maxhp : 0

  const currentHp = character.hp ? character.hp : 0
  const currentAc = character.ac ? character.ac : 0

  const valueHP = (currentHp / maxHp) * 50
  const valueAC = (currentAc / maxAc) * 50

  return (
    <Stack>
      <Progress
        size="xl"
        sections={[
          { value: valueHP, color: "red", label: `${character.hp}` },
          { value: valueAC, color: "blue", label: `${character.ac}` }
        ]}
      />
    </Stack>
  )
}


export function ChangeHealth({ props }: { props: { character: Character, getuser: () => void } }) {
  const { character, getuser } = props
  const user = useUser()

  const form = useForm({
    initialValues: {
      hp: character.hp ? character.hp : 0,
      ac: character.ac ? character.ac : 0,
      party: character.party ? character.party : 0,
    }
  })
  const router = useRouter()

  async function changeValues(values: { hp: number, ac: number, party: number }) {
    getuser()
    router.refresh()
    await fetch("/api/character", {
      method: "PATCH", body: JSON.stringify({
        hp: values.hp,
        ac: values.ac,
        party: values.party,
        user: user
      })
    })
  }

  return (
    <form onSubmit={form.onSubmit((values) => changeValues(values))}>
      <NumberInput label="HP"  {...form.getInputProps("hp")} />
      <NumberInput label="AC"  {...form.getInputProps("ac")} />
      <NumberInput label="Party" defaultValue={character.party ? character.party : 0} {...form.getInputProps("party")} />
      <Button type="submit">Save</Button>
    </form>
  )
}

export function ShowParty({ character }: { character: Character }) {
  const user = useUser()
  const [players, setPlayers] = useState<Character[] | null>(null)

  async function getParty() {
    if (!user.isSignedIn) return
    const result = await fetch(`/api/party?partyid=${character.party}&playerid=${character.playerid}`).then(async (res) => res)
    const res = await result.json()
    if (res === 500) return
    setPlayers(res)
  }

  useEffect(() => {
    getParty()
  }, [])

  useEffect(() => {
    console.log(players)
  }, [players])

  return (
    <>
      {
        players ? players.map((player: Character, k: number) => {
          return (
            <div key={`party${k}`}>
              <Button onClick={() => getParty()}>Refresh Party</Button>
              <ShowCharacterInfo character={player} />
              <ShowHealth character={player} />
            </div>
          )
        })
          :
          <Center>
            <Text>Please join a party for more information</Text>
            <Button onClick={() => getParty()}>Refresh</Button>
          </Center>
      }
    </>
  )
}
