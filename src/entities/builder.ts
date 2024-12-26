import BuildComponent from '../components/build'
import HarvestComponent from '../components/harvest'
import BaseEntity from './base'

export default class BuilderEntity extends BaseEntity<
	BuildComponent | HarvestComponent
> {
	constructor(
		creepName: string,
		{
			constructionSite,
			source,
		}: { constructionSite?: ConstructionSite; source?: Source },
	) {
		super(creepName, [
			new HarvestComponent(source),
			new BuildComponent(constructionSite),
		])
	}
}
