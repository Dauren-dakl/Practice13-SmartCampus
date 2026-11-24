# Pattern decision: no additional pattern
Problem: App owns both submitted outcome state and a memoized previewOutcome; the stored result takes precedence and becomes stale. The existing rule engine is already a separate pure module. The maintainability problem is duplicated result ownership, not an absent class hierarchy.
Strategy considered: useful when two interchangeable booking policies exist. This project has one policy; an interface and policy selector would add unsupported scope.
Adapter considered: useful when an external data/service contract must be translated. This project has no backend or external integration. An Adapter adds no current value.
Decision: add no named design pattern. The one focused structural correction removes duplicate outcome state and derives the displayed result from current inputs after first submit. The separate accessibility patch adds markup associations, not another architectural refactoring.
Before: fields -> previewOutcome, plus handleSubmit -> stored outcome; stored outcome wins.
After: fields + submitted -> checkAvailability -> current result; one owner.
No business-rule module, acceptance logic, fixture, dependency or CSS change. See reviewed diff, original9 regression tests, added edge cases and current-request browser checks. This decision is specific to this one-room app; reconsider Strategy only with real alternative policies and Adapter only with an actual service boundary.
