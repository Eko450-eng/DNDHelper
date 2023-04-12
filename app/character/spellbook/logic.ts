import { User } from "@clerk/nextjs/dist/api"
import { UserResource } from "@clerk/types"

export async function getCertainSpell(ids: number[]) {
  if (ids.length == 0) return
  const spells = await fetch(`/api/spells/getown`, {
    method: "POST", body: JSON.stringify({
      spellIds: ids,
    })
  })
  const res = await spells.json()
  return res
}

export async function removeSpell(id: number, tier: number, user: UserResource | null | undefined) {
  if (!user) return
  const body = {
    spellId: id,
    tier: tier,
    user: user
  }

  const res = await fetch(`/api/spells`, { method: "DELETE", body: JSON.stringify(body) })
  return res.json()
}
