import BaseComponent from '../components/base'

export default class BaseEntity<
	TComponent extends BaseComponent = BaseComponent,
> {
	constructor(
		public creepName: string,
		public components: TComponent[] = [],
	) {}

	get creep() {
		return Game.creeps[this.creepName]
	}

	getComponent(component: typeof BaseComponent) {
		return this.components.find((c) => c instanceof component)
	}
}
