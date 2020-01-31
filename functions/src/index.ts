import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import request from 'request'
import session from './session'
import oauthConfig from './oauthConfig'
import oidcConfig from './oidcConfig'
import * as cookie from 'cookie'
import urljoin from 'url-join'


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


export const chat = functions.https.onRequest(async (req, res) => {
  await sendSlack()
  res.send('ok')
})

export const chat_pub = functions.pubsub
  .topic('slackChatTopic')
  .onPublish(async message => {
    await sendSlack()
  })

// $ gcloud pubsub topics publish slackChatTopic  --message '{"name":"Xenia"}'

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const oauth2 = functions.https.onRequest(async (req, res) => {

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
    const reqIdToken = req.query.idToken
    if (!reqIdToken) {
      console.log('codeがないのに、req.query.idToken もない')
      res.status(400).send('req.query.idToken が取れませんでした')
      return
    }

    // idTokenをチェックする必要あり
    try {
      await verifyIdToken(reqIdToken)
    } catch (error) {
      console.log(error.message)
      res.status(400).send('req.query.idToken が正しくありません<br />' + error.message)
      return
    }
    addCookie(res, 'idToken', reqIdToken)

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
      oauthConfig.scope
    ].join('')

    session.setAttributeById(reqIdToken, 'state', randomValue)
    res.redirect(authorization_endpoint_uri)
  } else {
    // そもそもidTokenがなかったら後続を続ける意味がないので、正当性チェック verifyIdToken もここで実施
    const cookies = cookie.parse(req.headers.cookie as string)
    const idToken = cookies.idToken

    let userId = ''
    // idTokenをチェックする必要あり
    try {
      userId = await verifyIdToken(idToken)
    } catch (error) {
      console.log(error.message)
      res.status(400).send('cookies.idToken が正しくありません。そもそも取得できなかったかも。<br />' + error.message)
      return
    }

    const csrf = await checkCSRF(req, res, idToken)
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
      code: code
    }

    const options = {
      uri: oauthConfig.token_endpoint,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      form: formParams,
      json: true
    }

    const body: any = await doRequest(options)

    console.log(userId)

    admin
      .firestore()
      .collection('slackToken')
      .doc(userId)
      .set(body)

    try {
      const customToken = await admin.auth().createCustomToken(body.user_id, {
        companyCode: 'pb',
      })
      const redirect = `http://localhost:8080/about?token=${customToken}`
      res.redirect(redirect)

    } catch (error) {
      console.log(error)
    }

    // res.send('登録完了。ブラウザ閉じちゃってください。')
  }
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
      oauthConfig.scope
    ].join('')

    const sessionId = getRandomString()
    addCookie(res, 'sessionId', sessionId) // クライアントとセッションを「sessionId」で繋ぐ

    const fromUrl = req.headers.referer as string
    console.log(fromUrl)
    session.setAttributeById(sessionId, 'state', randomValue)
    session.setAttributeById(sessionId, 'fromUrl', fromUrl)

    // const fromUrl = req.query.fromUrl
    // console.log(fromUrl)
    // if (fromUrl) {
    //   session.setAttributeById(sessionId, 'fromUrl', fromUrl)
    // }

    res.redirect(authorization_endpoint_uri)
  } else {
    const cookies = cookie.parse(req.headers.cookie as string)
    const sessionId = cookies.sessionId

    console.log('sessionId:', sessionId)
    const fromUrl = await session.getAttributeById(sessionId, 'fromUrl') // 場合によっては渡せないことも考慮が必要。
    console.log('fromUrl:', fromUrl)

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
      code: code
    }

    const options = {
      uri: oauthConfig.token_endpoint,
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      form: formParams,
      json: true
    }

    const body: any = await doRequest(options)
    try {
      // ココからは、カスタムトークンを生成してクライアントへ返却する処理
      const customToken = await admin.auth().createCustomToken(body.user_id, {
        // companyCode: 'pb',
      })
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
  return decodedToken.uid
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

async function sendSlack() {
  const querySnapshot = await admin
    .firestore()
    .collection('slackToken')
    .get()

  querySnapshot.forEach(doc => {
    const fbUserId = doc.id
    const jsonData = doc.data()

    const option = {
      url: 'https://slack.com/api/chat.postMessage',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${jsonData.access_token}`
      },
      json: {
        channel: '@papa',
        text: `${fbUserId} です、今日は！`
      }
    }
    request(option, (error, response, body) => {
      if (error) {
        console.log('error:', error)
        return
      }
      if (response && body) {
        console.log('status Code:', response && response.statusCode)
        console.log(body)
      }
    })
  })
}

// https://firebase.google.com/docs/hosting/functions
