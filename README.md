# RPI4 YOLO最適化学習進捗トラッカー

ラズパイ4でのYOLO最適化学習の進捗を管理するWebアプリケーション

## 機能

- 📊 学習進捗の可視化とトラッキング
- ✅ タスクチェックリストによる進捗管理
- 🧪 実験結果の記録と分析
- 📈 パフォーマンスメトリクスの可視化
- 💾 ローカルストレージによるデータ永続化

## 技術スタック

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Recharts (データ可視化)
- Lucide React (アイコン)

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

## デプロイ

Vercelへのデプロイ:

```bash
# Vercel CLIのインストール（未インストールの場合）
npm i -g vercel

# デプロイ
vercel
```

## 使い方

1. **学習進捗タブ**: 各フェーズのタスクを完了済みとしてマーク
2. **実験結果タブ**: 実験結果を記録し、パフォーマンスの推移を確認
3. **チャート表示**: 実験結果の時系列変化を可視化

## プロジェクト構造

```
rpi-progress-tracker/
├── app/
│   ├── components/      # UIコンポーネント
│   ├── lib/            # ユーティリティとデータ
│   ├── globals.css     # グローバルスタイル
│   ├── layout.tsx      # ルートレイアウト
│   └── page.tsx        # ホームページ
├── public/             # 静的ファイル
└── package.json        # プロジェクト設定
```