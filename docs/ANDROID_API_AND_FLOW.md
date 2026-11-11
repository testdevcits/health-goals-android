# Health Goals Android API and Integration Guide

This is the canonical, Android-specific integration guide. It documents the app's configured base URL, actual Android service calls, request payloads, response shapes, authentication, Health Connect sync, points, rewards, groups and chat. Endpoint behavior is checked against the current backend routes and Android implementation. For the backend-wide endpoint inventory (including admin and partner-only routes), see `../../backend/API_LIST.md`.

## 1. Environments and API base URL

All app API routes use the `/api/v1` prefix.

| Environment                      | Base URL example                                 |
| -------------------------------- | ------------------------------------------------ |
| Android emulator + local backend | `http://10.0.2.2:8000/api/v1`                    |
| Physical phone + local backend   | `http://<computer-LAN-IP>:8000/api/v1`           |
| Deployed backend                 | `https://health-goals-backend.vercel.app/api/v1` |

For a local emulator, `10.0.2.2` points to the development computer. A physical phone must use the computer's LAN IP and both devices must be on the same network. The backend must listen on port `8000` and allow the phone/web origin where applicable.

The Android native module reads `HEALTH_API_BASE_URL`. A local install can pass it to Gradle, for example:

```bash
cd health-app/android/android
./gradlew installDebug -PHEALTH_API_BASE_URL=http://10.0.2.2:8000
```

For a physical device, replace the host with the computer's LAN IP. Release builds require an HTTPS URL:

```bash
./gradlew assembleRelease -PHEALTH_API_BASE_URL=https://health-goals-backend.vercel.app
```

The Android client appends `/api/v1` itself. Set the URL to the server origin, without `/api/v1` (the client also strips that suffix if supplied). If the backend reports `EADDRINUSE`, it did not start on port 8000; set a free `PORT` and use that same port in `HEALTH_API_BASE_URL`.

## 2. Request and response conventions

JSON success responses use this envelope:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

The Android `authenticatedRequest` helper returns `response.data.data`, so screen/service code receives the inner `data` object. Do not unwrap it a second time.

Errors use this envelope:

```json
{
  "success": false,
  "error": {
    "code": "API_ERROR",
    "message": "Human-readable error",
    "details": null
  }
}
```

Send JSON with `Accept: application/json` and `Content-Type: application/json`. Authenticated routes require:

```http
Authorization: Bearer <accessToken>
```

The app stores session tokens in Android Keychain/Keystore-backed storage. Access tokens expire quickly; on a protected request returning `401`, the client calls `/auth/refresh` once and retries the request. If refresh fails, clear the session and show sign-in.

## 3. User journey at a glance

1. A user registers or signs in. Email OTP must be verified before the backend issues a session.
2. The app saves the user session securely, then sends phone make/model/OS details to the user's profile and registers the phone as a device.
3. With the user's Health Connect permission, the app reads supported health records and uploads them in batches. The backend validates and de-duplicates source records.
4. The user dashboard reads profile, health summaries, daily activity and points wallet data.
5. Daily point settlement credits points according to server-side rules. The app displays the credited amount and ledger; it must never calculate or award authoritative points locally.
6. The rewards screen lists currently redeemable rewards. A user chooses a specific reward and redeems it for its listed points cost.
7. The backend atomically deducts points and assigns one available voucher code for that reward. The app shows that code in the redemption detail/history so the user can present it to the named partner/provider.
8. The partner checks the code against the backend and marks it used. The app should refresh redemption status to show whether it remains issued or has been redeemed.

## 4. Authentication and account APIs

All paths in this table are relative to `/api/v1`.

| Method and path               | Auth                  | Purpose / body                                                                                                                                                 |
| ----------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST /auth/register`         | No                    | `{ "name", "email", "password", "companyCode?", "goal?" }`. Returns `202` and an OTP `challengeId`; it does not return an authenticated session yet.           |
| `POST /auth/login`            | No                    | `{ "identifier": "email or public user ID", "password" }`. Returns `202`, OTP challenge and masked email. Login is OTP-verified.                               |
| `POST /auth/verify-otp`       | No                    | `{ "challengeId", "otp" }`. Completes registration/login and returns `{ user, accessToken, refreshToken, ... }`. The legacy `token` field may also be present. |
| `POST /auth/google`           | No                    | `{ "idToken" }` from Google Identity. Returns the user and tokens when Google sign-in is configured on the backend.                                            |
| `POST /auth/password/forgot`  | No                    | `{ "email" }`. Requests a reset OTP; response avoids confirming whether the email exists.                                                                      |
| `POST /auth/password/reset`   | No                    | `{ "challengeId", "otp", "password" }`. New password must be at least 8 characters.                                                                            |
| `POST /auth/refresh`          | Refresh token in body | `{ "refreshToken" }`. Returns rotated access/refresh tokens. Refresh tokens are single-use; persist the new pair before making another refresh request.        |
| `POST /auth/logout`           | Yes                   | Invalidates the current server session. The Android app clears local tokens immediately.                                                                       |
| `GET /auth/me`                | Yes                   | Returns `{ "user": ... }` for the signed-in user.                                                                                                              |
| `PATCH /auth/me`              | Yes                   | Update permitted profile fields: `name`, `goal`, `heightCm`, `weightKg`, `birthDate`, and optional contact `phone` (10–15 digits; encrypted at rest).          |
| `PATCH /auth/me/goals`        | Yes                   | `{ "metricType": "steps", "targetValue": 8000 }`; goal metrics currently supported by backend: `steps`, `sleep`, `heart_rate`, `stress`.                       |
| `GET /auth/me/profile-questions` | Yes                 | Returns active questions still unanswered by the signed-in user, ordered by `order`. |
| `PATCH /auth/me/profile-answers` | Yes                 | `{ "answers": { "<questionKey>": "answer", "<optionalQuestionKey>": null } }`. Returns updated user data and may include the remaining `pendingQuestions`. |
| `POST /auth/me/device`        | Yes                   | Save phone profile: `deviceIdentifier`, `manufacturer`, `brand`, `model`, `platform: "android"`, `osVersion`, `appVersion`.                                    |
| `POST /auth/me/profile-image` | Yes                   | `{ "image": "<data URI/base64 image>" }`; server stores the image in configured Cloudinary and returns updated user.                                           |

Registration and password login require OTP verification. OTPs expire and have an attempt limit; if that limit is reached, start a new registration/login/reset challenge rather than retrying the old one.

After authentication, Android asks the profile-question endpoints for active unanswered questions and displays them in order. Supported question types are `text`, `number`, `select` (using the server-provided options), and `date` (`DD/MM/YYYY`). Question `key` values are the answer object keys; optional skipped answers may be sent as `null`. The user can skip the flow, leaving questions pending for a later sign-in. Newly activated question keys are picked up the next time the user signs in.

## 5. Device registration and phone details

The Android app generates a stable per-install identifier and stores it securely. After sign-in it sends a phone profile through `POST /auth/me/device`. Before Health Connect upload, it also ensures a device entry exists:

```http
GET /api/v1/devices
POST /api/v1/devices
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "deviceType": "phone",
  "deviceIdentifier": "android-...",
  "manufacturer": "Example manufacturer",
  "model": "Example model",
  "platform": "android"
}
```

Other device routes are `GET /devices` and `DELETE /devices/:id`. A record that references `deviceId` must refer to a device registered to that same user. The user's phone profile and registered device are separate records: profile data describes the handset, while the device record is used to associate/scope health sync.

## 6. Health Connect and health record sync

The Android app requests read permissions for these Health Connect record types (permission is optional per type): Steps, Distance, TotalCaloriesBurned, ExerciseSession, SleepSession, HeartRate, Weight, OxygenSaturation and BloodPressure. If a user denies a permission, that metric is omitted; it should not be shown as zero data.

Current sync sends all permitted health types through `POST /health/sync` in batches of at most 100 records, with `includeRecords: false`. It backfills up to 30 available IST dates on the first run after this update, then rereads 7 dates for corrections (up to 30 after a gap). Only changed snapshots are uploaded, and successful automatic runs are throttled to once every five minutes per user. The backend retains older history. See [HEALTH_SYNC.md](HEALTH_SYNC.md) for the complete contract.

An explicit tap on **Sync latest data** bypasses that five-minute throttle so the user can request an immediate upload. Automatic/background sync keeps the throttle. If automatic upload fails, Daily Activity shows the failure; inspect the HTTP log to identify whether `POST /auth/me/device`, `POST /devices`, `POST /health/sync` returned the error. Device registration happens before health uploads, so a device-registration failure prevents the health POSTs from being attempted. Protected requests refresh the access token on `401`; concurrent requests share one refresh operation to avoid racing the rotating refresh token.

```http
POST /api/v1/health/sync
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "records": [
    {
      "metricType": "steps",
      "value": 1200,
      "unit": "count",
      "recordedAt": "2026-11-03T08:00:00.000Z",
      "source": "health_connect",
      "sourceRecordId": "Steps:com.example.health:source-record-123",
      "sourceVersion": 1,
      "dataOrigin": "com.example.health",
      "recordingMethod": "automatic",
      "deviceId": "android-install-id",
      "metadata": { "origin": "com.example.health" }
    }
  ]
}
```

Required fields are `metricType`, numeric `value`, `unit`, ISO-compatible `recordedAt`, `source` and stable `sourceRecordId`. `metadata` must be an object of at most 16 KB if supplied. Units must match the metric: `count`, `km`, `kcal`, `min`, `bpm`, `kg`, `mmHg`, `%` or `checkin` as appropriate. Optional `sampleCount` must be a positive integer; BP components must be `systolic` or `diastolic`. Device selectors must be strings referencing the authenticated user’s active device. The backend currently accepts metric types `steps`, `workout`, `meditation`, `water_checkin`, `sleep_checkin`, `running`, `walking`, `heart_rate`, `sleep`, `oxygen_saturation`, `weight`, `blood_pressure`, `calories`, `distance`, and `active_minutes`, each with server-side value bounds. It rejects timestamps more than 5 minutes in the future. Send a stable unique source ID and increase `sourceVersion` for corrections or deletions. A source identity cannot change metric or IST day. Duplicate identities within one batch are rejected before writes; Mongo batches commit atomically. Upload retries are idempotent. The server derives user identity from authentication, and Android refuses to upload/retry captured health data after switching accounts. Development HTTP logs retain request method, URL, status and timing, but omit request and response bodies for `/health`, `/activity`, and profile-question endpoints. Credential fields such as passwords, tokens and authorization headers remain redacted on other routes.

The Android Health Connect mapper currently uploads daily step totals, daily distance (km), calories (kcal), sleep duration (min), heart rate (bpm), weight (kg), oxygen saturation (%) and systolic/diastolic blood pressure (mmHg), plus actual workout sessions with their activity intervals, if permissions and source records exist. It preserves interval/start-end and Health Connect origin metadata where available. Workout sessions require a stable source ID and origin. Invalid or failed types are reported without blocking successful types. Active minutes are derived from the union of workout intervals, avoiding duplicate time across overlapping sessions. No walking/running distance, stress score, water check-in or meditation session is invented from unrelated readings.

Successful batch response data contains `total`, `created`, `updated`, `duplicates`, `pruned` (zero), `rewards` and `records` unless `includeRecords: false` was requested. A batch can contain duplicates; this is expected during sync. The endpoint allows 1–100 records per request.

Other health reads:

| Method and path                                                                       | Purpose                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /health/records?metricType=steps&page=1&limit=100&from=2026-11-01&to=2026-11-06` | Current user's non-deleted records, stable date/id sort, strict IST date filters; returns `records`, `page`, `limit`, `hasMore`, `nextPage`. Follow `nextPage` to read complete history. |
| `GET /health/trends?metricType=sleep&from=2026-11-01&to=2026-11-06` | Date-complete daily series for supported metrics; `value: null` and `count: 0` mean no observation. The Home and detailed trend charts preserve missing days rather than treating them as zero. |

For clients that aggregate Health Connect steps by day, the backend also accepts one compact object via `POST /health/steps/daily` (Bearer auth). Example: `{"date":"2026-11-05","steps":6420,"dataOrigin":"com.example.health","recordingMethod":"automatic","deviceId":"android-install-id"}`. The backend replaces the same user's date/origin total on repeat calls. This endpoint remains for older clients. The current Android build sends canonical aggregated steps through `/health/sync` using `daily-steps:YYYY-MM-DD:aggregate`; do not upload the same day through both contracts. The backend cannot read or aggregate Health Connect records by itself; Android must calculate the total and send it.

The app fingerprints snapshots locally and uploads only newly added or changed records. It rereads the correction window above. Removed vital/workout snapshots generate versioned `deleted: true` updates only after a complete successful read of that type with permission. Failed, invalid or permission-revoked reads never clear prior data. The backend does not currently expose a Health Connect change-token endpoint.

Admin reads synced records with `GET /admin/users/:id/steps` for date-wise step totals, `GET /admin/records?userId=<userId>&metricType=workout` for the user's raw workout records, and `GET /admin/users/:id/record-chart?metricType=workout` for a daily chart summary. Use `/admin/records` for detailed entries such as activity type, interval, source and values. These endpoints require an admin bearer token. A health upload succeeding means the record was stored; daily points are settled separately.
| `GET /health/history?metricType=steps&from=2026-11-01&to=2026-11-03` | Daily metric history; both dates required, interpreted using India Standard Time. |
| `GET /health/summary` | All-history totals for quantities/durations and sample-weighted vital averages, excluding deleted records. BP components use `blood_pressure_systolic` and `blood_pressure_diastolic`; active minutes use `activeMinutes`. This endpoint is not limited to 100 records. |
| `GET /health/dashboard` | Dashboard-shaped health data. |
| `POST /health/records` | Create/process one health record using the same record validation as sync. |

## 7. Activity and points earning

The phone sends observed health data; the backend determines qualifying activity and point awards. The client must not add points based on a local step counter. Settlement is server-side, may happen after the activity day, and the progress response distinguishes pending from already credited points.

| Method and path                                         | Purpose                                                                          |
| ------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `GET /activity/today`                                   | Today's activity totals and points settlement status. Optional `day=YYYY-MM-DD`. |
| `GET /activity/history?page=1&limit=20&from=...&to=...` | Daily activity/points history.                                                   |
| `GET /activity/records?metricType=sleep&from=...&to=...&page=1&limit=20` | Paginated health/activity records for the current user; returns `items`, `total`, `page`, `limit`, and `totalPages`. The Health Reports screen filters by the selected metric and report dates. |
| `GET /activity/transactions?page=1&limit=20`            | Points ledger entries.                                                           |
| `GET /wallet`                                           | Wallet, transactions and current daily activity progress.                        |

`GET /wallet` returns `wallet` (`availablePoints`, `lifetimeEarned`, `lifetimeRedeemed`), recent `transactions`, and `dailyActivity` (settlement state, credited/eligible/pending coins, due time, and activity totals). Use `availablePoints` as the spendable balance; use `dailyActivity.pendingCoins` as pending, not credited, points. `/activity/transactions` returns `{ items, total, page, limit }`; transaction amounts are signed, so display their returned sign rather than inferring it from the transaction type. The Android rewards screen shows the wallet totals and daily settlement status, and requests ledger pages of 20 on demand. Refresh wallet/activity after health sync and after reward redemption; a successful upload does not necessarily mean that day's points are already settled. The `health/sync` response currently returns `total`, `created`, `duplicates`, `rewards` (legacy field; currently empty because sync queues settlement), and `records`. Do not expect an immediate points award from this response.

## 8. Rewards and user coupons

### Monthly leaderboard ticket rewards

The signed-in winner can view monthly ticket claims in the Rewards screen. Fetch them from:

```http
GET /api/v1/rewards/leaderboard-tickets
Authorization: Bearer <accessToken>
```

Success data is `{ "items": [...] }`. Only the reward recipient's claims are returned. Individual winners receive their own claim; for a group win, the group leader (GL) receives the group's claim. Each item includes the leaderboard `month`, winner/group name, status, and step total. Before issue, the app can show `CONSENT_PENDING` or `READY_TO_SEND` as “Reward being prepared.” Once sent, it includes the event `ticketDate`, `ticketNumber`, `ticketCount`, optional `bookingReference`, and `ticketImage` as an authenticated data URI for rendering with React Native `Image`. It does not return the consent phone or other group members' snapshot. The backend sends the same image to the winner's registered email.

### List available rewards

```http
GET /api/v1/rewards
Authorization: Bearer <accessToken>
```

The response data contains `{ "rewards": [...] }`. Each reward includes fields such as `id`, `title`, `description`, `pointsRequired`, `stock`, `status`, `provider`, `partnerId`, `terms`, `startAt`, `endAt` and `availableVoucherCount`. The API only lists active, in-period rewards with stock and at least one available voucher code. The API decides what is actually redeemable; the app may disable a button if balance is below `pointsRequired` or stock is zero, but the backend remains authoritative.

### Redeem a specific reward

The user does not receive an arbitrary coupon from any partner. They first select a particular reward; the server assigns one available code from that reward's inventory.

```http
POST /api/v1/rewards/{rewardId}/redeem
Authorization: Bearer <accessToken>
```

No body is required. Success returns `201` and data shaped like:

```json
{
  "redemption": {
    "id": "redemption-id",
    "userId": "user-id",
    "rewardId": "reward-id",
    "pointsUsed": 100,
    "status": "ISSUED",
    "redemptionCode": "HG-EXAMPLE-CODE",
    "expiresAt": "2026-12-03T10:00:00.000Z",
    "redeemedAt": null,
    "createdAt": "2026-11-03T10:00:00.000Z"
  }
}
```

The redemption is transactional in MongoDB: stock is decremented, points are deducted and an available code is assigned together. If any part cannot complete, the user should not be shown success. Common errors include reward inactive/not found (`404`), out of stock or insufficient points (`400`), reward outside its redemption period or no codes available (`409`). A retry is safe only after checking the user's redemption list; do not blindly submit repeated redemption requests after a timeout, because each successful request is a new redemption.

### Coupon / redemption history

```http
GET /api/v1/redemptions
GET /api/v1/redemptions/{redemptionId}
Authorization: Bearer <accessToken>
```

The list returns `{ "redemptions": [...] }`; one-item read returns `{ "redemption": ... }`. The server scopes both to the signed-in user. Show the reward title/provider, code, issued/used state and expiry. The record normally starts as `ISSUED`, becomes `REDEEMED` after the partner marks it used, or may be `CANCELLED`. The redemption code is private: show it only to its owning user and avoid writing it to logs, analytics or crash reports. In production, design the UI to mask the code until the user taps to reveal/copy it.

### Where do the codes come from?

- **Local gym/business partner:** Admin creates a reward for that partner and imports or generates unique voucher codes. User selects that reward, spends points, and gets one code from that reward's own inventory. The partner validates the code using the Partner Portal or partner API; a code is single-use.
- **External provider (movie tickets, etc.):** Currently there is no BookMyShow/PVR/provider API integration in this code. Admin can only load provider-issued codes into reward inventory. The same user redemption API then assigns one of those codes. Automatic code purchase/issuance requires a provider contract and a future server-side integration.
- **No shared random pool across partners:** A user's selected reward determines which partner/provider inventory can supply the code. Codes belonging to another partner are not interchangeable.

The provider label is descriptive. Do not tell the user that a voucher is a live BookMyShow/PVR voucher unless a valid provider-issued code was loaded and its terms are current.

## 9. Partner validation boundary

Partner API keys and Partner Portal credentials are for partner systems/staff and must never be embedded in the Android app. The mobile app uses the signed-in user's bearer token only. The partner validates a presented coupon on the server-backed partner flow; only the owning partner is allowed to mark a coupon used. Once used, it cannot be redeemed again.

For the backend-owned partner API, requests use `X-Partner-Key` and live under `/api/v1/partner`; the staff portal uses its own login/token. These are separate from the user endpoints documented above. Treat coupon codes as bearer-like secrets and do not put partner API keys into app config, APK resources, or client-side requests.

## 10. Community, challenges and badges currently used by Android

These routes are authenticated and use the same success envelope. They are not required for the coupon flow but are part of the app's wider user experience.

| Method and path                                      | Purpose                                                                                                                                                              |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /community/feed`                                | Feed posts.                                                                                                                                                          |
| `GET /community/groups`                              | Groups the user belongs to.                                                                                                                                          |
| `GET /community/groups/discover`                     | Discoverable groups.                                                                                                                                                 |
| `POST /community/groups`                             | Create group with `name`, optional `description`, `emoji`, `private`. Group capacity is fixed at 10 including its creator; `maxMembers` is ignored/not configurable. |
| `POST /community/groups/{id}/join`                   | Join a group. The API rejects joins with HTTP 409 when the configured member limit is full.                                                                          |
| `GET /community/groups/{id}`                         | Group detail.                                                                                                                                                        |
| `GET /community/groups/leaderboard?day=YYYY-MM-DD`   | Public groups' daily step rankings.                                                                                                                                  |
| `GET /community/groups/{id}/activity?day=YYYY-MM-DD` | Group/member daily activity (membership required).                                                                                                                   |
| `GET /community/groups/{id}/leaderboard`             | Member leaderboard over recent seven days.                                                                                                                           |
| `POST /community/groups/{id}/members`                | GL adds an active user by `{ "publicId": "USR-..." }`.                                                                                                               |
| `POST /community/groups/{id}/leave`                  | Leave group; if GL leaves, leadership transfers or an empty group is deleted.                                                                                        |
| `DELETE /community/groups/{id}`                      | GL archives a group (soft delete); retained messages/challenges are not physically removed. Android confirms first and returns to the groups list on success.          |
| `GET /community/groups/{id}/messages` / `POST`       | Read/send group messages.                                                                                                                                            |
| `GET /community/groups/{id}/challenges` / `POST`     | Read/create group challenges.                                                                                                                                        |
| `GET /community/challenges`                          | Challenges list/progress.                                                                                                                                            |
| `POST /community/challenges/{id}/join`               | Join challenge.                                                                                                                                                      |
| `GET /community/badges`                              | User badges.                                                                                                                                                         |

The backend also attaches a Socket.IO chat gateway for group messages. The Android socket client should authenticate with the current user session; do not use partner API credentials for sockets. For exact socket event names/payloads, inspect `backend/src/socket/chat.gateway.js` alongside `android/src/services/chatSocket.ts` before changing chat behavior.

## 11. Recommended Android screen/API mapping

| Android screen/feature                            | Backend calls                                                                                              |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Sign up / sign in                                 | `POST /auth/register` or `/auth/login`, then `/auth/verify-otp`; Google: `/auth/google`.                   |
| App restore / profile                             | `/auth/refresh`, `GET /auth/me`, `POST /auth/me/device`, `GET /wallet`.                                    |
| Edit profile                                      | `GET /auth/me`, `PATCH /auth/me`, optional `/auth/me/profile-image`.                                       |
| Health permissions and sync                       | Health Connect on device, `GET/POST /devices`, then `POST /health/sync`.                                   |
| Home and health charts                            | `GET /auth/me`, `/health/dashboard`, `/health/history`, `/activity/today`, `/activity/history`, `/wallet`. |
| Rewards                                           | `GET /wallet`, `GET /rewards`, `GET /redemptions`.                                                         |
| Redeem reward                                     | `POST /rewards/{rewardId}/redeem`, then refresh wallet/rewards/redemptions.                                |
| My coupons                                        | `GET /redemptions`; use `GET /redemptions/{id}` to refresh one redemption.                                 |
| Groups/challenges                                 | `/community/...` routes listed above.                                                                      |
| Rule leaderboard, goal progress and earned badges | `GET /rewards/competitions`; refresh `GET /wallet` after a new bonus.                                      |

## 12. Implementation and safety checklist

- Keep base URL configurable. Use local LAN/emulator URLs only for development and HTTPS for release.
- Store access and refresh tokens in secure Android storage; never persist them in plain preferences or log them.
- OTP login is a two-step flow. Do not navigate to authenticated screens until OTP verification succeeds.
- On `401`, refresh once and retry once. On failed refresh, clear local session and return to sign-in.
- Ask for Health Connect permissions with an explanation. Handle unavailable SDK and each denied permission without blocking unrelated app features.
- Upload only records the user authorized. Keep source IDs stable; batch at most 100 records and retry transient network failures with backoff.
- Treat server points totals and reward inventory as authoritative. Do not award points locally or show a coupon until redemption succeeds.
- After redemption, retain/show the exact `redemptionId`, reward ID, issued code and expiry; refresh history after app restart.
- Never send a partner key from the Android app. Never log coupon plaintext, access tokens, refresh tokens, OTPs or passwords.
- If a provider-issued code is expired or invalid, contact the app operator/partner; do not mark a voucher used unless the partner has accepted it.

## 13. Current integration status and limitations

The repository currently wires Android auth, profile/device sync, Health Connect sync, activity/wallet, reward listing/redemption/history, ticket claims, and community/challenge APIs. Reward redemption depends on actual available voucher inventory configured on the backend. For MongoDB-backed production deployments, voucher code encryption must be configured on the backend. External movie-ticket/wellness provider API purchasing and delivery is not implemented; until it is, the admin must load real codes supplied by the provider/partner. The app cannot produce a real third-party voucher just by displaying a provider name.

The backend is the source of truth for current route behavior. If a deployment differs from this repository (for example a Vercel deployment running an older commit), compare its version before debugging client behavior.

## 14. Rule competitions, badges and bonus rewards

`GET /rewards/competitions` (authenticated) returns `competitions` and earned
`achievements`. Only competitions enrolling the signed-in user are returned.
Each competition includes its IST `start`/`end`, metric, target, LIVE/PAUSED/FINAL
status, top 20 leaderboard entries and `myProgress` even outside the top 20.
Comparable group rules (same period, metric, target and format) show group rankings.
These comparison ranks do not change each rule's award eligibility.

Active rules enroll a participant snapshot on first evaluation of each period.
Group membership and rule settings stay fixed for that enrolled period; edits take
effect for the next new period. Pausing/deleting stops further awards while keeping
existing achievements. Resuming an existing rule continues its saved period.
New members join the next period. No historical periods before enrollment are backfilled.

Badge goals and timed challenges award once on target completion. Leaderboards
award qualifying participants (target reached and rank <= winner count) at period
end; ties share rank and may produce more winners. Each enrolled group member gets
the group's badge and configured bonus. Group rules award independently.
Wallet bonuses and achievements commit in one MongoDB transaction with unique
idempotency keys. A 30-second worker and activity sync trigger evaluation; retries
recover failed awards. Final periods are immutable; late sync after finalization
does not alter winners. Timed challenges accept optional `startDate` (YYYY-MM-DD,
IST), defaulting to rule creation day, plus `durationDays` (1–30).

MongoDB replica-set integration and native Android runtime should be verified
before enabling nonzero bonus rules in a deployed environment. Group capacity in
the current backend is fixed at 10; the old configurable 2–500 member limit is
not part of this API contract.

### 14.1 How the user receives a badge or bonus

No claim endpoint or manual claim step is required for rule achievements.

| Rule type                     | Award trigger                                                            | User receives                                                                              |
| ----------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Badge goal (`BADGE`)          | Enrolled participant reaches the target within the period.               | One achievement and the configured bonus points.                                           |
| Timed challenge (`CHALLENGE`) | Target reached during the challenge date window.                         | One achievement and the configured bonus points.                                           |
| Leaderboard (`LEADERBOARD`)   | Period ends, target is reached, and final rank is within `winnersCount`. | One achievement and the configured bonus points per qualifying winner.                     |
| Group audience (`GROUP`)      | The group's combined activity meets the rule's award conditions.         | Each member in the saved enrollment receives the badge and configured points individually. |

For example, a monthly badge goal with a 100,000-step target and 50 bonus points
awards the achievement plus 50 wallet points once the enrolled user reaches the
target. Repeated syncs, page refreshes and worker retries do not award it again
for that rule, participant and period. Distinct rules can each award independently.
A zero-point rule still records an achievement. The badge title falls back to the
rule title when no badge name is configured.

Leaderboard progress and rank can appear before target completion. Reaching the
target alone does not guarantee a leaderboard reward: final winner eligibility
is checked at period end. Ties share rank and can increase the number of winners.
Group comparison ranks are for display; each saved group rule awards separately.

### 14.2 Android display and refresh flow

1. On entering Challenges & Leaderboard, call authenticated
   `GET /rewards/competitions` along with the existing community APIs.
2. In Leaderboard, render rule competitions, their period, metric, status and top
   20 rows. Use `myProgress` for the user's own entry or enrolled group, including
   when its rank is outside the top 20. Group rules display combined group totals.
3. In Challenges, show badge goals and timed rule challenges alongside existing
   community challenges. Rule enrollment is automatic; do not call the community
   challenge join endpoint for a rule competition.
4. In Badges, merge returned `achievements` with badges from
   `GET /community/badges`. Use the achievement `key` as the stable identifier.
5. Refresh competitions and `GET /wallet` after activity sync or when reopening
   these screens. Show authoritative wallet balances from the server.

Each competition contains `id`, `title`, `ruleType`, `audience`, `metric`,
`targetValue`, `start`, `end`, `status`, `leaderboard` and `myProgress`.
Leaderboard/progress entries contain `id`, `name`, `value`, `rank`, `progress`
(percentage) and `achieved`. Percentages may exceed 100%; cap only the visual bar.
`myProgress` is an array because a user can be enrolled in multiple compared groups.
A future timed challenge can be returned before it starts; use `start` to label it
as upcoming instead of inferring that activity has begun from the `LIVE` status.

Achievements contain `key`, `userId`, `runKey`, `title`, `ruleTitle`, `points`,
`groupId` (null for individual awards) and `awardedAt`. `achieved` in a progress
entry means the activity target was reached; an earned achievement must come from
the `achievements` collection, especially for leaderboards awaiting finalization.

A rule bonus is a wallet transaction with type `BONUS` and reference type
`REWARD_RULE`. Badge/bonus awards do not automatically issue vouchers or coupons.
Users spend available wallet points through the existing reward redemption flow.
There is currently no dedicated push notification for rule awards.

### 14.3 Default rules and administration

From `health-app/backend`, run:

```bash
npm run db:seed:reward-rules
```

| Audience            | Default rule                                 | Target                   | Period  |
| ------------------- | -------------------------------------------- | ------------------------ | ------- |
| Individual          | Monthly Steps Challenge (leaderboard, top 3) | 100,000 steps            | Monthly |
| Individual          | Monthly Steps Badge Goal                     | 100,000 steps            | Monthly |
| Individual          | 7-Day Steps Challenge                        | 50,000 steps             | 7 days  |
| Each existing group | Monthly Group Steps Leaderboard (top 3)      | 1,000,000 combined steps | Monthly |
| Each existing group | Monthly Group Steps Badge Goal               | 1,000,000 combined steps | Monthly |
| Each existing group | 7-Day Group Steps Challenge                  | 250,000 combined steps   | 7 days  |

All defaults have zero bonus points. Re-running the seed updates the same seeded
rules by stable seed identity, including after renaming; custom rules are preserved.
Group defaults are skipped when no groups exist. Create groups and re-run the seed
to enroll defaults for them. Seed updates do not reset existing period snapshots
or restart an already-created timed challenge.

Admin rule endpoints (relative to the same API base URL):

| Endpoint                                 | Purpose                                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------------------ |
| `GET /admin/reward-rules`                | List configured rules.                                                               |
| `GET /admin/reward-rules/options`        | Available members and groups.                                                        |
| `POST /admin/reward-rules`               | Create a rule; duplicate configurations return 409.                                  |
| `PATCH /admin/reward-rules/{id}`         | Edit or pause/resume a rule.                                                         |
| `DELETE /admin/reward-rules/{id}`        | Delete configuration; preserve enrolled history and earned achievements.             |
| `GET /admin/reward-rules/{id}/analytics` | Current-settings activity preview, not the immutable award ledger.                   |
| `PATCH /admin/groups/{id}/member-limit`  | Body: `{ "maxMembers": 50 }`; allowed range 2–500, never below current member count. |

Changing group capacity does not change the already-enrolled participant snapshot.
Changes to rule settings affect a new period enrollment; they do not rewrite an
existing period's target, participants, rewards or awarded achievements.

### 14.4 Verification status

Backend tests cover repeat evaluation, bonus idempotency, period finalization,
edit/delete history preservation, group enrollment, pause/resume and future
challenge dates. The admin frontend build passes. Live MongoDB transactional award
verification and native Android end-to-end testing remain outstanding. Android's
full TypeScript check currently reports errors in other group/home/health-sync
files; do not treat the native build as verified.

### 14.5 Seven-day activity demo

Run `npm run db:seed:demo` from the backend in development (`APP_MODE=dev`,
persistent MongoDB, non-production). The seed uses `demo.health.user@example.test`
(Demo User · Sample Data), one demo phone, and the previous seven completed IST
days of synthetic steps, workout, meditation, heart rate, sleep, weight, distance,
calories, oxygen saturation and check-ins. It also creates a private Demo Activity
Team and demo user/group reward rules. Historical points use normal settlement.

Open the demo user's records in Admin for charts, or choose a Demo-prefixed rule
on the Leaderboard page. Rules are created after import so a completed challenge
is not finalized against a partial import. Stable source IDs prevent duplicate
activity on reruns. Existing snapshots and earned awards are preserved; rerunning
does not restart finalized challenges. No login password is printed or emailed.
This is synthetic data and must not be presented as real health measurements.
