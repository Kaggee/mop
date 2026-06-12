import * as PresetUtils from '../../core/preset_utils';
import { ConsumesSpec, Glyphs, Profession, Stat } from '../../core/proto/common';
import { FistweaverMonk_Options as FistweaverMonkOptions, MonkMajorGlyph, MonkMinorGlyph } from '../../core/proto/monk';
import { SavedTalents } from '../../core/proto/ui';
import { Stats } from '../../core/proto_utils/stats';
import AaOnlyApl from './apls/aa_only.apl.json';
import DefaultApl from './apls/default.apl.json';
import FullDpsApl from './apls/full_dps.apl.json';
import JabTpApl from './apls/jab_tp.apl.json';
import DefaultGear from './gear_sets/default.gear.json';

// Preset options for this spec.
// Eventually we will import these values for the raid sim too, so its good to
// keep them in a separate file.

export const PREBIS_GEAR_PRESET = PresetUtils.makePresetGear('Default', DefaultGear);

// Simple Phase 1 rotation: maintain Tiger Power, BoK at >=2 chi, Jab filler.
export const SIMPLE_ROTATION_PRESET = PresetUtils.makePresetAPLRotation('Simple', DefaultApl);

// Auto-attack-only baseline: empty priority list. Useful for AA DPS / Tiger
// Strikes proc / 2H vs 1H+OH comparisons against in-game pulls.
export const AA_ONLY_ROTATION_PRESET = PresetUtils.makePresetAPLRotation('Auto Attack Only', AaOnlyApl);

// Jab/TP alternation: Jab grants Muscle Memory, next TP consumes for +150%
// damage and 4% mana. Isolates Teachings (TP +100%) and Muscle Memory from
// BoK / chi interactions for in-game cross-checks.
export const JAB_TP_ROTATION_PRESET = PresetUtils.makePresetAPLRotation('Jab + Tiger Palm', JabTpApl);

// Full DPS: talent row 30 (Chi Wave/Burst/Zen Sphere) + row 90 (Xuen/RJW)
// when off CD, then BoK at >=2 chi + Muscle Memory, TP at >=1 chi +
// Muscle Memory, Jab as filler. Power Strikes is passive and applies
// automatically. Chi Torpedo is currently a stub in sim/monk/talents.go
// so it's not in the priority list yet.
export const FULL_DPS_ROTATION_PRESET = PresetUtils.makePresetAPLRotation('Full DPS', FullDpsApl);

// Preset options for EP weights. Phase 0 stub: copies Mistweaver's healer-leaning
// weights. Will be retuned in Phase 2 once we have working damage abilities.
export const DEFAULT_EP_PRESET = PresetUtils.makePresetEpWeights(
	'Default',
	Stats.fromMap({
		[Stat.StatIntellect]: 1.0,
		[Stat.StatSpirit]: 0.9,
		[Stat.StatSpellPower]: 0.79,
		[Stat.StatHitRating]: 0.9,
		[Stat.StatCritRating]: 0.42,
		[Stat.StatHasteRating]: 1.0,
		[Stat.StatMasteryRating]: 0.13,
	}),
);

// Default talents. Uses the wowhead calculator format, make the talents on
// https://wowhead.com/mop/talent-calc and copy the numbers in the url.
// 213312 =
//   row 15: Tiger's Lust
//   row 30: Chi Wave   (procs in Full DPS rotation)
//   row 45: Power Strikes  (every 20s, next Jab grants +1 chi -> enables BoK)
//   row 60: Leg Sweep
//   row 75: Healing Elixirs
//   row 90: Invoke Xuen     (10min CD; biggest single damage cooldown)
export const DefaultTalents = {
	name: 'Default',
	data: SavedTalents.create({
		talentsString: '213312',
		glyphs: Glyphs.create({
			major1: MonkMajorGlyph.GlyphOfSpinningCraneKick,
			major2: MonkMajorGlyph.GlyphOfTouchOfKarma,
			major3: MonkMajorGlyph.GlyphOfZenMeditation,
			minor1: MonkMinorGlyph.GlyphOfBlackoutKick,
			minor2: MonkMinorGlyph.GlyphOfJab,
			minor3: MonkMinorGlyph.GlyphOfWaterRoll,
		}),
	}),
};

export const DefaultOptions = FistweaverMonkOptions.create({
	classOptions: {},
});

export const DefaultConsumables = ConsumesSpec.create({
	flaskId: 76093,
	foodId: 62290,
	potId: 76093,
	prepotId: 76093,
});

export const OtherDefaults = {
	profession1: Profession.Engineering,
	profession2: Profession.Blacksmithing,
	distanceFromTarget: 5,
	iterationCount: 25000,
};
