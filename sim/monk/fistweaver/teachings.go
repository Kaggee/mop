package fistweaver

import (
	"github.com/wowsims/mop/sim/core"
	"github.com/wowsims/mop/sim/monk"
)

// Teachings of the Monastery is the Mistweaver-line passive that retunes a
// handful of monk strikes for use while in Stance of the Wise Serpent. For
// Fistweaver we model the two pieces that affect damage output:
//
//  1. Tiger Palm deals 100% additional damage. The shared spell config keeps
//     its 3.0 base DamageMultiplier; the SpellMod registered here doubles it
//     at runtime so we don't have to fork the spell.
//
//  2. Blackout Kick gains a 4-target cleave when the Monk is in Wise Serpent
//     stance. That branch is implemented inline in sim/monk/blackout_kick.go
//     and gated on monk.HasTeachings + monk.StanceMatches(WiseSerpent); we
//     just flip the flag here.
//
// Serpent's Zeal (the auto-attack -> heal piece of Teachings) is intentionally
// not modeled yet -- Fistweaver Phase 2 only covers damage. The healing side
// is parked alongside the broader healing follow-ups.
//
// Teachings is gated to Fistweaver only at this point; Mistweaver doesn't
// currently exercise damage paths in the sim and we don't want to change its
// observed behavior as a side effect.
func (fw *FistweaverMonk) registerTeachingsOfTheMonastery() {
	fw.HasTeachings = true

	// Tiger Palm: +100% damage. Registered as a permanent spell mod and
	// activated once at sim start; never deactivated.
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
