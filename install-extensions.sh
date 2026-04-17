#!/bin/bash
EXTENSIONS=(
  "esbenp.prettier-vscode"
  "dbaeumer.vscode-eslint"
  "bradlc.vscode-tailwindcss"
  "yoavbls.pretty-ts-errors"
  "usernamehw.errorlens"
  "wix.vscode-import-cost"
  "streetsidesoftware.code-spell-checker"
  "streetsidesoftware.code-spell-checker-german"
  "PKief.material-icon-theme"
  "naumovs.color-highlight"
  "ms-playwright.playwright"
  "redhat.vscode-yaml"
  "yzhang.markdown-all-in-one"
  "humao.rest-client"
  "drizzle-team.drizzle-vscode"
  "eamodio.gitlens"
  "mikestead.dotenv"
  "csstools.postcss"
  "DavidAnson.vscode-markdownlint"
  "tamasfe.even-better-toml"
)
INSTALLED=$(code --list-extensions 2>/dev/null)
COUNT=0
for ext in "${EXTENSIONS[@]}"; do
  if echo "$INSTALLED" | grep -qi "^${ext}$"; then
    echo "  [skip] $ext (bereits installiert)"
  else
    echo "  [install] $ext"
    code --install-extension "$ext" --force >/dev/null 2>&1 && echo "    OK" || echo "    FAILED"
    ((COUNT++))
  fi
done
echo ""
echo "Fertig. $COUNT Extensions neu installiert."
