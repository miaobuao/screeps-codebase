import type { BuildComponentData } from '@/components/build'
import type { HarvestComponentData } from '@/components/harvest'
import type { TransferComponentData } from '@/components/transfer'
import type { UpgradeComponentData } from '@/components/upgrade'

export interface EntityData {
	name: string
	components: Array<
		| BuildComponentData
		| HarvestComponentData
		| TransferComponentData
		| UpgradeComponentData
	>
}

interface Components {
	harvest: { count: number }
	transfer: { count: number }
	upgrade: { count: number }
	build: { count: number }
}

interface Entity {
	entityCount: number
	components: Partial<Components>
}

interface Resource {
	energy: number
}

declare global {
	interface Memory {
		stats?: {
			game?: Partial<{
				gcl: number
				gclLevel: number
				gpl: number
				gplLevel: number
				cpu: number
				bucket: number
			}>
			spawns?: {
				[spawnName: string]: Partial<{
					resource: Partial<Resource>
					entity: Partial<Entity>
				}>
			}
		}
	}
}
