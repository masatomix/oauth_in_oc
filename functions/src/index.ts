import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import request from 'request'
import session from './session'
import oauthConfig from './oauthConfig'
import oidcConfig from './oidcConfig'
import * as cookie from 'cookie'
import urljoin from 'url-join'
import corsLib from 'cors'
const cors = corsLib()

// https://firebase.google.com/docs/auth/admin/create-custom-tokens?hl=ja

// https://qiita.com/mogamin3/items/a1fdb1061c47324b4c64
// https://api.slack.com/docs/sign-in-with-slack
// https://qiita.com/YutaroYoshikawa/items/deaaff3818f9e1c5d1c5

// Firebaseのサービスアカウントキーを使う場合
import * as serviceAccount from './firebase-adminsdk.json'
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  // storageBucket: firebaseConfig.storageBucket
})

export const oauth = functions.https.onRequest(async (req, res) => {
  // errorでリダイレクトされたとき
  // ユーザがキャンセルしたときはココなので、そこそこちゃんと実装しないと。。(今んとこ適当実装)
  if (req.query.error) {
    res.setHeader('Content-Type', 'text/plain;charset=UTF-8')
    const message = `
error: ${req.query.error}
error_uri: ${req.query.error_uri}
error_description: ${req.query.error_description}
`
    res.send(message)
    return
  }

  const code = req.query.code

  // codeがなかったとき、まずは認可画面へ遷移
  if (!code) {
    const randomValue = getRandomString()
    console.log('randomValue: ' + randomValue)

    const authorization_endpoint_uri = [
      oauthConfig.authorization_endpoint,
      '?client_id=',
      oauthConfig.client_id,
      '&redirect_uri=',
      oauthConfig.redirect_uri,
      '&state=',
      randomValue,
      '&response_type=code',
      '&scope=',
      oauthConfig.scope,
    ].join('')

    const sessionId = getRandomString()
    addCookie(res, 'sessionId', sessionId) // クライアントとセッションを「sessionId」で繋ぐ

    // session.setAttributeById(sessionId, 'state', randomValue)
    // const fromUrl = req.headers.referer as string
    // console.log(fromUrl)
    // if (fromUrl) {
    //   session.setAttributeById(sessionId, 'fromUrl', fromUrl)
    // }

    const fromUrl = req.headers.referer as string
    const obj = {
      state: randomValue,
      fromUrl: fromUrl,
    }
    session.setAttributeObjById(sessionId, obj)
    res.redirect(authorization_endpoint_uri)
  } else {
    const cookies = cookie.parse(req.headers.cookie as string)
    const sessionId = cookies.sessionId
    console.log('sessionId:', sessionId)

    // ホントはココの処理、もっと後がいいんだけどcsrfチェックをしたらSessionからデータを削除するのでココで:-)
    // 今回は referer を保持しておいて、そこにリダイレクトにしてるけど、キメウチとかの方が安全かもしれない
    const fromUrl = await session.getAttributeById(sessionId, 'fromUrl')
    console.log('fromUrl:', fromUrl)
    // ここまで

    const csrf = await checkCSRF(req, res, sessionId)
    if (!csrf) {
      res
        .status(400)
        .send('前回のリクエストと今回のstate値が一致しないため、エラー。')
      return
    }

    const formParams = {
      redirect_uri: oauthConfig.redirect_uri,
      client_id: oauthConfig.client_id,
      client_secret: oauthConfig.client_secret,
      grant_type: 'authorization_code',
      code: code,
    }

    const options = {
      uri: oauthConfig.token_endpoint,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      form: formParams,
      json: true,
    }

    const body: any = await doRequest(options)
    console.log('user_id:', body.user_id)
    console.log('team_id:', body.team_id)
    console.log('scope:', body.scope)
    console.log('access_token:', body.access_token)
    console.log('user.name:', body.user.name)
    console.log('user.email:', body.user.email)
    // console.log('body:',body)
    try {
      // ココからは、カスタムトークンを生成してクライアントへ返却する処理
      const customToken = await admin.auth().createCustomToken(body.user_id) // slackのユーザIDをそのままFirebaseAuthのIDのキーにしちゃう。
      console.log(customToken)
      // const customToken = await admin.auth().createCustomToken(body.user_id, {
      //   companyCode: 'pb',
      // })
      const redirect = urljoin(fromUrl, `?token=${customToken}`)
      res.redirect(redirect)
    } catch (error) {
      console.log(error)
    }
  }
})

function doRequest(option) {
  return new Promise((resolve, reject) => {
    request(option, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(body)
      } else {
        reject(error)
      }
    })
  })
}

// https://qiita.com/fukasawah/items/db7f0405564bdc37820e 感謝！
function getRandomString() {
  const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const N = 50
  const randomValue = Array.from(Array(N))
    .map(() => S[Math.floor(Math.random() * S.length)])
    .join('')
  return randomValue
}

async function verifyIdToken(idToken) {
  const decodedToken = await admin.auth().verifyIdToken(idToken)

  const iss_aud_check =
    decodedToken.iss === oidcConfig.iss && decodedToken.aud === oidcConfig.aud
  if (!iss_aud_check) {
    console.log(`iss(Expected): ${oidcConfig.iss}`)
    console.log(`iss(Actual  ): ${decodedToken.iss}`)
    console.log(`aud(Expected): ${oidcConfig.aud}`)
    console.log(`aud(Actual  ): ${decodedToken.aud}`)
    throw new Error('issもしくはaudが想定外でした')
  }
  return decodedToken
}

async function checkCSRF(req, res, sessionId) {
  const state = req.query.state

  const sessionState = await session.getAttributeById(sessionId, 'state')

  session.invalidate(sessionId)
  console.log('requestState: ' + state)
  console.log('sessionState: ' + sessionState)
  return state === sessionState
}

function addCookie(res, key, value) {
  res.setHeader('Cache-Control', 'private') // Hosting経由だと、これがないとset cookieが削除される
  const expiresIn = 60 * 60 * 24
  const options = { maxAge: expiresIn, httpOnly: true }
  // const options = { maxAge: expiresIn, httpOnly: true, secure: true }
  res.setHeader('Set-Cookie', cookie.serialize(key, value, options))
}

const getIdToken = function(req) {
  if (!req.headers.authorization) {
    throw new Error('Authorization ヘッダが存在しません。')
  }
  const match = req.headers.authorization.match(/^Bearer (.*)$/)
  if (match) {
    const idToken = match[1]
    return idToken
  }
  throw new Error(
    'Authorization ヘッダから、Bearerトークンを取得できませんでした。',
  )
}

export const echo = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    const body = req.body
    console.log(JSON.stringify(body))
    console.log(req.headers.authorization)
    try {
      const idToken = getIdToken(req) // Bearerトークン取れるかチェック
      const decodedToken = await verifyIdToken(idToken)

      // ココにロジック
      console.log(decodedToken.uid) // Firebase Authentication 上のユーザUID
      res.send(JSON.stringify(body))
    } catch (error) {
      console.log(error.message)
      res.status(401).send(error.message)
    }
  })
})

// https://firebase.google.com/docs/hosting/functions
