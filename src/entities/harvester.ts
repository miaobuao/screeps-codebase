import HarvestComponent from '../components/harvest'
import TransferComponent from '../components/transfer'
import BaseEntity from './base'

export class HarvesterEntity extends BaseEntity<
	HarvestComponent | TransferComponent
> {
	constructor(
		creepName: string,
		{
			source,
			transferStructure,
		}: {
			source?: Source
			transferStructure?: StructureSpawn | StructureExtension
		},
	) {
		super(creepName, [
			new HarvestComponent(source),
			new TransferComponent(transferStructure),
		])
	}
}
