'use client'
import { Character } from "@/db/schema/schema"
import { ShowCharacterInfo, ShowHealth } from "./CharacterComponents/components"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Button, Center } from "@mantine/core"


export default function Home() {
  const user = useUser()
  const [character, setCharacter] = useState<Character | null>(null)

  async function getUser() {
    if (!user.isSignedIn) return
    const character = await fetch(`/api/character?userid=${user.user.id}`, { method: "GET", cache: "no-store" })
    const char = await character.json()
    setCharacter(char)
  }

  async function setRole() {
    if (!user.user) return
    const email = user.user.primaryEmailAddress?.emailAddress
    if (email === "ekrem@wipdesign.de"
      || email === "ekrema@outlook.de") {
      await user.user?.update({
        unsafeMetadata: {
          role: 9
        }
      })
    } else {
      await user.user?.update({
        unsafeMetadata: {
          role: 1
        }
      })
    }
  }

  useEffect(() => {
    getUser()
    setRole()
  })

  return (
    <main>
      <>
        <Center>
          <Button onClick={() => getUser()}>Reload</Button>
        </Center>

        {character &&
          <>
            <ShowCharacterInfo character={character} />
            <ShowHealth character={character} />
          </>
        }
      </>
    </main >
  )
}
