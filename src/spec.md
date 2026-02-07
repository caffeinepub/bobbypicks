# Specification

## Summary
**Goal:** Add a new Landing Page, a searchable Prop Board table with per-pick Value Bar and Show Logic transparency, and enhance the Parlay Builder with 2–6 leg bundling plus projected combined hit-rate—while keeping existing routes working.

**Planned changes:**
- Add a new Landing Page at `/` with a dark, high-energy hero section and a “Daily Top 3 Parlay” module built from existing edge opportunities, including add-to-parlay calls-to-action and graceful empty states.
- Introduce a dedicated “Prop Board” route that renders a searchable table (Player, Team, Category, Value Bar, actions) with row-level navigation to the existing Prop Detail page, plus loading/error states.
- Update routing and header navigation so `/` maps to Landing Page, Prop Board is accessible via a nav link, and existing routes (`/parlay`, `/settings`, `/about`, `/prop/$propId`) continue to function with correct active states.
- Enhance Parlay Builder to enforce a 2–6 leg selection, prevent adding more than 6 legs, and display a deterministic “Projected combined hit-rate” computed from available per-leg confidence/probability values, with clear handling for missing values.
- Add a per-pick “Show Logic” expand/collapse UI at minimum on Prop Board rows and Parlay Builder legs (optionally Prop Detail), showing available verification/projection/edge details and clear “Not available” messaging when fields are missing, using existing composed components.

**User-visible outcome:** Users land on a new homepage featuring a Daily Top 3 Parlay, can browse and search props in a table with a probability Value Bar and “Show Logic” details, and can bundle 2–6 picks in Parlay Builder while seeing a projected combined hit-rate.
