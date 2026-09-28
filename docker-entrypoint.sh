#!/bin/sh
set -e

# Apply pending migrations, then create the owner account / launch content if missing
# (the seed never overwrites existing data). Both are safe on every start.
# Binaries are called directly (PATH includes node_modules/.bin): no pnpm/corepack needed at runtime.
tsx scripts/prisma.ts migrate deploy
tsx prisma/seed.ts

exec next start -p 3000
