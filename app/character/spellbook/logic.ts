
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

export async function removeSpell(id: number, tier: number, user: any) {
  const body = {
    spellId: id,
    tier: tier,
    user: user
  }

  const res = await fetch(`/api/spells/removeown?spellID=${id}`, { method: "POST", body: JSON.stringify(body) })
  return res.json()
}
