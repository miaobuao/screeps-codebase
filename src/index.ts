import System from './systems'

const sys = new System(Game.spawns['sp1'])

export function loop() {
	if (Game.cpu.bucket >= 5000) {
		Game.cpu.generatePixel()
	}
	sys.clearState()
	sys.initializeEntities()
	sys.run()
}
