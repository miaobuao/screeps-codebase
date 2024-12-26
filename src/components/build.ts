import BaseComponent, { type BaseComponentData } from './base'

export interface BuildComponentData extends BaseComponentData {
	componentId: typeof BuildComponent.id
	constructionSiteId?: Id<ConstructionSite>
}

export default class BuildComponent extends BaseComponent {
	constructor(public constructionSite: ConstructionSite | null = null) {
		super()
	}

	static id = 'build' as const

	static import(data?: BuildComponentData) {
		if (!data?.constructionSiteId) {
			return new BuildComponent()
		}
		const obj = Game.getObjectById(data.constructionSiteId)
		return new BuildComponent(obj)
	}

	export(): BuildComponentData {
		return {
			componentId: BuildComponent.id,
			constructionSiteId: this.constructionSite?.id,
		}
	}
}
