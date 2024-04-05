import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Menu from '../examples/Menu';
import userEvent from '@testing-library/user-event';
import { triggerButton } from '../helpers/menu';

function ExampleMenu() {
    return (
        <Menu items={[{ name: 'Item 1' }, { name: 'Item 2' }, { name: 'Item 3' }]} />
    )
  }

describe('MenuPattern', () => {
    it('should have correct menu pattern', async () => {
        const component = render(<ExampleMenu />);

        const menuBtn = screen.getByRole('button', { name: 'Menu' });
        // await userEvent.click(menuBtn);

        // const menu = screen.getByRole('menu')
        // expect(menu).toBeTruthy();

        await triggerButton(component)
    });
});