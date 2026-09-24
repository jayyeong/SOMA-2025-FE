#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mode="${1:---dry-run}"
[[ "$mode" == '--dry-run' || "$mode" == '--deploy' ]] || { echo 'Use --dry-run or --deploy'; exit 1; }
if [[ "$mode" == '--deploy' ]]; then
  [[ "${GITHUB_REF:-}" == 'refs/heads/master' && "${GITHUB_EVENT_NAME:-}" == 'workflow_dispatch' ]] || { echo 'Deploy only through the master workflow dispatch'; exit 1; }
  [[ "${RELEASE_ID:-}" =~ ^[0-9]+-[0-9]+$ ]] || { echo 'Missing release ID'; exit 1; }
fi
[[ "$(aws sts get-caller-identity --query Account --output text)" == '696592521871' ]] || { echo 'Wrong AWS account'; exit 1; }
python3 scripts/verify-build.py
destination='s3://kuadarchive/2025/'
backup='s3://kuadarchive-backup-696592521871/releases/2025/'
if [[ "$mode" == '--dry-run' ]]; then
  aws s3api head-object --bucket kuadarchive --key 2025/index.html --query ContentLength
  aws s3 sync build/ "$destination" --exclude index.html --dryrun --no-progress
  echo 'Dry run complete: production unchanged.'
  exit 0
fi
aws s3 cp "${destination}index.html" "${backup}${RELEASE_ID}/index.html" --copy-props none --only-show-errors
aws s3 sync build/ "$destination" --exclude index.html --cache-control 'public,max-age=3600' --only-show-errors
aws s3 cp build/index.html "${destination}index.html" --content-type 'text/html; charset=utf-8' --cache-control 'no-cache,max-age=0,must-revalidate' --only-show-errors
invalidation=$(aws cloudfront create-invalidation --distribution-id ESQ6WE0AL18SD --paths '/2025/*' --query Invalidation.Id --output text)
aws cloudfront wait invalidation-completed --distribution-id ESQ6WE0AL18SD --id "$invalidation"
live_file=$(mktemp)
trap 'rm -f "$live_file"' EXIT
curl --fail --silent --show-error https://kuadarchive.com/2025/ -o "$live_file"
cmp build/index.html "$live_file"
echo 'Published and verified https://kuadarchive.com/2025/'
