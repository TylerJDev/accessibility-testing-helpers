import { act, RenderResult } from '@testing-library/react'
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

  const tests = {
    'has-role': {
      pass: false,
      description: `The menu has one of the valid roles: ${validElemRole.join(', ')}`,
      expected: 'The menu should have a valid role'
    },
    'is-active': {
      pass: false,
      description: `The menu's trigger element has focus when the menu is closed`,
      expected: 'The menu trigger should have focus when the menu is closed'
    },
  }

  // Jest:
  for (const key of keys) {
    act(() => {
    elem.focus()

    console.log(document.activeElement, 'button?', elem)
    })

    await userEvent.keyboard(`{${key}}`)
    // TODO: Add back - expect(elem).toBeExpanded()

    const elemRole = document.activeElement?.getAttribute('role')

    // TODO: Remove [Passion Week]
    // expect(validElemRole).toContain(elemRole)

    // console.log(document.activeElement)

    if (elemRole) {
      tests['has-role'].pass = validElemRole.includes(elemRole)
    }

    if (delay) await delay();
    await userEvent.keyboard(`{Escape}`)

    // TODO: Add back - expect(elem).toBeCollapsed();

    // TODO: Remove [Passion Week]
    // expect(document.activeElement).toBe(elem)

    tests['is-active'].pass = document.activeElement === elem
  }

  console.log(tests, 'here')
  return tests;
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
}

export async function navigationEvent({ elem, component, strict, delay, event: userEvent, expect }) {
  const tests = {
    'keyboard-navigation': [],
  }

  act(() => {
    elem.focus()
  })

  // Steps [1]
  await userEvent.keyboard(`{Enter}`)

  // const menu = component.getByRole('menu')
  const menu = component.querySelector('[role="menu"]')
  const menuNavigationSteps = menuNavigation(menu)

  // Steps [2, 4, 5]
  for (const key of Object.keys(menuNavigationSteps)) {
    if (delay) await delay();
    // TODO: Can we make this easier to debug without messing with the internals of this script?
    // TODO: (e.g. a log statement that only shows if something is true in the environment)
    await userEvent.keyboard(`{${key}}`)

    if (menuNavigationSteps[key] instanceof Array) {
      expect(menuNavigationSteps[key]).toContain(document.activeElement?.closest('li'))
      const result = menuNavigationSteps[key].includes(document.activeElement?.closest('li'))


      // expected ...
      test['keyboard-navigation'].push({
        pass: result,
        description: `Focus should be on one of the menu items`,
        expected: ``
      })

      // test['keyboard-navigation'].push(menuNavigationSteps[key].includes(document.activeElement?.closest('li')))
      continue
    }

    expect(document.activeElement?.closest('li')).toBe(menuNavigationSteps[key])
    // test['keyboard-navigation'].push(document.activeElement?.closest('li') === menuNavigationSteps[key])
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
}

export async function activationEvent(elem: HTMLButtonElement, component, strict) {
  return true
}

interface AccessibleMenuPatternOptions {
  component: HTMLElement;
  strict?: boolean;
  delay?: number;
  event: any;
  expectType?: any;
}

// TODO: Would strict be suited better as some global var?
export async function accessibleMenuPattern({ component, strict = false, delay = 0, event, expectType }: AccessibleMenuPatternOptions) {
  // TEST: Do all of the expected keyboard interactions for the trigger button work properly?
  const supportedTriggerKeys = ['Enter', ' ', 'ArrowDown', 'ArrowUp'] //, 'ArrowRight', 'ArrowLeft']
  const triggerElem = component.getByRole('button');

  const delayBy = delay ? (ms = delay) => new Promise(resolve => setTimeout(resolve, ms)) : null;
  const assertion = !expectType ? expect : expectType

  const expandResult = await expandEvent({ keys: supportedTriggerKeys, elem: triggerElem, delay: delayBy, event, expect: assertion })
  // const navigationResult = await navigationEvent({ elem: triggerElem, component, strict, delay: delayBy, event, expect: assertion })
}
