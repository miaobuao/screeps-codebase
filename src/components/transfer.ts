import BaseComponent, { type BaseComponentData } from './base'

export interface TransferComponentData extends BaseComponentData {
	componentId: typeof TransferComponent.id
	structureId?: Id<StructureSpawn | StructureExtension>
}

export default class TransferComponent extends BaseComponent {
	static id = 'transfer' as const

	constructor(
		public structure: StructureSpawn | StructureExtension | null = null,
	) {
		super()
	}

	static import(data?: TransferComponentData): TransferComponent {
		if (!data?.structureId) {
			return new TransferComponent()
		}
		const obj = Game.getObjectById(data.structureId)
		return new TransferComponent(obj)
	}

	export(): TransferComponentData {
		return {
			componentId: TransferComponent.id,
			structureId: this.structure?.id,
		}
	}
}
