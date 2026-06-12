import { IconSize } from '../player_class';
import { PlayerSpec } from '../player_spec';
import { Class, Spec } from '../proto/common';
import { getSpecSiteUrl } from '../proto_utils/utils';

export class BrewmasterMonk extends PlayerSpec<Spec.SpecBrewmasterMonk> {
	static specIndex = 0;
	static specID = Spec.SpecBrewmasterMonk as Spec.SpecBrewmasterMonk;
	static classID = Class.ClassMonk as Class.ClassMonk;
	static friendlyName = 'Brewmaster';
	static simLink = getSpecSiteUrl('monk', 'brewmaster');

	static isTankSpec = true;
	static isHealingSpec = false;
	static isRangedDpsSpec = false;
	static isMeleeDpsSpec = false;

	static canDualWield = true;

	readonly specIndex = BrewmasterMonk.specIndex;
	readonly specID = BrewmasterMonk.specID;
	readonly classID = BrewmasterMonk.classID;
	readonly friendlyName = BrewmasterMonk.friendlyName;
	readonly simLink = BrewmasterMonk.simLink;

	readonly isTankSpec = BrewmasterMonk.isTankSpec;
	readonly isHealingSpec = BrewmasterMonk.isHealingSpec;
	readonly isRangedDpsSpec = BrewmasterMonk.isRangedDpsSpec;
	readonly isMeleeDpsSpec = BrewmasterMonk.isMeleeDpsSpec;

	readonly canDualWield = BrewmasterMonk.canDualWield;

	static getIcon = (size: IconSize): string => {
		return `https://wow.zamimg.com/images/wow/icons/${size}/spell_monk_brewmaster_spec.jpg`;
	};

	getIcon = (size: IconSize): string => {
		return BrewmasterMonk.getIcon(size);
	};
}

export class MistweaverMonk extends PlayerSpec<Spec.SpecMistweaverMonk> {
	static specIndex = 1;
	static specID = Spec.SpecMistweaverMonk as Spec.SpecMistweaverMonk;
	static classID = Class.ClassMonk as Class.ClassMonk;
	static friendlyName = 'Mistweaver';
	static simLink = getSpecSiteUrl('monk', 'mistweaver');

	static isTankSpec = false;
	static isHealingSpec = true;
	static isRangedDpsSpec = false;
	static isMeleeDpsSpec = false;

	static canDualWield = false;

	readonly specIndex = MistweaverMonk.specIndex;
	readonly specID = MistweaverMonk.specID;
	readonly classID = MistweaverMonk.classID;
	readonly friendlyName = MistweaverMonk.friendlyName;
	readonly simLink = MistweaverMonk.simLink;

	readonly isTankSpec = MistweaverMonk.isTankSpec;
	readonly isHealingSpec = MistweaverMonk.isHealingSpec;
	readonly isRangedDpsSpec = MistweaverMonk.isRangedDpsSpec;
	readonly isMeleeDpsSpec = MistweaverMonk.isMeleeDpsSpec;

	readonly canDualWield = MistweaverMonk.canDualWield;

	static getIcon = (size: IconSize): string => {
		return `https://wow.zamimg.com/images/wow/icons/${size}/spell_monk_mistweaver_spec.jpg`;
	};

	getIcon = (size: IconSize): string => {
		return MistweaverMonk.getIcon(size);
	};
}

export class WindwalkerMonk extends PlayerSpec<Spec.SpecWindwalkerMonk> {
	static specIndex = 2;
	static specID = Spec.SpecWindwalkerMonk as Spec.SpecWindwalkerMonk;
	static classID = Class.ClassMonk as Class.ClassMonk;
	static friendlyName = 'Windwalker';
	static simLink = getSpecSiteUrl('monk', 'windwalker');

	static isTankSpec = false;
	static isHealingSpec = false;
	static isRangedDpsSpec = false;
	static isMeleeDpsSpec = true;

	static canDualWield = true;

	readonly specIndex = WindwalkerMonk.specIndex;
	readonly specID = WindwalkerMonk.specID;
	readonly classID = WindwalkerMonk.classID;
	readonly friendlyName = WindwalkerMonk.friendlyName;
	readonly simLink = WindwalkerMonk.simLink;

	readonly isTankSpec = WindwalkerMonk.isTankSpec;
	readonly isHealingSpec = WindwalkerMonk.isHealingSpec;
	readonly isRangedDpsSpec = WindwalkerMonk.isRangedDpsSpec;
	readonly isMeleeDpsSpec = WindwalkerMonk.isMeleeDpsSpec;

	readonly canDualWield = WindwalkerMonk.canDualWield;

	static getIcon = (size: IconSize): string => {
		return `https://wow.zamimg.com/images/wow/icons/${size}/spell_monk_windwalker_spec.jpg`;
	};

	getIcon = (size: IconSize): string => {
		return WindwalkerMonk.getIcon(size);
	};
}

export class FistweaverMonk extends PlayerSpec<Spec.SpecFistweaverMonk> {
	static specIndex = 3;
	static specID = Spec.SpecFistweaverMonk as Spec.SpecFistweaverMonk;
	static classID = Class.ClassMonk as Class.ClassMonk;
	static friendlyName = 'Fistweaver';
	static simLink = getSpecSiteUrl('monk', 'fistweaver');

	static isTankSpec = false;
	static isHealingSpec = false;
	static isRangedDpsSpec = false;
	static isMeleeDpsSpec = true;

	// Monks don't dual wield - 1H goes mainhand + offhand (separate slots),
	// not two 1H weapons in main+offhand like rogues/warriors.
	static canDualWield = false;

	readonly specIndex = FistweaverMonk.specIndex;
	readonly specID = FistweaverMonk.specID;
	readonly classID = FistweaverMonk.classID;
	readonly friendlyName = FistweaverMonk.friendlyName;
	readonly simLink = FistweaverMonk.simLink;

	readonly isTankSpec = FistweaverMonk.isTankSpec;
	readonly isHealingSpec = FistweaverMonk.isHealingSpec;
	readonly isRangedDpsSpec = FistweaverMonk.isRangedDpsSpec;
	readonly isMeleeDpsSpec = FistweaverMonk.isMeleeDpsSpec;

	readonly canDualWield = FistweaverMonk.canDualWield;

	static getIcon = (size: IconSize): string => {
		// Fistweaver isn't a real Blizzard spec, so we don't have a unique spec icon.
		// Tiger Palm is the iconic Fistweaver-flavor ability, so use that.
		return `https://wow.zamimg.com/images/wow/icons/${size}/ability_monk_tigerpalm.jpg`;
	};

	getIcon = (size: IconSize): string => {
		return FistweaverMonk.getIcon(size);
	};
}
