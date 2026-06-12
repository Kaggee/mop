import * as BuffDebuffInputs from '../../core/components/inputs/buffs_debuffs';
import * as OtherInputs from '../../core/components/inputs/other_inputs';
import { ReforgeOptimizer } from '../../core/components/suggest_reforges_action';
import * as Mechanics from '../../core/constants/mechanics.js';
import { IndividualSimUI, registerSpecConfig } from '../../core/individual_sim_ui';
import { Player } from '../../core/player';
import { PlayerClasses } from '../../core/player_classes';
import { APLRotation } from '../../core/proto/apl';
import { Debuffs, Faction, IndividualBuffs, PartyBuffs, PseudoStat, Race, RaidBuffs, Spec, Stat } from '../../core/proto/common';
import { Stats, UnitStat } from '../../core/proto_utils/stats';
import { defaultRaidBuffMajorDamageCooldowns } from '../../core/proto_utils/utils';
import * as Presets from './presets';

const SPEC_CONFIG = registerSpecConfig(Spec.SpecFistweaverMonk, {
	cssClass: 'fistweaver-monk-sim-ui',
	cssScheme: PlayerClasses.getCssClass(PlayerClasses.Monk),
	knownIssues: [
		'Fistweaver is a fan-made spec built on the Mistweaver / Wise Serpent base. Phase 1: stance-locked into Wise Serpent, all passives apply (Spirit -> Hit/Exp, +50% haste, AP = 200% SP, Eminence). Combat abilities still inherit shared Monk implementations and have not been retuned for the Wise Serpent context.',
	],

	// EP-relevant stats. Kept caster-leaning for Phase 1 because the Wise Serpent
	// passive ties our Attack Power to Spell Power. Phase 2 will retune from
	// real sim data once damage formulas are forked.
	epStats: [
		Stat.StatIntellect,
		Stat.StatSpirit,
		Stat.StatSpellPower,
		Stat.StatHitRating,
		Stat.StatCritRating,
		Stat.StatHasteRating,
		Stat.StatMasteryRating,
		Stat.StatExpertiseRating,
	],
	epReferenceStat: Stat.StatIntellect,
	displayStats: UnitStat.createDisplayStatArray(
		[
			Stat.StatHealth,
			Stat.StatMana,
			Stat.StatStamina,
			Stat.StatIntellect,
			Stat.StatSpirit,
			Stat.StatSpellPower,
			Stat.StatAttackPower, // Derived: 200% of SpellPower while in Wise Serpent stance.
			Stat.StatMasteryRating,
			Stat.StatExpertiseRating,
		],
		[
			PseudoStat.PseudoStatSpellHitPercent,
			PseudoStat.PseudoStatSpellCritPercent,
			PseudoStat.PseudoStatSpellHastePercent,
			PseudoStat.PseudoStatPhysicalHitPercent,
			PseudoStat.PseudoStatPhysicalCritPercent,
			PseudoStat.PseudoStatMeleeHastePercent,
		],
	),

	defaults: {
		gear: Presets.PREBIS_GEAR_PRESET.gear,
		epWeights: Presets.DEFAULT_EP_PRESET.epWeights,
		// Phase 1: melee hit + expertise hard caps mirroring Windwalker. Some
		// Fistweaver abilities may need spell hit instead; we'll revisit when
		// per-ability behavior is forked in Phase 2.
		statCaps: (() => {
			const expCap = new Stats().withStat(Stat.StatExpertiseRating, 7.5 * 4 * Mechanics.EXPERTISE_PER_QUARTER_PERCENT_REDUCTION);
			const hitCap = new Stats().withPseudoStat(PseudoStat.PseudoStatPhysicalHitPercent, 7.5);
			return expCap.add(hitCap);
		})(),
		other: Presets.OtherDefaults,
		consumables: Presets.DefaultConsumables,
		talents: Presets.DefaultTalents.data,
		specOptions: Presets.DefaultOptions,
		raidBuffs: RaidBuffs.create({
			...defaultRaidBuffMajorDamageCooldowns(),
			arcaneBrilliance: true,
			blessingOfKings: true,
			mindQuickening: true,
			leaderOfThePack: true,
			blessingOfMight: true,
			unholyAura: true,
			bloodlust: true,
		}),
		partyBuffs: PartyBuffs.create({}),
		individualBuffs: IndividualBuffs.create({}),
		debuffs: Debuffs.create({
			curseOfElements: true,
			physicalVulnerability: true,
			weakenedArmor: true,
		}),
	},

	playerIconInputs: [],
	// Force-include buff/debuff inputs the framework hides because they're
	// gated on epStats containing AttackPower (our caster-leaning epStats
	// excludes it). Fistweaver AAs and physical specials genuinely benefit.
	// AttackPowerBuff (Horn of Winter etc.) intentionally NOT included --
	// Wise Serpent's "no other AP sources benefit" rule means flat AP buffs
	// don't help us.
	includeBuffDebuffInputs: [
		BuffDebuffInputs.CritBuff,
		BuffDebuffInputs.MajorArmorDebuff,
		BuffDebuffInputs.AttackSpeedBuff,
		BuffDebuffInputs.Skullbanner,
		BuffDebuffInputs.StormLashTotem,
		BuffDebuffInputs.TricksOfTheTrade,
		BuffDebuffInputs.UnholyFrenzy,
		BuffDebuffInputs.ShatteringThrow,
		BuffDebuffInputs.PhysicalDamageDebuff,
	],
	excludeBuffDebuffInputs: [],
	otherInputs: {
		inputs: [OtherInputs.InFrontOfTarget, OtherInputs.InputDelay],
	},
	encounterPicker: {
		showExecuteProportion: false,
	},

	presets: {
		epWeights: [Presets.DEFAULT_EP_PRESET],
		talents: [Presets.DefaultTalents],
		// AA-only is the autoRotation default during Phase 2 verification.
		// Switch the user-facing default to 'Simple' once tuning settles.
		rotations: [Presets.AA_ONLY_ROTATION_PRESET, Presets.JAB_TP_ROTATION_PRESET, Presets.FULL_DPS_ROTATION_PRESET, Presets.SIMPLE_ROTATION_PRESET],
		gear: [Presets.PREBIS_GEAR_PRESET],
	},

	autoRotation: (_: Player<Spec.SpecFistweaverMonk>): APLRotation => {
		return Presets.AA_ONLY_ROTATION_PRESET.rotation.rotation ?? APLRotation.create();
	},

	raidSimPresets: [
		{
			spec: Spec.SpecFistweaverMonk,
			talents: Presets.DefaultTalents.data,
			specOptions: Presets.DefaultOptions,
			consumables: Presets.DefaultConsumables,
			defaultFactionRaces: {
				[Faction.Unknown]: Race.RaceUnknown,
				[Faction.Alliance]: Race.RaceAlliancePandaren,
				[Faction.Horde]: Race.RaceHordePandaren,
			},
			defaultGear: {
				[Faction.Unknown]: {},
				[Faction.Alliance]: {
					1: Presets.PREBIS_GEAR_PRESET.gear,
					2: Presets.PREBIS_GEAR_PRESET.gear,
					3: Presets.PREBIS_GEAR_PRESET.gear,
					4: Presets.PREBIS_GEAR_PRESET.gear,
				},
				[Faction.Horde]: {
					1: Presets.PREBIS_GEAR_PRESET.gear,
					2: Presets.PREBIS_GEAR_PRESET.gear,
					3: Presets.PREBIS_GEAR_PRESET.gear,
					4: Presets.PREBIS_GEAR_PRESET.gear,
				},
			},
			otherDefaults: Presets.OtherDefaults,
		},
	],
});

export class FistweaverMonkSimUI extends IndividualSimUI<Spec.SpecFistweaverMonk> {
	constructor(parentElem: HTMLElement, player: Player<Spec.SpecFistweaverMonk>) {
		super(parentElem, player, SPEC_CONFIG);

		new ReforgeOptimizer(this);
	}
}
