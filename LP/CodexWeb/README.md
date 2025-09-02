# CodexWeb — LP

静的なランディングページです。`index.html` を開くだけで閲覧できます。

- 主要ファイル:
  - `index.html` — マークアップ本体
  - `assets/css/styles.css` — スタイル（ダーク/ライト、自動/手動切替）
  - `assets/js/main.js` — スクロール演出、ターミナル型デモ、コピー機能

## ローカルで見る

1. ファイルを直接開く: `index.html`
2. もしくは簡易HTTPサーバー:
   - Python: `python -m http.server` → `http://localhost:8000`
   - Node (任意): `npx serve .`

## カスタマイズ

- 色やグラデーション: `styles.css` の `--accent` / `--accent-2` を調整
- セクション文言: `index.html` の各セクションを編集
- デモ文面: `assets/js/main.js` の `lines` 配列を変更
- テーマ初期値: `main.js` 冒頭の `saved` ロジックを調整

## デプロイ

GitHub Pages / Vercel / Netlify など任意の静的ホスティングに、そのままアップロード可能です。

