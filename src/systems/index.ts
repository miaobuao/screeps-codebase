import { map } from 'lodash-es'
import BuildComponent from '../components/build'
import HarvestComponent from '../components/harvest'
import TransferComponent from '../components/transfer'
import UpgradeComponent from '../components/upgrade'
import type BaseEntity from '../entities/base'
import BuilderEntity from '../entities/builder'
import { HarvesterEntity } from '../entities/harvester'
import UpgraderEntity from '../entities/upgrader'
import statsScanner from '../utils/stats-scanner'
import BaseSystem, { BehaviorType, type EntityData } from './base'

declare global {
	interface CreepMemory {
		behavior?: BehaviorType
	}
}

const entitiesData: Record<string, EntityData> = {}

export default class System extends BaseSystem {
	constructor(private spawn: StructureSpawn) {
		super()
		const spawningName = map(
			Game.spawns,
			(spawn) => spawn.spawning?.name,
		).filter(Boolean)
		for (const name in Memory.creeps) {
			if (!Game.creeps[name] && !spawningName.includes(name)) {
				delete Memory.creeps[name]
				delete entitiesData[name]
			}
		}
		for (const name in entitiesData) {
			if (!Game.creeps[name] && !spawningName.includes(name)) {
				delete entitiesData[name]
			}
		}
		for (const name in Game.creeps) {
			if (entitiesData[name]) {
				const entity = this.parseEntityData(entitiesData[name])
				this.entities.push(entity)
			} else if (Game.creeps[name].room === this.spawn.room) {
				this.createAndRegisterEntity(name)
			}
		}
	}

	run() {
		const harvesters = this.getEntities([HarvestComponent]).filter((entity) => {
			const { creep } = entity
			const { behavior } = creep.memory
			const { energy } = creep.store
			if (behavior !== BehaviorType.harvest && energy > 0) {
				return false
			}
			return creep.store.getFreeCapacity() !== 0
		})
		this.runHarvestComponent(harvesters)
		const transfers = this.getEntities([TransferComponent]).filter(
			(entity) => !harvesters.includes(entity as any),
		)
		this.runTransferComponent(transfers)
		const builders = this.getEntities([BuildComponent]).filter(
			(entity) => !harvesters.includes(entity as any),
		)
		this.runBuildComponent(builders)
		const upgraders = this.getEntities([UpgradeComponent]).filter(
			(entity) => !harvesters.includes(entity as any),
		)
		this.runUpgradeComponent(upgraders)

		if (!this.spawn.spawning) {
			this.spawnCreep()
		}

		this.exportAllEntities().map((entity) => {
			entitiesData[entity.name] = entity
		})

		if (Game.time % 20 === 0) {
			statsScanner()
			if (!Memory.stats) {
				Memory.stats = {}
			}
			if (!Memory.stats.resource) {
				Memory.stats.resource = {}
			}
			if (!Memory.stats.entity) {
				Memory.stats.entity = {}
			}
			const [harvests, upgrades, transfers, builds] = [
				HarvestComponent,
				UpgradeComponent,
				TransferComponent,
				BuildComponent,
			].map((c) => this.getEntities([c]))
			Memory.stats.resource = {
				energy: this.totalEnergy,
			}
			Memory.stats.entity = {
				entityCount: this.entities.length,
				components: {
					harvest: { count: harvests.length },
					upgrade: { count: upgrades.length },
					transfer: { count: transfers.length },
					build: { count: builds.length },
				},
			}
		}
	}

	createAndRegisterEntity(name: string) {
		let entity: BaseEntity<any> | null = null

		if (name.startsWith('harvester')) {
			entity = new HarvesterEntity(name, {})
		} else if (name.startsWith('upgrader')) {
			entity = new UpgraderEntity(name, {})
		} else if (name.startsWith('builder')) {
			entity = new BuilderEntity(name, {})
		}

		if (entity) {
			this.registerEntity(entity)
		}
	}

	registerEntity(entity: BaseEntity<any>): void {
		this.entities.push(entity)
		entitiesData[entity.creep.name] = {
			name: entity.creep.name,
			components: entity.components,
		}
	}

	get hasSite() {
		return this.spawn.room.find(FIND_CONSTRUCTION_SITES).length > 0
	}

	get totalEnergy() {
		const structures = this.spawn.room.find(FIND_STRUCTURES, {
			filter: (structure) =>
				structure.structureType == STRUCTURE_STORAGE ||
				structure.structureType == STRUCTURE_CONTAINER ||
				structure.structureType == STRUCTURE_EXTENSION ||
				structure.structureType === STRUCTURE_SPAWN,
		})
		return structures.reduce(
			(total, structure) => total + structure.store.energy,
			0,
		)
	}

	spawnCreep() {
		const totalEnergy = this.totalEnergy
		const harvesters = this.getEntities([TransferComponent])

		if (totalEnergy < 300) {
			return
		}

		const harvesterCount = harvesters.length
		if (totalEnergy < 400) {
			var body = [WORK, CARRY, MOVE]
		} else if (totalEnergy < 500) {
			body = [WORK, WORK, CARRY, MOVE]
		} else if (totalEnergy < 600) {
			body = [WORK, WORK, CARRY, CARRY, MOVE]
		} else if (totalEnergy < 700) {
			body = [WORK, WORK, WORK, CARRY, CARRY, MOVE]
		} else if (totalEnergy < 800) {
			body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE]
		} else if (totalEnergy < 900) {
			body = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE]
		} else {
			body = [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE]
		}
		const hasHarvester = harvesterCount > 0
		if (!hasHarvester) {
			const name = this.getNewCreepName('harvester')
			this.spawn.spawnCreep(body, name)
			const entity = new HarvesterEntity(name, {})
			this.registerEntity(entity)
		} else if (harvesterCount < 3) {
			const name = this.getNewCreepName('harvester')
			this.spawn.spawnCreep(body, name)
			const entity = new HarvesterEntity(name, {})
			this.registerEntity(entity)
		} else if (this.getEntities([UpgradeComponent]).length < 10) {
			const name = this.getNewCreepName('upgrader')
			this.spawn.spawnCreep(body, name)
			const entity = new UpgraderEntity(name, {})
			this.registerEntity(entity)
		} else if (this.hasSite && this.getEntities([BuildComponent]).length < 2) {
			const name = this.getNewCreepName('builder')
			this.spawn.spawnCreep(body, name)
			const entity = new BuilderEntity(name, {})
			this.registerEntity(entity)
		}
	}

	getNewCreepName(prefix: string) {
		const name = `${prefix}:${this.spawn.name}:${Game.time}`
		let idx = 0
		while (Memory.creeps[`${name}-${idx}`]) {
			++idx
		}
		return `${name}-${idx}`
	}

	runHarvestComponent(entities: BaseEntity<HarvestComponent>[]) {
		for (const entity of entities) {
			entity.creep.say('🔋harvest')
			entity.creep.memory.behavior = BehaviorType.harvest
			const harvestComponent = entity.getComponent(HarvestComponent)!
			let source = harvestComponent.source
			if (!source) {
				source = entity.creep.pos.findClosestByPath(FIND_SOURCES, {
					filter: (source) => source.energy > 0,
				})
				harvestComponent.source = source
			}
			if (source && entity.creep.harvest(source) == ERR_NOT_IN_RANGE) {
				entity.creep.moveTo(source, {
					visualizePathStyle: { stroke: '#ffaa00' },
				})
			}
		}
	}

	runTransferComponent(entities: BaseEntity<TransferComponent>[]) {
		for (const entity of entities) {
			entity.creep.say('♻️transfer')
			entity.creep.memory.behavior = BehaviorType.transfer
			const transferComponent = entity.getComponent(TransferComponent)!
			let target = transferComponent.structure
			if (target?.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
				target = null
			}
			if (!target) {
				target = entity.creep.pos.findClosestByPath(FIND_STRUCTURES, {
					filter: (structure) =>
						(structure.structureType == STRUCTURE_EXTENSION ||
							structure.structureType == STRUCTURE_SPAWN) &&
						structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
				})
				transferComponent.structure = target
			}
			if (
				target &&
				entity.creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
			) {
				entity.creep.moveTo(target, {
					visualizePathStyle: { stroke: '#ffffff' },
				})
			}
		}
	}

	runBuildComponent(entities: BaseEntity<BuildComponent>[]) {
		for (const entity of entities) {
			entity.creep.memory.behavior = BehaviorType.build
			entity.creep.say('🏗️build')
			const buildComponent = entity.getComponent(BuildComponent)!
			let constructionSite = buildComponent.constructionSite
			if (!constructionSite) {
				constructionSite = entity.creep.pos.findClosestByPath(
					FIND_CONSTRUCTION_SITES,
				)
				buildComponent.constructionSite = constructionSite
			}
			if (
				constructionSite &&
				entity.creep.build(constructionSite) == ERR_NOT_IN_RANGE
			) {
				entity.creep.moveTo(constructionSite, {
					visualizePathStyle: { stroke: '#ffffff' },
				})
			}
		}
	}

	runUpgradeComponent(entities: BaseEntity<UpgradeComponent>[]) {
		for (const entity of entities) {
			entity.creep.memory.behavior = BehaviorType.upgrade
			entity.creep.say('🔨upgrade')
			const upgradeComponent = entity.getComponent(UpgradeComponent)!
			let controller = upgradeComponent.controller
			if (!controller) {
				controller = entity.creep.room.controller || null
				upgradeComponent.controller = controller
			}
			if (
				controller &&
				entity.creep.upgradeController(controller) == ERR_NOT_IN_RANGE
			) {
				entity.creep.moveTo(controller, {
					visualizePathStyle: { stroke: '#ffffff' },
				})
			}
		}
	}
}
