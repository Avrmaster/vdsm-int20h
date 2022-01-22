import { buildProviderModule } from 'inversify-binding-decorators'
import getDecorators from 'inversify-inject-decorators'
import { Container } from 'inversify'

const container = new Container()
export const { lazyInject } = getDecorators(container, false)

export function buildInversify() {
	container.load(buildProviderModule())
}

export { container }
