import {act, RenderResult} from '@testing-library/react'
// `role="menu"` test

/**
 * Expected keyboard navigation:
 *
 * Trigger button:
 *
 * Enter: Open the menu
 * Space: Open the menu
 * ArrowDown: Open the menu
 * ArrowUp: Open the menu
 * ArrowRight: Open the menu
 * ArrowLeft: Open the menu
 *
 * Menu items:
 *
 * ArrowUp: Cycle through items starting with current item to previous item
 * ArrowDown: Cycle through items starting with current item to next item
 * ArrowLeft: Closes submenu and sets focus back to parent item
 * ArrowRight: Opens submenu and sets focus to first item
 * Enter: Triggers the focused item
 * Space: Triggers the focused item
 * Home: Sets focus to first item
 * PageUp: Sets focus to first item
 * End: Sets focus to last item
 * PageDown: Sets focus to last item
 * Escape: Closes the menu
 */

const validElemRole = ['menuitem', 'menuitemradio', 'menuitemcheckbox']

export async function expandEvent({ keys, elem, delay, event: userEvent, expect }) {
  // Is there a way to determine with context this function is currently in? (Jest, Playwright)

  // Jest:
  for (const key of keys) {
    act(() => {
      elem.focus()
    })

    await userEvent.keyboard(`{${key}}`)
    // TODO: Add back - expect(elem).toBeExpanded()

    const elemRole = document.activeElement?.getAttribute('role')

    expect(validElemRole).toContain(elemRole)

    if (delay) await delay();
    await userEvent.keyboard(`{Escape}`)

    // TODO: Add back - expect(elem).toBeCollapsed();
    expect(document.activeElement).toBe(elem)
  }

  // Playwright: TODO
}

// TODO: Annotations
// This function is the expectation of what element should be focused after a certain key is pressed
const menuNavigation = (menuElem: HTMLElement) => {
  return {
    ArrowUp: menuElem.lastElementChild,
    ArrowDown: menuElem.firstElementChild,
    ArrowLeft: [menuElem.firstElementChild, menuElem.lastElementChild], // TODO!: If the menu is horizontal, it may also navigate to the previous menu item
    ArrowRight: menuElem.firstElementChild, // As above, but for the next menu item
    Home: menuElem.firstElementChild,
    PageUp: menuElem.firstElementChild,
    End: menuElem.lastElementChild,
    PageDown: menuElem.lastElementChild, // TODO!: See why this works
  }

  // {ArrowUp: {target: menuElem.lastElementChild, message: '...', strict: true}}
}

export async function navigationEvent({ elem, component, strict, delay, event: userEvent, expect }) {
  // What we need to test:
  // 1. Open the menu
  // 2. [DONE] Ensure that first menu item receives focus (https://github.com/github/a11y-nav-testing/blob/main/lib/wai-aria/menu.ts#L27)
  // 3. [TODO] Ensure that focus trap loops properly (https://github.com/github/a11y-nav-testing/blob/main/lib/wai-aria/menu.ts#L68)
  // 4. [DONE] Ensure that 'Home' and 'End' keys work properly
  // 5. [DONE] Ensure that 'PageUp' and 'PageDown' keys work properly
  // Other things to consider:
  // - Ensure that the menu is closed when pressing "Tab and Shift + Tab" (https://github.com/github/a11y-nav-testing/blob/main/lib/wai-aria/menu.ts#L126)
  // - Test submenu navigation (https://github.com/github/a11y-nav-testing/blob/main/lib/wai-aria/menu.ts#L214)
  // - [DONE] Test character navigation (https://github.com/github/a11y-nav-testing/blob/main/lib/wai-aria/menu.ts#L495)
  // Jest:

  act(() => {
    elem.focus()
  })

  // Steps [1]
  await userEvent.keyboard(`{Enter}`)

  const menu = component.getByRole('menu')
  const menuNavigationSteps = menuNavigation(menu)

  // Steps [2, 4, 5]
  for (const key of Object.keys(menuNavigationSteps)) {
    if (delay) await delay();
    // TODO: Can we make this easier to debug without messing with the internals of this script?
    // TODO: (e.g. a log statement that only shows if something is true in the environment)
    await userEvent.keyboard(`{${key}}`)

    if (menuNavigationSteps[key] instanceof Array) {
      expect(menuNavigationSteps[key]).toContain(document.activeElement?.closest('li'))
      continue
    }

    expect(document.activeElement?.closest('li')).toBe(menuNavigationSteps[key])
    // TODO: If submenu, do ...
  }

  if (strict) {
    const menu = component.getByRole('menu')
    // Test character navigation
    // TODO, make this a function
    await userEvent.keyboard(`{Escape}`)
    await userEvent.keyboard(`{Enter}`)

    // TODO: Maybe make this optional? If there aren't any valid characters (e.g. reaction emoji only menu), then -
    // TODO: we should test this step, as there's no "alphanumeric" character to test.
    const menuItems = menu.querySelectorAll('li') // TODO!: This should test menuitem, menuitemradio, and menuitemcheckbox.

    // Get the menu item in the middle
    const middleMenuItem = menuItems[Math.floor(menuItems.length / 2)]
    const characterKey = middleMenuItem?.textContent?.[0];

    expect(document.activeElement).toBe(menuItems[0])
    await userEvent.keyboard(`{${characterKey}}`)
    expect(document.activeElement).toBe(middleMenuItem)
  }
  // TODO: Test Tab and Shift + Tab functionality

  // Steps [3]
  //   await userEvent.keyboard(`{Enter}`)
  //   menu = component.getByRole('menu') // TODO: Is this necessary?

  //   for (const item of menu.children) {
  //     await userEvent.keyboard(`{ArrowDown}`)
  //     expect(document.activeElement).toBe(item)
  //   }
}

export async function activationEvent(elem: HTMLButtonElement, component, strict) {
  return true
}

// Could we add a custom matcher
// example custom matcher
// toBeExpanded, checks if a component is expanded or not via `aria-expanded`, or if the component naturally expands (e.g. details/summary, dialog, etc.)
// Add a way to bubble up what exactly failed in an easier way to digest

interface AccessibleMenuPatternOptions {
  component: RenderResult;
  strict?: boolean;
  delay?: number;
  event: any;
  expectType: any;
}

// TODO: Would strict be suited better as some global var?
export async function accessibleMenuPattern({ component, strict = false, delay = 0, event, expectType }: AccessibleMenuPatternOptions) {
  // TEST: Do all of the expected keyboard interactions for the trigger button work properly?
  const supportedTriggerKeys = ['Enter', ' ', 'ArrowDown', 'ArrowUp'] //, 'ArrowRight', 'ArrowLeft']
  const elem = component.getByRole('button') as HTMLButtonElement
  const delayBy = delay ? (ms = delay) => new Promise(resolve => setTimeout(resolve, ms)) : null;
  const assertion = !expectType ? expect : expectType

  // We can make this usable in both Jest and Playright tests, somehow
  // Jest utilizes `fireEvent` or `userEvent`
  // With `fireEvent`, we can do `fireEvent.keyDown(elem, {key: 'Enter'})`
  // With `userEvent`, we can do `userEvent.type(elem, '{enter}')`

  // Likewise with Playwright, we can do `elem.keyboard.press('Enter')`

  await expandEvent({ keys: supportedTriggerKeys, elem, delay: delayBy, event, expect: assertion })
  await navigationEvent({ elem, component, strict, delay: delayBy, event, expect: assertion })
  // await activationEvent(elem, component, strict, event)
}
