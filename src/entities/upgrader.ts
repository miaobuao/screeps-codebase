import HarvestComponent from '../components/harvest'
import UpgradeComponent from '../components/upgrade'
import BaseEntity from './base'

export default class UpgraderEntity extends BaseEntity<
	UpgradeComponent | HarvestComponent
> {
	constructor(
		creepName: string,
		{
			controller,
			source,
		}: { controller?: StructureController; source?: Source },
	) {
		super(creepName, [
			new HarvestComponent(source?.id),
			new UpgradeComponent(controller?.id),
		])
	}
}
