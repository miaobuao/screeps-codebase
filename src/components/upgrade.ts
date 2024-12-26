import BaseComponent, { type BaseComponentData } from './base'

export interface UpgradeComponentData extends BaseComponentData {
	componentId: typeof UpgradeComponent.id
	controllerId?: Id<StructureController>
}

export default class UpgradeComponent extends BaseComponent {
	constructor(public controller: StructureController | null = null) {
		super()
	}

	static id = 'upgrade' as const

	static import(data?: UpgradeComponentData) {
		if (!data?.controllerId) {
			return new UpgradeComponent()
		}
		const obj = Game.getObjectById(data.controllerId)
		return new UpgradeComponent(obj)
	}

	export(): UpgradeComponentData {
		return {
			componentId: UpgradeComponent.id,
			controllerId: this.controller?.id,
		}
	}
}