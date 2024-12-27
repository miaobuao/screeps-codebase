import BaseComponent, { type BaseComponentData } from './base'

export interface UpgradeComponentData extends BaseComponentData {
	componentId: typeof UpgradeComponent.id
	controllerId: Id<StructureController> | null
}

export default class UpgradeComponent extends BaseComponent {
	static id = 'upgrade' as const

	constructor(public controllerId: Id<StructureController> | null = null) {
		super()
	}

	get controller() {
		if (this.controllerId) {
			return Game.getObjectById(this.controllerId)
		}
		return null
	}

	set controller(controller) {
		this.controllerId = controller?.id || null
	}

	static import({ controllerId }: UpgradeComponentData) {
		if (controllerId) {
			return new UpgradeComponent(controllerId)
		}
		return new UpgradeComponent()
	}

	export(): UpgradeComponentData {
		return {
			componentId: UpgradeComponent.id,
			controllerId: this.controller?.id || null,
		}
	}
}
