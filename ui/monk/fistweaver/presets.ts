import * as PresetUtils from '../../core/preset_utils';
import { ConsumesSpec, Glyphs, Profession, Stat } from '../../core/proto/common';
import { FistweaverMonk_Options as FistweaverMonkOptions, MonkMajorGlyph, MonkMinorGlyph } from '../../core/proto/monk';
import { SavedTalents } from '../../core/proto/ui';
import { Stats } from '../../core/proto_utils/stats';
import DefaultApl from './apls/default.apl.json';
import DefaultGear from './gear_sets/default.gear.json';

// Preset options for this spec.
// Eventually we will import these values for the raid sim too, so its good to
// keep them in a separate file.

export const PREBIS_GEAR_PRESET = PresetUtils.makePresetGear('Default', DefaultGear);

// Simplest viable rotation for Phase 1: refresh Tiger Power debuff if it's
// dropping, spend Chi on Blackout Kick at >=2 stacks, generate Chi with Jab
// otherwise. No talent procs, no cooldowns, no AoE handling. Will be
// retuned/expanded in Phase 2.
export const SIMPLE_ROTATION_PRESET = PresetUtils.makePresetAPLRotation('Simple', DefaultApl);

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
export const DefaultTalents = {
	name: 'Default',
	data: SavedTalents.create({
		talentsString: '',
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
