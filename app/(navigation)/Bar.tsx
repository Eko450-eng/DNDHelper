'use client'
import { ActionIcon, Affix, Center, Group, Stack } from "@mantine/core"
import { IconBackpack, IconBarrel, IconBook, IconChartBar, IconCirclePlus, IconHome, IconLogin, IconLogout, IconSword, IconUserPlus, IconWand, TablerIconsProps } from '@tabler/icons-react'
import { useAuth } from '@clerk/nextjs'
import Link from "next/link"
import { useState } from "react"

interface ILinkType {
  icon: (props: TablerIconsProps) => JSX.Element;
  label: string
  url: string
}

export default function Bar() {
  const user = useAuth()
  const [opened, setOpened] = useState(true)

  const links: ILinkType[] = [
    { icon: IconHome, label: "Home", url: "/" },
    // { icon: IconFriends, label: "Party", url: "/party" },
    { icon: IconCirclePlus, label: "Create character", url: "/character/create-character" },
    { icon: IconBackpack, label: "Items", url: "/character/items" },
    { icon: IconSword, label: "Attacks", url: "/character/attacks" },
    { icon: IconWand, label: "Spells", url: "/spells" },
    { icon: IconBook, label: "Spellbook", url: "/character/spellbook" },
    { icon: IconChartBar, label: "Stats", url: "/character/stats" },
  ]

  const LinkButton = ({ link }: { link: ILinkType }) => {
    return (
      <Stack sx={{ gap: "0" }}>
        <Center>
          <link.icon />
        </Center>
      </Stack>
    )
  }

  const linkIcons = links.map((link: ILinkType, k: number) => {
    return (
      <Link key={k} href={`${link.url}`}>
        <LinkButton link={link} />
      </Link>
    )
  })

  return (
    <Affix position={{ bottom: 0, right: 0 }} sx={{ width: opened ? "100%" : "max-content", background: "black", padding: "1rem", borderRadius: opened ? "none" : "25px 0 0 0" }}>
      <Center>
        <Group>
          {(opened && user.isLoaded && user.isSignedIn) &&
            <>
              {...linkIcons}

              <ActionIcon onClick={() => user.signOut()}>
                <Stack sx={{ gap: "0" }}>
                  <Center>
                    <IconLogout />
                  </Center>
                </Stack>
              </ActionIcon>
            </>
          }
          {(opened && user.isLoaded && !user.isSignedIn) &&
            <>
              <Link href="/Signin">
                <Stack sx={{ gap: "0" }}>
                  <Center>
                    <IconLogin />
                  </Center>
                </Stack>
              </Link>

              <Link href="/Signin">
                <Stack sx={{ gap: "0" }}>
                  <Center>
                    <IconUserPlus />
                  </Center>
                </Stack>
              </Link>
            </>
          }
          <ActionIcon onClick={() => setOpened(!opened)}>
            <IconBarrel />
          </ActionIcon>
        </Group>
      </Center>
    </Affix>
  )
}
