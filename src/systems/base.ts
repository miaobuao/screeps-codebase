import { every, filter, some } from 'lodash-es'
import type BaseComponent from '../components/base'
import type { BuildComponentData } from '../components/build'
import BuildComponent from '../components/build'
import type { HarvestComponentData } from '../components/harvest'
import HarvestComponent from '../components/harvest'
import type { TransferComponentData } from '../components/transfer'
import TransferComponent from '../components/transfer'
import type { UpgradeComponentData } from '../components/upgrade'
import UpgradeComponent from '../components/upgrade'
import BaseEntity from '../entities/base'

export default abstract class BaseSystem {
	public entities: BaseEntity<any>[] = []

	abstract run(): void

	registerEntity(entity: BaseEntity<any>) {
		this.entities.push(entity)
	}

	getEntities<T extends typeof BaseComponent>(
		components: T[],
	): BaseEntity<InstanceType<T>>[] {
		return filter(this.entities, (entity) =>
			every(components, (component) =>
				some(entity.components, (c) => c instanceof component),
			),
		)
	}

	exportAllEntities(): EntityData[] {
		return this.entities.map((entity) => ({
			name: entity.creepName,
			components: entity.components.map((component) => component.export()),
		}))
	}

	parseEntityData(data: EntityData) {
		const creep = Game.creeps[data.name]
		const components = data.components
			.map((component) => {
				switch (component.componentId) {
					case HarvestComponent.id:
						return HarvestComponent.import(component)
					case BuildComponent.id:
						return BuildComponent.import(component)
					case TransferComponent.id:
						return TransferComponent.import(component)
					case UpgradeComponent.id:
						return UpgradeComponent.import(component)
				}
			})
			.filter(Boolean)
		return new BaseEntity(creep.name, components)
	}
}

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
