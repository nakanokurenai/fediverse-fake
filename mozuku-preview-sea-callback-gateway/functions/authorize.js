exports.handler = (...args) => {
  const callback = args.pop()
  callback(null, {
    statusCode: 200,
    body: `<div id="app">Being redirected...</div><script src="/index.js"></script>`
  })
}
