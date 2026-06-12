package fistweaver

import (
	"time"

	"github.com/wowsims/mop/sim/core"
	"github.com/wowsims/mop/sim/monk"
)

// Muscle Memory is a Mistweaver-line passive: each Jab restores 4% of the
// monk's maximum mana and grants a buff that increases the damage of your
// next Tiger Palm or Blackout Kick by 150%.
//
// Implementation notes:
//
//   - We trigger on CallbackOnCastComplete (not OnSpellHitDealt) so that the
//     ordering is: spell hits target -> aura's consume runs -> proc trigger
//     re-grants for the next cast. CallbackOnSpellHitDealt would be fine for
//     this configuration since the trigger spell (Jab) is disjoint from the
//     consume spells (Tiger Palm, Blackout Kick), but CastComplete is
//     marginally tidier and matches the user-visible cast event.
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
			fw.AddMana(sim, fw.MaxMana()*manaRestoreFraction, manaMetrics)
			muscleMemoryAura.Activate(sim)
		},
	})
}
