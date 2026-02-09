# Specification

## Summary
**Goal:** Add a simple authenticated Live Picks page that shows live picks with basic filtering and periodic refresh.

**Planned changes:**
- Add a new frontend route at `/live` that renders within the existing AppLayout and requires Internet Identity authentication (show existing login-required UI when not logged in).
- Build a responsive card-grid UI for live picks with an English empty state when there are no picks.
- Add basic on-page controls: text search (player name/team) and a status filter (All/Live/Final/Upcoming) that combine to filter the visible cards, including an English “no results” empty message when filters match nothing.
- Fetch live picks from the backend with polling, showing standard loading/error UI states and displaying a “Last updated” timestamp in human-friendly relative time when available.
- Expose backend read APIs needed by the page: `getLivePicks()`, `getLivePicksLastUpdated()`, and `getLivePicksDiagnostics()` (including last success/failure timestamps and an error message).

**User-visible outcome:** Authenticated users can visit `/live` to see a periodically-updating grid of live picks, search and filter them by status, and view loading/empty/error states plus a “Last updated” indicator when provided.
