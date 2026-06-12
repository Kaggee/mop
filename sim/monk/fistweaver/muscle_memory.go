package fistweaver

import (
	"time"

	"github.com/wowsims/mop/sim/core"
	"github.com/wowsims/mop/sim/monk"
)

// Muscle Memory (Mistweaver-line passive). Each Jab grants a 20s buff that
// adds +150% damage to the next Tiger Palm or Blackout Kick. The 4% max-mana
// restore is part of the buff's effect on consume -- if it times out unused,
// no mana is returned.
//
// Caveat: under Teachings, BoK has a 4-target cleave; only the primary BoK
// hit reliably benefits from the +150% mod since the cleave adds land after
// the consume. Phase 5 polish.
//
// Fistweaver-only; MW doesn't currently exercise these damage paths.
func (fw *FistweaverMonk) registerMuscleMemory() {
	manaMetrics := fw.NewManaMetrics(core.ActionID{SpellID: 139598})
	manaRestoreFraction := 0.04

	damageMod := fw.AddDynamicMod(core.SpellModConfig{
		Kind:       core.SpellMod_DamageDone_Pct,
		ClassMask:  monk.MonkSpellTigerPalm | monk.MonkSpellBlackoutKick,
		FloatValue: 1.5,
	})

	muscleMemoryAura := core.BlockPrepull(fw.RegisterAura(core.Aura{
		Label:    "Muscle Memory" + fw.Label,
		ActionID: core.ActionID{SpellID: 139598},
		Duration: time.Second * 20,

		OnSpellHitDealt: func(aura *core.Aura, sim *core.Simulation, spell *core.Spell, result *core.SpellResult) {
			if !spell.Matches(monk.MonkSpellTigerPalm|monk.MonkSpellBlackoutKick) || !result.Landed() {
				return
			}
			fw.AddMana(sim, fw.MaxMana()*manaRestoreFraction, manaMetrics)
			aura.Deactivate(sim)
		},
	}).ApplyOnGain(func(_ *core.Aura, sim *core.Simulation) {
		damageMod.Activate()
	}).ApplyOnExpire(func(_ *core.Aura, sim *core.Simulation) {
		damageMod.Deactivate()
	}))

	fw.MakeProcTriggerAura(core.ProcTrigger{
		Name:           "Muscle Memory Trigger" + fw.Label,
		Callback:       core.CallbackOnCastComplete,
		ClassSpellMask: monk.MonkSpellJab,

		Handler: func(sim *core.Simulation, spell *core.Spell, _ *core.SpellResult) {
			muscleMemoryAura.Activate(sim)
		},
	})
}
