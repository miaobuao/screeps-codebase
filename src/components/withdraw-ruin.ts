import BaseComponent, { type BaseComponentData } from './base'

export interface WithdrawRuinComponentData extends BaseComponentData {
	ruinId?: Id<Ruin>
}

export default class WithdrawRuinComponent extends BaseComponent {
	static id = 'withdraw-ruin' as const

	constructor(public ruin: Ruin | null = null) {
		super()
	}

	static import(data?: WithdrawRuinComponentData) {
		if (!data?.ruinId) {
			return new WithdrawRuinComponent()
		}
		const obj = Game.getObjectById(data.ruinId)
		return new WithdrawRuinComponent(obj)
	}

	export(): WithdrawRuinComponentData {
		return {
			componentId: WithdrawRuinComponent.id,
			ruinId: this.ruin?.id,
		}
	}
}
