# Browser tests

Python + Playwright scripts that drive the real app in a browser. They change data, so run them
only against a **local** database.

```sh
# 1. A server with email switched off, logging to a file the tests can read
SMTP_HOST="" pnpm exec next dev -p 3100 > /tmp/hex-e2e-server.log 2>&1 &

# 2. A clean local database (keeps the imported reviews)
psql hex_healing_site -c 'TRUNCATE "Blog","Service","GalleryItem","PasswordResetToken","User","Booking" CASCADE'
psql hex_healing_site -c 'DELETE FROM "Healer"'
pnpm db:seed

# 3. Run (the owner password is the one behind SUPERADMIN_PASSWORD_HASH in .env)
cd tests/e2e
E2E_PASSWORD=... python3 healers.py   # healers, time slots, confirmation
E2E_PASSWORD=... python3 qa.py        # every page: errors, broken images, overflow, small text
```

`TRUNCATE "Healer" CASCADE` would also empty testimonials (they link to healers): use `DELETE`.
