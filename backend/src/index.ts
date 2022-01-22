import { container, buildInversify } from 'inversify.config'
import { RestServer } from 'interfaces'
import requireDir from 'require-dir'

requireDir('domain', { recurse: true })
requireDir('interfaces', { recurse: true })

buildInversify()
container.get(RestServer).start()
