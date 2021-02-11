# tech-lunch-gcp-sample
tech lunch LTで使用したサンプルコードです  

## これは何か
あらゆる定常作業の管理をGCPで行うサンプルです  

## サンプルの技術スタック
- インフラ
  - Cloud Functions
  - Cloud Run
  - Cloud Pub/Sub
  - Cloud Storage
- 言語
  - Node.js
  - Typescript

## サンプルのディレクトリ構造

```
.
└─ app
  ├── functions
  │   └── something-function-name
  ├── gateway
  │   └── src
  └── gcloud-configs
```

functions には、定常作業のロジックを管理する  
定常作業ごとにディレクトリが増える  

gateway には、定常作業のリクエスト受け付けるアプリケーションを管理する  
リクエストのエンドポイントなどを定義する  

gcloud-configs には、JSON形式のサービスアカウントキーを管理します（.gitignore）  

## TODO
- Cloud Buildで自動deployする
- Secret Managerを使って機密データを保持する

## 参考
[Cloud Functions](https://cloud.google.com/functions?hl=ja)  
[Cloud Run](https://cloud.google.com/run?hl=ja)  
[Cloud Pub/Sub](https://cloud.google.com/pubsub?hl=ja)  
[Cloud Storage](https://cloud.google.com/storage?hl=ja)  
[Secret Manager](https://cloud.google.com/secret-manager?hl=ja)  
[Cloud Build](https://cloud.google.com/cloud-build?hl=ja)  
[Service Account](https://cloud.google.com/iam/docs/service-accounts?hl=ja)  
