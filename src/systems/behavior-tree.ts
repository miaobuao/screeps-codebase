import type { BuildComponentData } from '../components/build'
import type { HarvestComponentData } from '../components/harvest'
import type { TransferComponentData } from '../components/transfer'
import type { UpgradeComponentData } from '../components/upgrade'

export enum BehaviorType {
	harvest,
	upgrade,
	build,
	transfer,
}

export interface EntityData {
	name: string
	components: Array<
		| BuildComponentData
		| HarvestComponentData
		| TransferComponentData
		| UpgradeComponentData
	>
}
