# Day-wise Health Connect sync

All daily boundaries use Asia/Kolkata. Android reads Health Connect daily aggregates, sends only changed snapshots through `POST /health/sync` in batches of up to 100 records, and does not upload raw step intervals. Oxygen readings and workout sessions are paginated before local processing. A failed optional metric does not prevent the successful metrics from syncing; failed metrics are reported and retried without advancing the success watermark.

The first sync after this update backfills up to 30 days available to Health Connect. Subsequent syncs reread seven days for corrections, expanding up to 30 days after an absence. This read window does not delete backend history. Data deleted by previous versions can only be restored if it is still readable on the phone.

Steps use one stable record identity per IST day: `daily-steps:YYYY-MM-DD:aggregate`. Health Connect already combines source apps according to its own aggregation rules. On receiving this snapshot, backend ingestion marks known older daily step snapshots for that day as superseded (deleted), preserving their rows and revisions. Charts, daily history and app dashboards exclude superseded records. Older Android clients should be updated before evaluating corrected totals.

Admin record details show daily values in a table and charts, with separate systolic and diastolic blood pressure series. Quantities and session durations are summed; vital measurements are weighted by source sample counts when provided. Active minutes merge overlapping workout intervals locally. Synced vital averages are daily summaries, not individual medical readings.

## Verification and rollout

- Backend: `npm test`.
- Real Mongo test in a newly generated temporary database: `HEALTH_SYNC_MONGO_TEST=true node --test test/health-sync-mongo.test.js`. It uses the configured Mongo server, creates its own isolated database and removes that database after testing.
- Android: `npx tsc --noEmit` and `npm test -- --runInBand`.
- Admin: `npm run build`.
- Database indexes: run `npm run db:indexes:health` in backend. This creates declared indexes without dropping existing indexes and prints anonymous query-plan statistics.

Deploy backend and admin, then install the updated Android app. Grant Health Connect read permissions, run Sync now, and compare a completed day's steps with Health Connect and the admin daily table using the same IST date. Check permission-denied and offline retry behavior on a real device. Android SDK/JDK and an emulator or connected phone are required to build and perform that final device check.

## All-metric data flow

The API validates all 15 supported metrics, their canonical units, bounds, timestamps, metadata size, device ownership and source versions. Nine permitted Health Connect record types supply steps, distance, calories, sleep, heart rate, weight, blood pressure, oxygen and workouts; active minutes are derived without an extra provider read. Walking/running distance, meditation and habit check-ins require actual records from their own source; the app does not fabricate them from steps or other measurements.

Every changed metric uses the same batch endpoint, authenticated user scope, retry/version handling and retained history. Locally known removed vitals and workout sessions become tombstones only for successfully read types/dates. Revoked permissions, invalid readings and provider failures preserve old data. Local state advances after uploads succeed; switching accounts aborts the captured upload, including token-refresh retries.

`GET /health/records` supports `metricType`, `from`, `to`, `page` and `limit` and returns `hasMore`/`nextPage` alongside records. The summary aggregates all history without the old 100-record cutoff and separates BP components. Dashboard latest readings also preserve both components. Daily-history and admin chart averages use available sample counts. Backend sync preloads source identities once per batch and queues relevant reward days once instead of queuing each vital reading. In development, HTTP logs include health request and response data; credential fields such as passwords, tokens and authorization headers remain redacted. Other payload and response fields are shown. Treat these logs as sensitive and do not share them publicly.

Android reports request daily history and use IST dates. Charts show actual available daily values rather than sample quality/peak/resting statistics. Stress remains unavailable because the connected sources do not supply that metric.
