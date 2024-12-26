import BaseComponent, { type BaseComponentData } from './base'

export interface HarvestComponentData extends BaseComponentData {
	componentId: typeof HarvestComponent.id
	sourceId?: Id<Source>
}

export default class HarvestComponent extends BaseComponent {
	constructor(public source: Source | null = null) {
		super()
	}

	static id = 'harvest' as const

	static import(data?: HarvestComponentData): HarvestComponent {
		if (!data?.sourceId) {
			return new HarvestComponent()
		}
		const obj = Game.getObjectById(data.sourceId)
		return new HarvestComponent(obj)
	}

	export(): HarvestComponentData {
		return {
			componentId: HarvestComponent.id,
			sourceId: this.source?.id,
		}
	}
}