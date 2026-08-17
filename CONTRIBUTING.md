# Contributing

このリポジトリへの貢献方法について説明します。

## ブランチモデル

- 開発のデフォルトブランチは `master` です。機能追加・修正は必ずフィーチャーブランチを切り、`master` へ向けて Pull Request を作成してください。
- `master` はそのまま利用者向けの `@master` 参照先でもあります。タグ付けされていない開発中のコードを含む場合があるため、本番での利用にはタグ（`@v1` や `@v1.9.0` など）の使用を推奨してください。

## 変更には changeset が必要です

このアクションの挙動に影響する変更を含む PR には、必ず changeset を追加してください。changeset はリリースノートとバージョン番号の自動生成に使われます。

```bash
npx changeset
# もしくは
npm run changeset
```

コマンドを実行すると、

1. 変更対象のパッケージ（このリポジトリではルートパッケージのみ）を確認されます。
2. bump の種類（patch / minor / major）を選択します。
3. 変更内容の説明（そのままリリースノートになります）を入力します。

実行後に `.changeset/` 配下に生成される Markdown ファイルをコミットして、PR に含めてください。

### bump の種類の選び方

| 種類 | 目安 | 例 |
| --- | --- | --- |
| `patch` | 既存の挙動を変えないバグ修正・軽微な修正 | ラベル判定の誤りを修正、依存パッケージの更新 |
| `minor` | 後方互換性のある新機能・オプションの追加 | 新しい input（オプション）の追加、既存動作を壊さない挙動の改善 |
| `major` | 既存の input / output / デフォルト挙動に互換性のない変更 | input の削除・名前変更、デフォルト値の変更、出力フォーマットの変更 |

迷った場合は保守的に（patch より minor、minor より major）倒れて構いません。レビューで調整します。

## changeset を省略できるケース

ドキュメントのみの変更、CI 設定のみの変更、動作に影響しないリファクタリングなど、リリースを必要としない PR では changeset は不要です。

- **リリースに関係ないパスのみを変更する PR は、ラベルなしで自動的にスキップされます。** `Changeset Check` ワークフローは PR 内で変更されたファイルが `.github/**`・`.changeset/**`・`.husky/**`・`.vscode/**`・`.devcontainer/**`・`.cursor/**`・`readmeImages/**`・`**/*.md`・`.editorconfig`・`.prettierrc`・`.prettierignore`・`.gitmessages`・`.gitignore`・`docker-compose.yml`・`eslint.config.js`・`jest.config.js`・`tsconfig.json` のいずれかにすべて該当する場合、出荷されるコード（`src/**`・`dist/**`・`action.yml`・`package.json`・`package-lock.json` など）が一切変更されていないとみなし、changeset を要求しません。ラベルの付与は不要です。
- 上記の許可リストに含まれないパス（例えば `src/**` の一部だけでも）を 1 つでも変更する場合は、通常どおり changeset が必要です。そのような PR で、それでもリリース不要と判断する場合は `skip-changeset` ラベルを付与してください。
- `dependabot[bot]` が作成した PR は自動的にスキップされます（`skip-changeset` ラベルは不要です）。
- 上記のいずれにも該当しない PR で changeset が見つからない場合、`Changeset Check` ワークフローが失敗します。CI のサマリーに対応方法が表示されるので、そちらに従ってください。

## リリースフロー

1. changeset を含む PR が `master` にマージされます。
2. `master` への push をトリガーに [changesets/action](https://github.com/changesets/action) が動作し、未リリースの changeset があれば `chore(release): version packages` という Pull Request を自動的に作成・更新します。この PR には `package.json` のバージョン更新、`CHANGELOG.md` の更新、`.changeset/*.md` の削除が含まれます。
3. この自動生成 PR をレビューし、`master` にマージします。
4. マージにより再度リリースワークフローが実行され、以下が自動的に行われます。
   - `npm run build` を実行し、更新された `dist/` を `master` にコミット
   - `vX.Y.Z` タグの作成
   - `vX`・`vX.Y` の移動タグ（moving tag）の更新
   - GitHub Release の作成（`CHANGELOG.md` の該当バージョンのセクションをリリースノートとして使用）

上記のうちステップ 4 は、未リリースの changeset が残っておらず、かつそのバージョンのタグがまだ存在しない場合にのみ実行されます。そのため、無関係な push でリリースが誤って走ることはありません。

## メンテナー向けセットアップ

- リポジトリに `skip-changeset` ラベルを作成しておいてください（まだ存在しない場合、PR への付与ができません）。
- `Changeset Check` ワークフローのジョブ名（`Changeset Check`）を `master` ブランチのブランチ保護ルールで required status check に設定できます。
- 注意: `GITHUB_TOKEN` によって作成された Pull Request（自動生成される `chore(release): version packages` PR）は、既定では他のワークフローをトリガーしません。そのため `Changeset Check` はこの自動リリース PR 上では実行されず、required status check に設定していると、この PR がいつまでも green にならず自動マージできない状態になります。対処法は次のいずれかです。
  - 管理者権限（admin merge）でこの PR をマージする。
  - リポジトリに `RELEASE_PAT`（`contents: write` / `pull-requests: write` などの権限を持つ Personal Access Token）を Secret として追加する。ワークフローは `secrets.RELEASE_PAT || secrets.GITHUB_TOKEN` を使うようにすでに実装されているため、Secret を追加するだけで自動的に有効になり、ワークフロー側の変更は不要です。
- リリースジョブは `master` に直接 `dist/` の再ビルドコミットを push します（force-push ではなく通常の fast-forward push）。`master` のブランチ保護ルールが「PR 経由のみ許可」になっていると、この push も拒否されるため、`github-actions`（もしくは `RELEASE_PAT` に紐づくアクター）をブランチ保護の bypass 対象に含めておいてください。
