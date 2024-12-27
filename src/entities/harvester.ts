import HarvestComponent from '../components/harvest'
import TransferComponent from '../components/transfer'
import WithdrawRuinComponent from '../components/withdraw-ruin'
import BaseEntity from './base'

export class HarvesterEntity extends BaseEntity<
	HarvestComponent | TransferComponent | WithdrawRuinComponent
> {
	constructor(
		creepName: string,
		{
			source,
			transferStructure,
			ruin,
		}: {
			source?: Source
			transferStructure?: StructureSpawn | StructureExtension
			ruin?: Ruin
		},
	) {
		super(creepName, [
			new HarvestComponent(source?.id),
			new TransferComponent(transferStructure?.id),
			new WithdrawRuinComponent(ruin?.id),
		])
	}
}
