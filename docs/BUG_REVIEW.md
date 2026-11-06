# Health sync bug review

Reviewed Android collection/versioning, API ingestion, user scoping, legacy daily steps and existing regression coverage.

## Confirmed and fixed

| Impact                           | Trigger                                                                         | Correction                                                                                                                                   |
| -------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Valid metrics blocked            | Steps aggregate contains an invalid count                                       | Isolate Steps as a failed type and continue uploading successful types; do not send substitute zeros.                                        |
| Android sync crash               | Snapshot credentials contain valid JSON with an invalid shape, such as `null`   | Validate the cache container and version entries before using them.                                                                          |
| Silent data loss                 | A source identity is reused for another metric/day with an older source version | Check metric/day identity before treating a version as a duplicate.                                                                          |
| Partial local batch              | A later item conflicts with an existing source identity                         | Preflight all existing identities before any batch write. Production Mongo batches also retain transactional rollback.                       |
| Step totals increase incorrectly | An older app resends a superseded per-origin daily snapshot                     | Canonical daily snapshots take precedence, including tombstones. The legacy endpoint returns the authoritative total and `superseded: true`. |
| Automatic sync suppressed        | Device clock changes and the saved success timestamp lies in the future         | Discard invalid/future watermarks and perform a normal sync.                                                                                 |
| Manual retry lost                | User taps sync while an automatic sync that subsequently fails is running       | Run the queued forced sync after either success or failure of the automatic run.                                                             |

Regressions cover these triggers. The Mongo integration also checks that legacy uploads cannot revive superseded records.

## Recommended next work

1. **Persist a pending-upload outbox.** Network retries within one upload already reuse the same payload. An app restart or failure after an earlier batch committed can currently cause an unchanged batch to be sent with a newer source version because the fingerprint checkpoint is saved after the complete run. Persist pending batches and their exact versions before sending, then acknowledge each successful batch. Bind the outbox to the captured user and keep it encrypted.
2. **Define a multi-device policy.** Daily snapshot identities are shared by a user's devices. Two phones with different Health Connect histories can overwrite the same daily total according to their source versions. Decide whether one registered phone is authoritative or implement explicit device reconciliation before changing identities or merging totals.
3. **Show per-metric sync status in admin.** Store last successful read/upload, covered date range, permission/failure status and pending count without logging health values. This lets an administrator distinguish no reading from an incomplete or stale sync.
4. **Add cursor pagination for large histories.** Current page/limit queries use a compound index and have time bounds, but deep offsets still require skipping earlier matches. A date/id cursor would also reduce pagination drift while new data arrives.
5. **Use a shared rate-limit store when running multiple API instances.** Current limits are process-local; production-wide limits require shared state. This should be configured with the actual deployment topology.

The client sends daily vital summaries, not every raw sample. Permission revocation or a provider error preserves existing records; deletion reconciliation covers locally known snapshots in successfully read dates. Device-level validation still needs an Android build and a real Health Connect device.
