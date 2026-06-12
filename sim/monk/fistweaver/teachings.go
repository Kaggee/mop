package fistweaver

import (
	"github.com/wowsims/mop/sim/core"
	"github.com/wowsims/mop/sim/monk"
)

// Teachings of the Monastery (Mistweaver-line passive). For Fistweaver we
// model the two damage-relevant pieces:
//
//  1. Tiger Palm +100% damage (3.0 base -> 6.0 effective). Permanent SpellMod
//     activated once at sim start.
//  2. Blackout Kick gains a 4-target cleave under Wise Serpent stance.
//     Implemented in sim/monk/blackout_kick.go, gated on monk.HasTeachings.
//
// Serpent's Zeal (auto-attack -> heal) is not modeled -- damage only.
// Fistweaver-only; MW doesn't currently exercise these damage paths.
func (fw *FistweaverMonk) registerTeachingsOfTheMonastery() {
	fw.HasTeachings = true

	tigerPalmDamageMod := fw.AddDynamicMod(core.SpellModConfig{
		Kind:       core.SpellMod_DamageDone_Pct,
		ClassMask:  monk.MonkSpellTigerPalm,
		FloatValue: 1.0,
	})
	fw.RegisterAura(core.Aura{
		Label:    "Teachings of the Monastery" + fw.Label,
		ActionID: core.ActionID{SpellID: 116645},
		Duration: core.NeverExpires,
		OnReset: func(aura *core.Aura, sim *core.Simulation) {
			aura.Activate(sim)
			tigerPalmDamageMod.Activate()
		},
	})
}
