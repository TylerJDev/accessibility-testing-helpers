declare namespace jest {
  interface Matchers<R> {
    /**
     * Use `.toBeExpanded` when checking if an element is expanded.
     * This checks if the element is expanded via `aria-expanded`, or if the element naturally expands (e.g. details/summary, dialog)
    */
    toBeExpanded(): R;
    /**
     * Use `.toBeCollapsed` when checking if an element is collapsed.
     * This checks if the element is collapsed via `aria-expanded`, or if the element naturally collapses (e.g. details/summary, dialog)
     */
    toBeCollapsed(): R;
  }
}