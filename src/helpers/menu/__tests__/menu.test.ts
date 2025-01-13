import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event';
import { getByLabelText, getByRole } from '@testing-library/dom'
import { accessibleMenuPatternJest } from '../../jestPatterns'


function menuExample() {
  const div = document.createElement('div')
  div.innerHTML = `
    <button aria-haspopup="true" id="menuButton">Menu</button>
    <div role="menu" id="menu" style="display: none;">
      <div role="menuitem" tabindex="-1">Menu Item 1</div>
      <div role="menuitem" tabindex="-1">Menu Item 2</div>
      <div role="menuitem" tabindex="-1">Menu Item 3</div>
    </div>
  `
  const button = div.querySelector('#menuButton')
  const menu: HTMLElement = div.querySelector('#menu')!

  button?.addEventListener('click', () => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true'
    button.setAttribute('aria-expanded', String(!isExpanded))
    menu.style.display = isExpanded ? 'none' : 'block'

    // Focus the first menuitem
    // menu.querySelectorAll('[role="menuitem"]')[0].focus()
  })

  return div
}

describe('Menu Button', () => {
    test('renders a button and checks if it is clickable', async () => {
        const container = menuExample()
        getByRole(container, 'button');

        await accessibleMenuPatternJest({ component: container, event: userEvent})
    });
});