// CORS つきでリダイレクトさせるだけ
const SEA_ORIGIN = 'https://c.linkage.community'

exports.handler = (_,_,callback) => {
  callback(null, {
    statusCode: 308,
    headers: {
      'Location': SEA_ORIGIN + '/oauth/token',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,POST,PUT,DELETE,PATCH'
    }
  })
}

