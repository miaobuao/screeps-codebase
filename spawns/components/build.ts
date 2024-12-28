import BaseComponent, { type BaseComponentData } from './base'

export interface BuildComponentData extends BaseComponentData {
	componentId: typeof BuildComponent.id
	constructionSiteId: Id<ConstructionSite> | null
}

export default class BuildComponent extends BaseComponent {
	static id = 'build' as const

	constructor(public constructionSiteId: Id<ConstructionSite> | null = null) {
		super()
	}

	get constructionSite() {
		if (this.constructionSiteId) {
			return Game.getObjectById(this.constructionSiteId)
		}
		return null
	}

	set constructionSite(site) {
		this.constructionSiteId = site?.id || null
	}

	static import({ constructionSiteId }: BuildComponentData) {
		if (!constructionSiteId) {
			return new BuildComponent()
		}
		return new BuildComponent(constructionSiteId)
	}

	export(): BuildComponentData {
		return {
			componentId: BuildComponent.id,
			constructionSiteId: this.constructionSiteId,
		}
	}
}
