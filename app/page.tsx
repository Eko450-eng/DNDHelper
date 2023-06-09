'use client'
import { Character } from "@/db/schema/schema"
import { ChangeHealth, ShowCharacterInfo, ShowHealth, ShowParty } from "./CharacterComponents/components"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Button, Center } from "@mantine/core"
import { useRouter } from "next/navigation"


export default function Home() {
  const user = useUser()
  const router = useRouter()
  const [character, setCharacter] = useState<Character | null>(null)
  const [pleaseCreate, setPleaseCreate] = useState(true)

  async function getUser() {
    if (!user.isSignedIn) return
    const character = await fetch(`/api/character?userid=${user.user.id}`, { method: "GET", cache: "no-store" })
    const char = await character.json()
    if (char === 500) {
      setPleaseCreate(true)
      return
    }
    setPleaseCreate(false)
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

  function updateValues() {
    getUser()
    router.refresh()
  }

  useEffect(() => {
    getUser()
    setRole()
  }, [user.isLoaded])

  return (
    <main>
      <>
        <Center>
          <Button onClick={() => getUser()}>Reload</Button>
        </Center>
        {pleaseCreate && <p>Please create a character</p>}

        {character &&
          <>
            <ShowCharacterInfo character={character} />
            <ShowHealth character={character} />
            <ChangeHealth props={{ character: character, getuser: () => updateValues() }} />
            <ShowParty character={character} />
          </>
        }
      </>
    </main >
  )
}
