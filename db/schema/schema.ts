import { InferModel } from 'drizzle-orm'
import { integer, pgTable, serial, varchar, text, boolean, interval } from 'drizzle-orm/pg-core'

export const Spelllist = pgTable("listingsofspells", {
  id: serial("id").primaryKey().notNull(),
  index: text("index"),
  name: text("name"),
  url: text("url"),
})

export const Character = pgTable("character", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name"),
  lvl: integer("lvl"),
  race: text("race"),
  alignment: text("alignment"),
  background: text("background"),


  class: text("class", { enum: ["Artificer", "Barbarian", "Bard", "Blood Hunter", "Cleric", "Druid", "Fighter", "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard"] }),

  hp: integer("hp"),
  maxhp: integer("maxhp"),
  ac: integer("ac"),
  init: integer("init"),

  playerid: text("playerid"),

  abillitie: integer("abillitie").references(() => Abillitie.id),
  language: integer("language").references(() => Language.id),

  party: integer("party"),
})

export const Attack = pgTable("attack", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name"),
  atk: varchar("atk"),
  range: integer("range"),
  type: varchar("type"),
  characterid: integer("characterid").references(() => Character.id)
})

export const Equipment = pgTable("equipment", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name"),
  amount: integer("amount"),
  characterid: integer("characterid").references(() => Character.id)
})

export const Coins = pgTable("coins", {
  id: serial("id").primaryKey().notNull(),
  pp: integer("pp"),
  gp: integer("gp"),
  ep: integer("ep"),
  sp: integer("sp"),
  cp: integer("cp"),
  characterid: integer("characterid").references(() => Character.id)
})

export const Abillitie = pgTable("abillitie", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name"),
})

export const Language = pgTable("language", {
  id: serial("id").primaryKey().notNull(),
  name: varchar("name"),
})

export const Stat = pgTable("stat", {
  id: serial("id").primaryKey().notNull(),
  name: text("name", { enum: ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"] }),
  value: integer("value"),
  savingvalue: integer("savingvalue"),
  modifier: integer("modifier"),
  shorthand: text("shorthand"),
  characterid: integer("characterid").references(() => Character.id)
})

export const DetStat = pgTable("detstat", {
  id: serial("id").primaryKey().notNull(),
  name: text("name", {
    enum: [
      "Acrobatics",
      "Animal Handling",
      "Arcana",
      "Athletics",
      "Deception",
      "History",
      "Insight",
      "Intimidation",
      "Investigation",
      "Medicine",
      "Nature",
      "Perception",
      "Performance",
      "Persuasion",
      "Religion",
      "Sleight of Hand",
      "Stealth",
      "Survival",
    ]
  }),
  value: integer("value"),
  proficiency: boolean("proficiency"),
  characterid: integer("characterid").references(() => Character.id)
})

export const Spellbook = pgTable("spellbook", {
  id: serial("id").primaryKey().notNull(),
  tier: integer("tier"),
  slots: integer("slots"),
  characterid: integer("characterid").references(() => Character.id),
  spells: integer("spells").array()
})

export const Spell = pgTable("spell", {
  id: serial("id").primaryKey().notNull(),
  name: text("name").notNull(),
  // school: text("school"),
  casting_time: text("casting_time").notNull(),
  range: text("range").notNull(),
  duration: text("duration").notNull(),
  components: text("components").array().notNull(),
  desc: text("desc"),
  higherdesc: text("higherdesc"),
  level: integer("level").notNull(),
  classes: text("classes").array()
})

export const Class = pgTable("class", {
  id: serial("id").primaryKey().notNull(),
  index: text("index"),
  name: text("name"),
  url: text("url"),
})


export type Character = InferModel<typeof Character>
export type NewCharacter = InferModel<typeof Character, "insert">
export type Attack = InferModel<typeof Attack>
export type NewAttack = InferModel<typeof Attack, "insert">
export type Abillitie = InferModel<typeof Abillitie>
export type NewAbillitie = InferModel<typeof Abillitie, "insert">
export type Coins = InferModel<typeof Coins>
export type NewCoins = InferModel<typeof Coins, "insert">
export type DetStat = InferModel<typeof DetStat>
export type NewDetStat = InferModel<typeof DetStat, "insert">
export type Equipment = InferModel<typeof Equipment>
export type NewEquipment = InferModel<typeof Equipment, "insert">
export type Language = InferModel<typeof Language>
export type NewLanguage = InferModel<typeof Language, "insert">
export type Spell = InferModel<typeof Spell>
export type NewSpell = InferModel<typeof Spell, "insert">
export type Spellbook = InferModel<typeof Spellbook>
export type NewSpellbook = InferModel<typeof Spellbook, "insert">
export type Stat = InferModel<typeof Stat>
export type NewStat = InferModel<typeof Stat, "insert">
