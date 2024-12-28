export interface BaseComponentData {
	componentId: string
}

export default abstract class BaseComponent {
	static import(data?: BaseComponentData): BaseComponent {
		throw new Error('Not implemented')
	}
	abstract export(): BaseComponentData
}
