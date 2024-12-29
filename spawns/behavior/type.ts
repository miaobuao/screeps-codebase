export enum BehaviorType {
	harvest,
	upgrade,
	build,
	transfer,
}

declare global {
	interface CreepMemory {
		behavior?: BehaviorType
	}
}
