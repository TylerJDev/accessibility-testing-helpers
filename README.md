# Accessibility Testing Helpers

Accessibility-testing-helpers is a package that provides a set of functions to test the accessibility of different ARIA patterns.
These tests aim to reduce accessibility regressions in components by providing a set of tests that can be run against components that implement these patterns.

This package also provides a set of custom Jest matchers that can be used to test the accessibility of components quickly.

## Test Patterns

### `role="menu"`

Tests [`menu` implementions based on WAI-ARIA](https://www.w3.org/TR/wai-aria-1.2/#menu), in addition to our own [`ActionMenu` component](https://primer.style/components/action-menu#menu-items).

#### Tests:

* Trigger button keyboard interactions
* Menu keyboard interactions
* Menu item keyboard interactions

## Custom Matchers

### `toBeExpanded`

```toBeExpanded()```

Use `.toBeExpanded` when checking if an element is expanded.
This checks if the element is expanded via `aria-expanded`, or if the element naturally expands (e.g. details/summary, dialog)

### Examples

```HTML
  <button aria-expanded="true">Click me</button>
  <details open><summary>Click me</summary></details>
  <dialog open>...</dialog>
```

```tsx
expect(getByRole('button')).toBeExpanded();
expect(getByRole('details')).toBeExpanded();
expect(getByRole('dialog')).toBeExpanded();
```

### `toBeCollapsed`
```toBeCollapsed()```

Use `.toBeCollapsed` when checking if an element is collapsed.
This checks if the element is collapsed via `aria-expanded`, or if the element naturally collapses (e.g. details/summary, dialog)

### Examples

```HTML
  <button aria-expanded="false">Click me</button>
  <details><summary>Click me</summary></details>
  <dialog>...</dialog>
```

```tsx
expect(getByRole('button')).toBeCollapsed();
expect(getByRole('details')).toBeCollapsed();
expect(getByRole('dialog')).toBeCollapsed();
```