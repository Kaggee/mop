package fistweaver

import (
	"github.com/wowsims/mop/sim/core"
	"github.com/wowsims/mop/sim/core/proto"
	"github.com/wowsims/mop/sim/core/stats"
	"github.com/wowsims/mop/sim/monk"
)

func RegisterFistweaverMonk() {
	core.RegisterAgentFactory(
		proto.Player_FistweaverMonk{},
		proto.Spec_SpecFistweaverMonk,
		func(character *core.Character, options *proto.Player) core.Agent {
			return NewFistweaverMonk(character, options)
		},
		func(player *proto.Player, spec interface{}) {
			playerSpec, ok := spec.(*proto.Player_FistweaverMonk)
			if !ok {
				panic("Invalid spec value for Fistweaver Monk!")
			}
			player.Spec = playerSpec
		},
	)
}

func NewFistweaverMonk(character *core.Character, options *proto.Player) *FistweaverMonk {
	monkOptions := options.GetFistweaverMonk()

	fw := &FistweaverMonk{
		Monk: monk.NewMonk(character, monkOptions.Options.ClassOptions, options.TalentsString),
	}

	// Wise Serpent stance grants mana as the resource. The stance itself is
	// auto-applied at character build time (see sim/monk/stances.go).
	fw.EnableManaBar()

	// Per the Stance of the Wise Serpent passive: "your attack power is equal
	// to 200% of your spell power, and you no longer benefit from other sources
	// of attack power." That AP-from-SP override lives in the shared stance
	// implementation. We deliberately do NOT add Strength/Agility -> AP deps
	// here so that no other AP source can leak in. Fistweaver is permanently
	// locked into Wise Serpent, so the stance override always applies.

	return fw
}

type FistweaverMonk struct {
	*monk.Monk
}

func (fw *FistweaverMonk) GetMonk() *monk.Monk {
	return fw.Monk
}

func (fw *FistweaverMonk) Initialize() {
	fw.Monk.Initialize()

	fw.RegisterSpecializationEffects()
}

func (fw *FistweaverMonk) ApplyTalents() {
	fw.Monk.ApplyTalents()
	fw.ApplyArmorSpecializationEffect(stats.Intellect, proto.ArmorType_ArmorTypeLeather, 120224)
}

func (fw *FistweaverMonk) Reset(sim *core.Simulation) {
	// Force WiseSerpent stance at sim t=0. The aura's BuildPhase=Base
	// activation only fires during stat measurement and is then cleared,
	// leaving monk.Stance == StanceNone by sim time. Setting it here makes
	// the parent Monk.Reset's ChangeStance hit the WiseSerpent case.
	fw.Stance = monk.WiseSerpent
	fw.Monk.Reset(sim)
}

func (fw *FistweaverMonk) RegisterSpecializationEffects() {
	fw.RegisterMastery()
	fw.registerTeachingsOfTheMonastery()
	fw.registerMuscleMemory()
}

// RegisterMastery is a stub. Fistweaver isn't a real Blizzard spec and has no
// canonical mastery; Phase 5 will decide whether to give it one.
func (fw *FistweaverMonk) RegisterMastery() {
}
