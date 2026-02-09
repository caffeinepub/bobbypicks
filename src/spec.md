# Specification

## Summary
**Goal:** Implement a backend prediction settlement engine with admin-triggered execution and real settlement diagnostics/metrics, and connect the existing Settings settlement UI to these backend APIs.

**Planned changes:**
- Add Candid-exposed backend methods: `runSettlementNow()` (admin-only), `getSettlementDiagnostics()` (admin-only), and `getSettlementMetrics()` (authenticated users).
- Define `SettlementDiagnostics` and `SettlementMetrics` record types to match the data shapes expected by the existing frontend hooks (including `Time.Time` timestamps and bigint-compatible counters), ensuring authorized calls never trap due to missing/empty data.
- Implement deterministic settlement logic over `settleablePredictions`: on admin trigger, find eligible predictions (active + completed), mark them settled, set a reproducible outcome/result value, and update diagnostics fields including last attempt/success/failure and `numSettledInLastRun`.
- Compute settlement performance metrics from settled predictions (totals for settled/won/lost/push, 7-day win rate in [0,1], and total ROI with safe defaults when optional fields are missing).
- Update the frontend Settings settlement flow to call the new backend methods, refresh diagnostics/metrics after a successful run via React Query invalidation (no full reload), and show English error messages on failures/unauthorized traps.

**User-visible outcome:** Admins can trigger settlement from the Settings page and immediately see updated settlement diagnostics and performance metrics; authenticated users can view settlement metrics backed by real settled prediction data (no placeholder values).
