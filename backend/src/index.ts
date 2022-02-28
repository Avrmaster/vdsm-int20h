import { container, buildInversify } from 'inversify.config'
import { RestServer } from 'interfaces'
import requireDir from 'require-dir'
import { DDOSWorkerManager } from 'application/ddos/DDOSWorkerManager'

requireDir('domain', { recurse: true })
requireDir('interfaces', { recurse: true })

buildInversify()
container.get(RestServer).start()

const workerManager = container.get(DDOSWorkerManager)
workerManager.upsertWorker(null as any)
