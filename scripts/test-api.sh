#!/usr/bin/env bash
# Quick API testing script for Tres Raíces

set -e

BASE_URL="${1:-http://localhost:5173}"
ADMIN_KEY="${NEXT_PUBLIC_ADMIN_KEY:-change-me}"

echo "🧪 Testing Tres Raíces API"
echo "Base URL: $BASE_URL"
echo ""

# Test 1: Menu API - Guadalajara
echo "1️⃣  Testing GET /api/menu?region=guadalajara"
curl -s "$BASE_URL/api/menu?region=guadalajara" | jq -r 'keys | .[]' | head -5 || echo "❌ Failed"
echo ""

# Test 2: Menu API - Colima
echo "2️⃣  Testing GET /api/menu?region=colima"
curl -s "$BASE_URL/api/menu?region=colima" | jq -r 'keys | .[]' | head -5 || echo "❌ Failed"
echo ""

# Test 3: Invalid Region
echo "3️⃣  Testing invalid region (should return 400)"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/menu?region=invalid")
if [ "$HTTP_CODE" = "400" ]; then
  echo "✅ Correctly returned 400"
else
  echo "❌ Expected 400, got $HTTP_CODE"
fi
echo ""

# Test 4: Parse API - No Auth
echo "4️⃣  Testing POST /api/parse-menu without auth (should return 401)"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/parse-menu" \
  -H "Content-Type: application/json" \
  -d '{"storageUrl":"https://example.com/test.pdf"}')
if [ "$HTTP_CODE" = "401" ]; then
  echo "✅ Correctly returned 401"
else
  echo "❌ Expected 401, got $HTTP_CODE"
fi
echo ""

# Test 5: Parse API - Missing storageUrl
echo "5️⃣  Testing POST /api/parse-menu with auth but no storageUrl (should return 400)"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/parse-menu" \
  -H "Content-Type: application/json" \
  -H "x-admin-key: $ADMIN_KEY" \
  -d '{}')
if [ "$HTTP_CODE" = "400" ]; then
  echo "✅ Correctly returned 400"
else
  echo "❌ Expected 400, got $HTTP_CODE"
fi
echo ""

# Test 6: Check menu structure
echo "6️⃣  Checking menu data structure for Guadalajara"
SAMPLE=$(curl -s "$BASE_URL/api/menu?region=guadalajara" | jq -r 'to_entries | .[0] | .value[0]')
if echo "$SAMPLE" | jq -e '.item and .price' > /dev/null 2>&1; then
  echo "✅ Menu items have correct structure"
  echo "Sample item:"
  echo "$SAMPLE" | jq '.'
else
  echo "❌ Menu structure invalid"
fi
echo ""

echo "✨ Tests complete!"
echo ""
echo "💡 To test with production:"
echo "   ./scripts/test-api.sh https://your-site.netlify.app"
