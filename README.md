# sign_in_with_slack

## 初回のプロジェクト作成

```console
$ git clone https://github.com/masatomix/sign_in_with_slack.git
$ cd sign_in_with_slack
$ npm install

もろもろ環境依存ファイルの更新(下記)

functions/src/oauthConfig.ts // Sign in with Slack に必要な情報
functions/src/firebase-adminsdk.json // サービスアカウントJSONファイルをFirebaseサイトより取得
src/firebaseConfig.js // firebaseアプリを使うときのおなじみ
src/restConfig.js // Sign in with Slack 接続先などの設定ファイル(WEB Client側)

$ firebase use --add   // で自分のプロジェクトを選択してください
$ npm run serve
$
```


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## 改定履歴

- 初版作成