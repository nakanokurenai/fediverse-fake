import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as Body from 'koa-body'
import * as Logger from 'koa-logger'

import * as fs from 'fs'

const pub = fs.readFileSync('./public.pem').toString()
const priv = fs.readFileSync('./private.pem').toString()

const user = (origin: string, uname: string) => ({
  "@context": [
      "https://www.w3.org/ns/activitystreams",
      "https://w3id.org/security/v1"
  ],
  "id": `${origin}/@${uname}`,
  "type": "Person",
  "preferredUsername": uname,
  "inbox": `${origin}/@${uname}/inbox`,
  "publicKey": {
      "id": `${origin}/@${uname}#key`,
      "owner": `${origin}/@${uname}`,
      "publicKeyPem": pub
  }
})

const main = async () => {
  const app = new Koa()
  app.use(Logger())

  const router = new Router()

  router.all('/@:uname/inbox', require('koa-bodyreceiver'), (ctx) => {
    const d = Date.now()
    fs.writeFileSync(`./inbox/${d}-${ctx.params.uname}-body.json`, ctx.request.body)
    fs.writeFileSync(`./inbox/${d}-${ctx.params.uname}-headers.json`, JSON.stringify(ctx.request.headers, null, 2))
    ctx.status = 201
    return
  })

  router.get('/@:uname', (ctx) => {
    ctx.set('Content-Type', 'application/activity+json')
    ctx.body = user(`https://${ctx.host}`, ctx.params.uname)
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
    const [uname, host] = ctx.query.resource.split('acct:')[1].split('@')

    if (host !== ctx.host) {
      console.log(`${host} isn't match ${ctx.host}`)
      ctx.status = 400
      return
    }

    ctx.body = {
      "subject": `${ctx.query.resource}`,

      "links": [
        {
          "rel": "self",
          "type": "application/activity+json",
          "href": `https://${ctx.host}/@${uname}` 
        }
      ]
    }
  })

  app.use(router.routes())

  app.listen(8080)
}

main().then(console.dir).catch(console.error)
