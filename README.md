# RPI4 YOLO最適化学習進捗トラッカー

ラズパイ4でのYOLO最適化学習の進捗を管理するWebアプリケーション

## 機能

- 📊 学習進捗の可視化とトラッキング
- ✅ タスクチェックリストによる進捗管理
- 🧪 実験結果の記録と分析
- 📈 パフォーマンスメトリクスの可視化
- 💾 ローカルストレージによるデータ永続化
- ➕ 新規タスク手動追加・編集・削除機能
- 🤖 **AI自動タスク生成（Gemini API）**
- 📄 Markdownファイルからのタスク抽出
- ✍️ メモからのタスク自動生成
- ☁️ **デバイス間リアルタイム同期（Supabase）**
- 🔐 シンプル認証システム
- 📱 オフライン対応と自動復旧

## 技術スタック

- Next.js 13.5
- React 18
- TypeScript
- Tailwind CSS
- Supabase (認証・データベース)
- Recharts (データ可視化)
- Lucide React (アイコン)
- Google Generative AI (Gemini)

## セットアップ

```bash
# 依存関係のインストール
npm install

# 環境変数の設定（AI機能を使用する場合）
cp .env.local.example .env.local
# .env.local を編集してGEMINI_API_KEYを設定

# 開発サーバーの起動
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

### AI機能の設定

AI自動タスク生成機能を使用するには、Google Gemini APIキーが必要です：

1. [Google AI Studio](https://makersuite.google.com/app/apikey) でAPIキーを取得
2. `.env.local` ファイルに設定：
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### デバイス間同期の設定

デバイス間でデータを同期するには、Supabaseの設定が必要です：

1. [Supabase](https://supabase.com) でプロジェクトを作成
2. SQL Editorで `supabase-schema.sql` を実行
3. `.env.local` に設定を追加：
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. サーバーを再起動

## デプロイ

Vercelへのデプロイ:

```bash
# Vercel CLIのインストール（未インストールの場合）
npm i -g vercel

# デプロイ
vercel
```

## 使い方

### 基本機能
1. **学習進捗タブ**: 各フェーズのタスクを完了済みとしてマーク
2. **実験結果タブ**: 実験結果を記録し、パフォーマンスの推移を確認
3. **チャート表示**: 実験結果の時系列変化を可視化

### 新規タスク追加
1. **手動追加**: 「新規タスク」ボタンから詳細を入力して追加
2. **AI生成**: 「AI生成」ボタンから以下の方法でタスクを自動生成
   - **テキスト入力**: 研究メモややりたいことを自由記述
   - **ファイルアップロード**: Markdownファイル (.md) をアップロード

### AI機能の活用例
```
# 例: テキスト入力
「ラズパイ4でYOLOv8を動かして、遺伝的アルゴリズムで最適化したい。
推論速度15FPS以上を目指し、温度監視も実装したい。」

# 自動的に以下のようなタスクが生成されます：
- YOLOv8環境構築とテスト実行
- 遺伝的アルゴリズム実装
- 温度監視システム構築
- ベンチマーク測定とFPS最適化
```

### タスク管理
- ✏️ **編集**: タスクカードの編集ボタンで内容修正
- 🗑️ **削除**: タスクカードの削除ボタンで不要なタスクを削除
- ✅ **完了**: チェックボックスで完了状態を管理

### デバイス間同期
- 🔐 **ログイン**: 右上のログインボタンからアカウント作成・ログイン
- ☁️ **自動同期**: ログイン状態でタスクや実験データが自動同期
- 📱 **複数デバイス**: PC、タブレット、スマホで同じデータにアクセス
- 🔄 **リアルタイム**: データ変更が即座に他デバイスに反映
- 📶 **オフライン対応**: インターネット接続復旧時に自動同期

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