# sign_in_with_slack

## 概要

内容的には「Sign in with Slack()」のサンプルで、以下のような処理シーケンスを実装しています。

![Sign_in_with_Slack.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/73777/b12893b7-70e7-96e0-d600-aed0ff3afe45.png)


## firebase-tools の準備

```
$ npm install -g firebase-tools
$ source ~/.bash_profile
$ firebase --version
7.12.1

$ firebase login
..
? Allow Firebase to collect CLI usage and error reporting information? Yes
i  To change your data collection preference at any time, run `firebase logout` and log in again.

Visit this URL on this device to log in:
https://accounts.google.com/o/oauth2/auth?...redirect_uri=http%3A%2F%2Flocalhost%3A9005

Waiting for authentication...

✔  Success! Logged in as masatomix@example.com
$
```



## 環境構築

```console
$ git clone https://github.com/masatomix/sign_in_with_slack.git
$ cd sign_in_with_slack
$ npm install

$ cd functions
$ npm install

$ cd ../
$ firebase use --add   // で自分のFirebase プロジェクトを選択してください
```


つぎに、もろもろ環境依存ファイルの更新を行います

### Functions側

```
functions/src/oauthConfig.ts // Sign in with Slack に必要な情報
functions/src/oidcConfig.ts  // Slackでログイン後、Firebaseから発行されたidTokenをチェックするための情報
functions/src/firebase-adminsdk.json // サービスアカウントJSONファイルをFirebaseサイトより取得
```

### WEBアプリ側

```
src/firebaseConfig.js // firebaseアプリを使うときのおなじみ
src/restConfig.js // Sign in with Slack 接続先などの設定ファイル(WEB Client側)
```


```
$ npm run serve

別のターミナルで。
$ cd functions
$ npm run serve
$
```



## 改定履歴

- 初版作成