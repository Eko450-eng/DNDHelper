'use client'

import { Character } from "@/db/schema/schema"
import { Group, Progress, Stack, Text } from "@mantine/core"

export function ShowCharacterInfo({ character }: { character: Character }) {
  return (
    <Group>
      <Text><h2>{character.name}</h2></Text>
      <Text>{character.class}</Text>
      <Text>{character.lvl}</Text>
    </Group>
  )
}

export function ShowHealth({ character }: { character: Character }) {

  return (
    <Stack>
      <Progress
        size="xl"
        sections={[
          { value: character.hp ? character.hp : 0, color: "red", label: `${character.hp}` },
          { value: character.ac ? character.ac : 0, color: "blue", label: `${character.ac}` }
        ]}
      />
    </Stack>
  )
}
