import BaseComponent, { type BaseComponentData } from './base'

export interface TransferComponentData extends BaseComponentData {
	componentId: typeof TransferComponent.id
	structureId: Id<StructureSpawn | StructureExtension> | null
}

export default class TransferComponent extends BaseComponent {
	static id = 'transfer' as const

	constructor(
		public structureId: Id<StructureSpawn | StructureExtension> | null = null,
	) {
		super()
	}

	get structure() {
		if (this.structureId) {
			return Game.getObjectById(this.structureId)
		}
		return null
	}

	set structure(structure) {
		this.structureId = structure?.id || null
	}

	static import({ structureId }: TransferComponentData): TransferComponent {
		if (structureId) {
			return new TransferComponent(structureId)
		}
		return new TransferComponent()
	}

	export(): TransferComponentData {
		return {
			componentId: TransferComponent.id,
			structureId: this.structureId,
		}
	}
}
