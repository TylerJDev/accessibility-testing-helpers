import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Menu from '../examples/Menu';
import userEvent from '@testing-library/user-event';
import { accessibleMenuPatternJest } from '../helpers/jestPatterns';

function ExampleMenu() {
    return (
        <Menu items={[{ name: 'Item 1' }, { name: 'Item 2' }, { name: 'Item 3' }]} />
    )
  }

describe('MenuPattern', () => {
    it('should have correct menu pattern', async () => {
        const component = render(<ExampleMenu />);

        const menuBtn = screen.getByRole('button', { name: 'Menu' });
        await userEvent.click(menuBtn);

        const menu = screen.getByRole('menu')
        expect(menu).toBeTruthy();

        await accessibleMenuPatternJest({ component: component, event: userEvent})

        // const menu = accessibleMenuPatternJest({ component: component, event: userEvent})
        // expect(menu).toBeAccessible();

        // .toBeAccessible() would check the object returned from `menu` to see if it is accessible
        // based on the pattern that is being tested.
        // e.g.
        /*
            {
                'pattern': 'menu',
                'strict': true,
                'test-results': [{}, {}, ...]
            }
        */

        // if all the tests in the 'test-results' array pass, then the menu is accessible based on
        // the tests in `accessibleMenuPatternJest`
    });
});