(async () => {
  const REFERRER_ORIGIN_KEY = 'MPSCG_REF'
  const SEA_ORIGIN = 'https://c.linkage.community'
  const app = document.getElementById('app')

  function setMessage (message) {
    if (!app) console.error(message)
    app.innerText = message
  }
  function to (pathname = location.pathname) {
    return pathname + location.search
  }
  function authorize () {
    if (!document.referrer) {
      setMessage('NO! MISSING REFERRER.')
      return
    }
    const ref = new URL(document.referrer)
    localStorage.setItem(REFERRER_ORIGIN_KEY, ref.origin)
    const goto = new URL(to('/oauth/authorize'), SEA_ORIGIN)
    location.assign(goto)
  }
  function callback () {
    const refOrigin = localStorage.getItem(REFERRER_ORIGIN_KEY)
    if (!refOrigin) {
      setMessage("NO! REFERRER HAVEN'T STORED.")
      return
    }
    const goto = new URL(to(), refOrigin)
    location.assign(goto)
  }
  function redirectToSeaTop () {
    location.assign(SEA_ORIGIN)
  }

  const { pathname } = document.location
  switch (pathname) {
    case '/.netlify/functions/authorize':
      authorize()
      break
    case '/callback':
      callback()
      break
    case '/.netlify/functions/token':
      // Netlify Functions 側で完結させる
      break
    case '/':
      redirectToSeaTop()
      break
    default:
      setMessage('馬鹿な真似はやめろ.')
      break
  }
})()

