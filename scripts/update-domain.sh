#!/bin/bash

# Script to update all domain references in the codebase
# Usage: ./scripts/update-domain.sh <new-domain>
# Example: ./scripts/update-domain.sh tresraices.com

set -e

if [ -z "$1" ]; then
    echo "Error: Please provide a domain name"
    echo "Usage: ./scripts/update-domain.sh <new-domain>"
    echo "Example: ./scripts/update-domain.sh tresraices.com"
    exit 1
fi

NEW_DOMAIN="$1"
OLD_DOMAIN="tresraices.netlify.app"

echo "🔄 Updating domain references..."
echo "   Old: https://$OLD_DOMAIN"
echo "   New: https://$NEW_DOMAIN"
echo ""

# Confirm with user
read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 1
fi

# Update app/layout.tsx
echo "📝 Updating app/layout.tsx..."
sed -i '' "s|https://$OLD_DOMAIN|https://$NEW_DOMAIN|g" app/layout.tsx

# Update any other files with hardcoded URLs
echo "📝 Searching for other references..."
grep -r "$OLD_DOMAIN" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git --exclude=pnpm-lock.yaml . || echo "No other references found"

echo ""
echo "✅ Domain update complete!"
echo ""
echo "Next steps:"
echo "1. Review changes: git diff"
echo "2. Commit: git add . && git commit -m 'Update domain to $NEW_DOMAIN'"
echo "3. Deploy: git push"
echo "4. Verify site loads at https://$NEW_DOMAIN"
echo "5. Re-run Facebook Sharing Debugger"
