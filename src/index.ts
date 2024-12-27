import System from './systems'

export function loop() {
	if (Game.cpu.bucket >= 5000) {
		Game.cpu.generatePixel()
	}
	const sys = new System(Game.spawns['sp1'])
	sys.run()
}
