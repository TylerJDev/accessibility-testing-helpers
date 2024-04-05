import React, { useEffect, useState } from 'react';


interface Props {
    items: { name: string }[]
}

const Menu = ({items}: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const toggleMenu = (e) => {
        // if the event is a key press of "enter" or "space", toggle the menu
        // if the event is a click, toggle the menu
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            setIsOpen(!isOpen);
            return;
        };

        if (e.type === 'click') {
            setIsOpen(!isOpen);
            return
        };
    };

    useEffect(() => {
        if (isOpen) {
            const menu = document.querySelector('[role="menu"]') as HTMLButtonElement
            const menuItems: NodeListOf<HTMLElement> = menu.querySelectorAll('[role="menuitem"]');
            menuItems[0]?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            const menuItems = document.querySelectorAll('[role="menuitem"]');
            menuItems[index]?.focus();
        }
    }, [index]);

    const menuNavigation = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            // Move focus to the next item
            setIndex(index === items.length - 1 ? 0 : index + 1);
        } else if (e.key === 'ArrowUp') {
            // Move focus to the previous item
            setIndex(index === 0 ? items.length - 1 : index - 1);
        } else if (e.key === 'Home') {
            // Move focus to the first item
            setIndex(0);
        } else if (e.key === 'End') {
            // Move focus to the last item
            setIndex(items.length - 1);
        } else if (e.key === 'Escape') {
            // Close the menu
            setIsOpen(false);
            document.querySelector('#trigger')?.focus();
            return;
        }

        document.querySelectorAll('[role="menuitem"]')[index].focus();
    }

    return (
        <div>
            <button id="trigger" onKeyDown={toggleMenu} onClick={toggleMenu} aria-expanded={isOpen ? 'true' : null}>
                Menu
            </button>
            {isOpen && (
                <ul role="menu" onKeyDown={menuNavigation}>
                    {items.map((item, i) => (
                        <li key={i} role="menuitem" tabIndex={index === i ? 0 : -1}>{item.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Menu;