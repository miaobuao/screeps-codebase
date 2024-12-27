import BaseComponent, { type BaseComponentData } from './base'

export interface WithdrawRuinComponentData extends BaseComponentData {
	ruinId?: Id<Ruin>
}

export default class WithdrawRuinComponent extends BaseComponent {
	static id = 'withdraw-ruin' as const

	constructor(public ruinId: Id<Ruin> | null = null) {
		super()
	}

	get ruin() {
		if (this.ruinId) {
			return Game.getObjectById(this.ruinId)
		}
		return null
	}

	set ruin(ruin) {
		this.ruinId = ruin?.id || null
	}

	static import({ ruinId }: WithdrawRuinComponentData) {
		if (ruinId) {
			return new WithdrawRuinComponent(ruinId)
		}
		return new WithdrawRuinComponent()
	}

	export(): WithdrawRuinComponentData {
		return {
			componentId: WithdrawRuinComponent.id,
			ruinId: this.ruin?.id,
		}
	}
}
