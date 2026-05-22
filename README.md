# Wasp — Obsidian Theme

A dark-focused Obsidian theme with gold accents (`#f8c537`, `#242424`). Light mode is supported but less customized than dark.

## Dark mode

![Wasp dark mode](img/wasp-dark.png)

## Light mode

![Wasp light mode](img/wasp-light.png)

## Install

Wasp is available in **Obsidian Community Themes**.

1. Open **Settings → Appearance → Themes → Manage**.
2. Search for **Wasp** by Santi Younger.
3. Select **Use** (and **Overwrite** if prompted).

### Manual install (development)

Clone this repository into your vault’s themes folder. The folder name must match `name` in `manifest.json` (**Wasp**):

```bash
cd path/to/vault/.obsidian/themes
git clone https://github.com/santiyounger/Wasp-Obsidian-Theme.git Wasp
```

Restart Obsidian after changing `manifest.json`. Reload the theme or press Ctrl+R after editing `theme.css`.

## Repository layout

| File | Purpose |
|------|---------|
| `theme.css` | Theme styles (installed by Obsidian) |
| `manifest.json` | Theme metadata for the community directory |
| `versions.json` | Maps theme versions to minimum Obsidian versions |
| `.github/workflows/release-version.yml` | Creates a draft release when `manifest.json` changes on `main` |
| `version-bump.mjs` | Keeps `manifest.json` and `versions.json` in sync with `package.json` |

See [Build a theme](https://docs.obsidian.md/Themes/App+themes/Build+a+theme) and [Submit your theme](https://docs.obsidian.md/Themes/App+themes/Submit+your+theme) in the Obsidian developer docs.

## Publishing a release

Community installs download `manifest.json` and `theme.css` from a **GitHub release** whose tag matches `version` in `manifest.json` (semver `x.y.z`, no `v` prefix). Release assets are **only** those two files — not `README.md`.

### Automated (recommended)

When you **push to `main` with a changed `manifest.json`**, GitHub Actions creates a **draft** release tagged with that `version`, with `manifest.json` and `theme.css` attached.

1. Bump `version` in `manifest.json` (e.g. `1.0.0` → `1.0.1`).

2. Add the same version to `versions.json` (value = `minAppVersion`):

   ```json
   {
     "1.0.0": "1.0.0",
     "1.0.1": "1.0.0"
   }
   ```

   Or run `npm version patch` to update `package.json`, `manifest.json`, and `versions.json` together.

3. Commit and push:

   ```bash
   git add manifest.json versions.json theme.css
   git commit -m "Release 1.0.1"
   git push origin main
   ```

4. On GitHub: **Actions** → **Publish new theme version** → then **Releases** → open the new **Draft** and verify **2 assets**.

5. When ready: [community.obsidian.md](https://community.obsidian.md) (claim theme, scorecard) → then **Publish release** on GitHub so users can install.

Until step 5, the release stays a draft. Each release needs a **new** `version` number — re-pushing without changing `manifest.json` will not run the workflow.

### Manual

1. Bump `version` in `manifest.json` and add an entry to `versions.json`.
2. Create a GitHub release with a tag equal to that version.
3. Attach **only** `manifest.json` and `theme.css` to the release.

## Development

Edit `theme.css` at the repository root. Wasp-specific extras (plugin-tabs, custom `hr`, button variables) live after the “End of main theme” comment.

Use `body` for variables shared across light and dark. Use `.theme-dark` and `.theme-light` when a value should change with the base color scheme. For graph view, set `--interactive-accent-rgb` as comma-separated RGB (not hex) and use `rgb(var(--interactive-accent-rgb))` on graph nodes.

## License

MIT — see [LICENSE](LICENSE).
