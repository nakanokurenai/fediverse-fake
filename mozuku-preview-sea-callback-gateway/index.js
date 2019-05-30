(async () => {
  const REFERRER_ORIGIN_KEY = 'MPSCG_REF'
  const SEA_ORIGIN = 'https://c.linkage.community'
  const app = document.getElementById('app')

  function setMessage (message) {
    if (!app) console.error(message)
    app.innerText = message
  }
  function to () {
    return location.pathname + location.search
  }
  function authorize () {
    if (!document.referrer) {
      setMessage('NO! MISSING REFERRER.')
      return
    }
    const ref = new URL(document.referrer)
    localStorage.setItem(REFERRER_ORIGIN_KEY, ref.origin)
    const goto = new URL(to(), SEA_ORIGIN)
    location.href.assign(goto)
  }
  function callback () {
    const refOrigin = localStorage.getItem(REFERRER_ORIGIN_KEY)
    if (!refOrigin) {
      setMessage("NO! REFERRER HAVEN'T STORED.")
      return
    }
    const goto = new URL(to(), refOrigin)
    location.href.assign(goto)
  }

  const { pathname } = document.location
  switch (pathname) {
    case '/oauth/authorize':
      authorize()
      break
    case '/callback':
      callback()
      break
    default:
      setMessage('馬鹿な真似はやめろ.')
      break
  }
})()

