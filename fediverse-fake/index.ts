import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as Body from 'koa-body'
import * as Logger from 'koa-logger'

import axios, { AxiosResponse } from 'axios'
import * as fs from 'fs'
import * as crypto from 'crypto'

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
  app.use(async (_, next) => {
    try {
      console.log(_.path)
      await next()

    } catch (e) {
      console.error(e)
    }
  })

  const router = new Router()

  router.all('/@:uname/inbox', require('koa-bodyreceiver'), (ctx) => {
    const d = Date.now()
    const b = JSON.parse(ctx.request.body)
    fs.writeFileSync(`./inbox/${d}-${ctx.params.uname}-body`, ctx.request.body)
    fs.writeFileSync(`./inbox/${d}-${ctx.params.uname}-body.json`, JSON.stringify(b, null, 4))
    fs.writeFileSync(`./inbox/${d}-${ctx.params.uname}-headers.json`, JSON.stringify(ctx.request.headers, null, 2))
    ctx.status = 201
    return
  })

  router.post('/@:uname/follow/:acct', async (ctx) => {
    const {uname: localUname, acct} = ctx.params
    const [remoteUname, remoteHost] = acct.split('acct:')[1].split('@')

    const u = user(`https://${ctx.host}`, localUname)

    const headers = {
      date: (new Date()).toUTCString(),
      host: remoteHost
    } as any
    const sign: string = ((requestTarget: string, headers: {[T:string]: string}) => {
      const source = [
        `(request-target): ${requestTarget}`,
        ...Object.entries(headers).map(([k, v]) => `${k.toLowerCase()}: ${v}`)
      ].join('\n')

      const s = crypto.createSign('RSA-SHA256')
      s.write(source)
      return s.sign(priv, 'base64')
    })('post /users/otofune/inbox', headers)
    headers.signature = `keyId="${u.publicKey.id}",headers="(request-target) ${Object.keys(headers).map(v => v.toLowerCase()).join(' ')}",signature="${sign}"`

    const d = {
      "@context": "https://www.w3.org/ns/activitystreams",
    
      "id": `https://${ctx.host}/${Date.now()}`,
      "type": "Follow",
      "actor": u.id,
      "object": "https://md.otofune.net/users/otofune",
    }

    let res: AxiosResponse
    try {
      res = await axios.post('https://md.otofune.net/users/otofune/inbox', d, {headers})
    } catch (e) {
      res = e.response
    }

    ctx.status = res.status
    ctx.body = res.data
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
