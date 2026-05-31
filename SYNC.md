# Syncing with upstream three.js

**three.js Ascended** is a fork of [three.js](https://github.com/mrdoob/three.js).
To keep it current, periodically merge upstream releases. The only files that
regularly conflict are the ones changed by the rebrand.

## One-time setup

Confirm the `upstream` remote exists:

```bash
git remote -v
# upstream  https://github.com/mrdoob/three.js.git
# origin    https://github.com/mrigankad/threejs-ascended.git
```

If missing:

```bash
git remote add upstream https://github.com/mrdoob/three.js.git
```

## Pull a new three.js release

```bash
git checkout dev
git fetch upstream
git merge upstream/dev
```

## Resolving the expected conflicts

The rebrand intentionally diverges from upstream in a few files. When merging,
**keep the Ascended values** in:

| File | Keep |
|------|------|
| `package.json` | Ascended `name`, `version`, `description`, repo/bugs/homepage URLs, `forkedFrom`, the `./addons/ascended` export, and `addons/ascended` in `files`. Take upstream changes to dependencies and other scripts. |
| `README.md` | The Ascended hero, badges, and intro block at the top. Take upstream changes below the `---` divider. |
| `LICENSE` | Unchanged — always keep three.js's MIT license intact. |

The `addons/ascended/` directory is additive and never conflicts with upstream.

## After merging

```bash
npm ci
npm run lint
npm run test-ascended      # Ascended helper layer
npm run build              # regenerate build/ artifacts from the new src/
```

Then bump the `forkedFrom.version` in `package.json` to the new three.js
release (e.g. `r185`) and note it in `CHANGELOG.md`.
