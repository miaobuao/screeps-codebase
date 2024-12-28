import BaseComponent, { type BaseComponentData } from './base'

export interface HarvestComponentData extends BaseComponentData {
	componentId: typeof HarvestComponent.id
	sourceId?: Id<Source>
}

export default class HarvestComponent extends BaseComponent {
	static id = 'harvest' as const

	constructor(public sourceId: Id<Source> | null = null) {
		super()
	}

	get source() {
		if (this.sourceId) {
			return Game.getObjectById(this.sourceId)
		}
		return null
	}

	set source(source) {
		this.sourceId = source?.id || null
	}

	static import(data?: HarvestComponentData): HarvestComponent {
		if (!data?.sourceId) {
			return new HarvestComponent()
		}
		return new HarvestComponent(data.sourceId)
	}

	export(): HarvestComponentData {
		return {
			componentId: HarvestComponent.id,
			sourceId: this.sourceId || undefined,
		}
	}
}
