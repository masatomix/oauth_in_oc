# my_vue_template

## 初回のプロジェクト作成

```console
$ vue create my_vue_template
Vue CLI v3.11.0
┌────────────────────────────┐
│  Update available: 3.12.0  │
└────────────────────────────┘

? Please pick a preset:
  default (babel, eslint)
❯ Manually select features

? Please pick a preset: Manually select features
? Check the features needed for your project:
 ◉ Babel
 ◯ TypeScript
 ◯ Progressive Web App (PWA) Support
 ◉ Router
 ◉ Vuex
 ◯ CSS Pre-processors
 ◉ Linter / Formatter
 ◯ Unit Testing
❯◯ E2E Testing


? Check the features needed for your project: Babel, Router, Vuex, Linter

? Use history mode for router? (Requires proper server setup for index fallback in production) Yes

? Pick a linter / formatter config:
  ESLint with error prevention only
  ESLint + Airbnb config
  ESLint + Standard config
❯ ESLint + Prettier


? Pick additional lint features: (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◉ Lint on save
 ◯ Lint and fix on commit

? Where do you prefer placing config for Babel, PostCSS, ESLint, etc.? (Use arrow keys)
❯ In dedicated config files
  In package.json

? Where do you prefer placing config for Babel, PostCSS, ESLint, etc.? In dedicated config files
? Save this as a preset for future projects? (y/N)


✨  Creating project in /private/tmp/my_vue_template.
🗃  Initializing git repository...
⚙  Installing CLI plugins. This might take a while...

⸨ ░░░░░░░░░░░░░░░░░⸩ ⠸ fetchMetadata: sill pacote range manifest for brace-expansion@^1.1.7 fetched in 65ms

......

⚓  Running completion hooks...

📄  Generating README.md...

🎉  Successfully created project my_vue_template.
👉  Get started with the following commands:

 $ cd my_vue_template
 $ npm run serve

$
```


## フォーマッタの設定

./.eslintrc.js を下記の通りに。

```console:./.eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier",'plugin:prettier/recommended',],
  plugins: ['vue'],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    'prettier/prettier': [
      'error',
      {
        semi:false,
        singleQuote: true,
        trailingComma: 'all',
      },
    ],
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
```

これでコマンドからは、トップディレクトリで

```console
$ ./node_modules/.bin/eslint --fix ./src/views/*.vue
$ ./node_modules/.bin/eslint --fix ./src/*.js
```

などとやれば、セミコロンナシのシングルクォートにフォーマットされるぽい。
VSCode上からは、とりあえず下記の機能拡張を入れてみた。

- ESLint
- Prettier - Code formatter
- Vetur
- Japanese Language Pack for Visual Studio Code

んで、設定ファイルはこんな感じで。

```console
$ cat ~/Library/Application\ Support/Code/User/settings.json
{
  "editor.renderControlCharacters": true,
  "editor.fontSize": 14,
  "workbench.colorTheme": "Visual Studio Dark",
  "[javascript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
      "editor.defaultFormatter": "vscode.typescript-language-features"
  },
  "[vue]": {
      "editor.defaultFormatter": "octref.vetur"
  },
  "editor.minimap.enabled": false,
  "prettier.singleQuote": true,
  "prettier.semi": false,
  "eslint.autoFixOnSave": true,
  "eslint.validate": [
    {
      "language": "vue",
      "autoFix": true
    }
  ],

  "vetur.format.defaultFormatter.js": "none",
  "prettier.trailingComma": "all",
}
```

参考: 

- https://qiita.com/fukasawah/items/cfff8957f3956850dc7e
- https://actyway.wordpress.com/2019/01/25/vscode-prettier-configuration/


これで、*.vueファイル群は保存時に自動にESLintでフォーマットされ(シングルクォート、セミコロンナシ)。
*.jsファイル群は、cmd shift F で手動フォーマットして運用出来そう。
コマンドでやった場合と、同じ結果が得られていると思われる。

ちなみに eslint コマンドは、 ``npm run lint`` で実行出来るので、コミット前にコレやる、がイイかな。。

```console
$ npm run lint

> my_vue_template@0.1.0 lint /Users/xx/git/my_vue_template
> vue-cli-service lint

The following files have been auto-fixed:

  src/App.vue
  src/components/HelloWorld.vue
  src/main.js
  src/router.js
  src/store.js
  src/views/Home.vue
  .eslintrc.js
  babel.config.js
  postcss.config.js

 DONE  All lint errors auto-fixed.
$ 
```


## Vuetifyを入れた手順

https://vuetifyjs.com/ja/getting-started/quick-start を参考に。ひとつひとつ


```console
$ vue add vuetify

📦  Installing vue-cli-plugin-vuetify...

+ vue-cli-plugin-vuetify@1.0.1
added 4 packages from 7 contributors and audited 24382 packages in 23.664s
found 0 vulnerabilities

✔  Successfully installed plugin: vue-cli-plugin-vuetify

? Choose a preset: 
❯ Default (recommended) 
  Prototype (rapid development) 
  Configure (advanced) 

added 7 packages from 5 contributors in 17.058s
⠋  Running completion hooks...
> my_vue_template@0.1.0 lint /Users/xx/git/my_vue_template
> vue-cli-service lint

The following files have been auto-fixed:

  src/App.vue
  src/components/HelloWorld.vue
  src/main.js
  src/plugins/vuetify.js
  src/views/Home.vue
  vue.config.js

 DONE  All lint errors auto-fixed.
⚓  Running completion hooks...

✔  Successfully invoked generator for plugin: vue-cli-plugin-vuetify
   The following files have been updated / added:

     src/assets/logo.svg
     src/plugins/vuetify.js
     vue.config.js
     README.md
     package-lock.json
     package.json
     public/index.html
     src/App.vue
     src/components/HelloWorld.vue
     src/main.js
     src/views/Home.vue

   You should review these changes with git diff and commit them.

$
```



```console
$ npm install @mdi/font -D

+ @mdi/font@4.5.95
added 1 package from 1 contributor and audited 26553 packages in 13.394s
found 0 vulnerabilities
$ 

src/plugins/vuetify.js を追記
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader 追記
```

アイコン対応(なんだかマテリアルなアイコンがでない。)
http://nullpoint.hatenablog.com/entry/2019/08/24/154218

```
$ npm install material-design-icons-iconfont -D

src/plugins/vuetify.js も追記
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
```



## Firebase インストール、Vuex追加機能 インストール

```console
$ npm install --save firebase vuex-persistedstate
```


## Functions追加


```
$ pwd
/Users/xxx/git/my_vue_template
$ firebase init functions

     ######## #### ########  ######## ########     ###     ######  ########
     ##        ##  ##     ## ##       ##     ##  ##   ##  ##       ##
     ######    ##  ########  ######   ########  #########  ######  ######
     ##        ##  ##    ##  ##       ##     ## ##     ##       ## ##
     ##       #### ##     ## ######## ########  ##     ##  ######  ########

You're about to initialize a Firebase project in this directory:

  /Users/xxx/git/my_vue_template

Before we get started, keep in mind:

  * You are initializing in an existing Firebase project directory

=== Project Setup

First, let's associate this project directory with a Firebase project.
You can create multiple project aliases by running firebase use --add, 
but for now we'll just set up a default project.

? Please select an option: Use an existing project
? Select a default Firebase project for this directory: fb2samples (fb2samples)
i  Using project fb2samples (fb2samples)

=== Functions Setup

A functions directory will be created in your project with a Node.js
package pre-configured. Functions can be deployed with firebase deploy.

? What language would you like to use to write Cloud Functions? TypeScript
? Do you want to use TSLint to catch probable bugs and enforce style? Yes
✔  Wrote functions/package.json
✔  Wrote functions/tslint.json
✔  Wrote functions/tsconfig.json
✔  Wrote functions/src/index.ts
✔  Wrote functions/.gitignore
? Do you want to install dependencies with npm now? Yes

> protobufjs@6.8.8 postinstall /Users/xxx/git/my_vue_template/functions/node_modules/protobufjs
> node scripts/postinstall

npm notice created a lockfile as package-lock.json. You should commit this file.
added 268 packages from 186 contributors and audited 717 packages in 23.632s
found 0 vulnerabilities


i  Writing configuration info to firebase.json...
i  Writing project information to .firebaserc...

✔  Firebase initialization complete!
$ 
```


```
$ cd functions
$ cat src/index.ts 
import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
$

コード修正して、、、。

 
$ npm run deploy
```

## CORS追加

```console
$ pwd
/Users/xxx/git/my_vue_template/functions
$ npm install cors --save
$ npm i --save-dev npm install @types/cors
```

## TSLint インストール

Vue側でTSをトランスパイラするためのツール導入(TSLintも)
Functionsでも使用するUtilityを作成中で、それがTypeScriptで作成している。
Vueから呼び出すには、jsへトランスパイルする必要がある。そのツールのインストール。

```console
$ pwd
/Users/xxx/git/my_vue_template
$ npm install --save-dev tslint typescript

+ tslint@5.20.0
+ typescript@3.6.4
added 5 packages from 3 contributors and audited 26884 packages in 13.3s
found 0 vulnerabilities

$ cat package.json 
{
  ...
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "tsc": "tsc --esModuleInterop ",    ← 追加した
    "lint": "vue-cli-service lint"
  },
... 
$
```

とりあえず、``./node_modules/.bin/tslint --fix --project tsconfig.json ``で、vue側もFunctionsがわもlintされそう。
もしくはVSCode上でも、Prettierをフォーマッタとして適用できそう(デフォルトをそれに設定する)

参考: https://qiita.com/tapioca24/items/ec942f4c29ccd6465fab




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
- 0.9.0 Prettier(Formatter),vuetify,Firebase,Functions,CORS,TSC/TSLintなどの設定。 
