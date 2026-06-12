package fistweaver

import (
	"time"

	"github.com/wowsims/mop/sim/core"
	"github.com/wowsims/mop/sim/monk"
)

// Muscle Memory is a Mistweaver-line passive: each Jab grants a 20-second
// buff that increases the damage of your next Tiger Palm or Blackout Kick by
// 150% and restores 4% of your maximum mana when that buff is consumed.
//
// Implementation notes:
//
//   - The trigger spell (Jab) is disjoint from the consume spells (Tiger Palm,
//     Blackout Kick), so trigger and consume can't fire on the same cast and
//     there's no Activate/Deactivate ordering hazard. We use
//     CallbackOnCastComplete on the trigger for the cleaner semantic match
//     with the user-visible cast event.
//
//   - Mana restoration is tied to the consume, not the grant. If the buff
//     times out without being used (20s without a Tiger Palm or BoK), no
//     mana is returned -- matching the MoP tooltip wording where the 4%
//     mana is part of the buff's effect on its consumer.
//
//   - The buff is consumed on the first Tiger Palm or Blackout Kick hit that
//     lands. With the Teachings-of-the-Monastery cleave (handled in
//     sim/monk/blackout_kick.go), only the primary BoK hit reliably benefits
//     from the +150% mod; subsequent cleave hits land after the consume.
//     Acceptable for now -- real-world Muscle-Memory-vs-cleave timing in MoP
//     isn't critical for sim fidelity, and Phase 5 can revisit.
//
//   - Currently Fistweaver-only. Mistweaver doesn't exercise these damage
//     paths in the sim today.
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
