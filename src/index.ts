import System from './system'

const sys = new System('sp1')

export function loop() {
	if (Game.cpu.bucket >= 5000) {
		Game.cpu.generatePixel()
	}
	sys.clearState()
	sys.initializeEntities()
	sys.run()

	if (Game.time % 20 === 0) {
		sys.stats()
	}
}
