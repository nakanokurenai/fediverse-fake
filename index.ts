import Koa from 'koa'
import Router from 'koa-router'
import Body from 'koa-body'
import Logger from 'koa-logger'

const main = async () => {
  const app = new Koa()
  app.use(Logger())

  const router = new Router()

  router.all('/@fake3/inbox', Body(), (ctx) => {
    console.dir(ctx.body)
    ctx.status = 201
    return {}
  })

  router.get('/@fake3', (ctx) => {
    ctx.set('Content-Type', 'application/activity+json')
    ctx.body = require('fs').readFileSync('./fake3.json').toString()
  })

  router.get('/.well-known/host-meta', (ctx) => {
    ctx.set('Content-Type', 'application/xml')
    ctx.body = `
    <?xml version="1.0"?>
<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">
    <Link rel="lrdd" type="application/xrd+xml" template="https://example.com/.well-known/webfinger?resource={uri}" />
</XRD>`
  })

  router.get('/.well-known/webfinger', (ctx) => {
    ctx.set('Content-Type', 'application/activity+json')
    ctx.body = {
      "subject": `${ctx.query.resource}`,
    
      "links": [
        {
          "rel": "self",
          "type": "application/activity+json",
          "href": "https://a223ccf9.ngrok.io/@fake3"
        }
      ]
    }
  })

  app.use(router.routes())

  app.listen(8080)
}

main().then(console.dir).catch(console.error)
