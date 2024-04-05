import {expect} from '@jest/globals';

type StatusResult = {
    result: boolean;
    type: string;
    message?: string | null;
}

function checkElementExpandedStatus(element: HTMLElement): StatusResult {
  const expandedStatus = element.getAttribute('aria-expanded');

  if (expandedStatus === 'true') {
    return {result: true, type: 'aria-expanded'};
  } else if (expandedStatus === 'false' || expandedStatus === null) {
    return {result: false, type: 'aria-expanded', message: expandedStatus};
  }

  // If `<details>` is used
  if (element instanceof HTMLDetailsElement && element?.open === true) {
    return {result: true, type: 'details'};
  } else if (element instanceof HTMLDetailsElement && element?.open === false) {
    return {result: false, type: 'details', message: 'Expected <details> to be "open"'};
  }

  // If `<dialog>` is used
  if (element instanceof HTMLDialogElement && element?.open === true) {
    return {result: true, type: 'dialog'};
  } else if (element instanceof HTMLDialogElement && element?.open === false) {
    return {result: false, type: 'dialog', message: `Expected <dialog> to be "open"`};
  }

  return {result: false, type: 'unknown', message: 'Element is not a recognized type for checking expanded status'};
}

function checkElementCollapsedStatus(element: HTMLElement):StatusResult  {
  const expandedStatus = element.getAttribute('aria-expanded');

  if (expandedStatus === 'false' || expandedStatus === null) {
    return {result: true, type: 'aria-expanded'};
  } else if (expandedStatus === 'true') {
    return {result: false, type: 'aria-expanded', message: expandedStatus};
  }

  // If `<details>` is used
  if (element instanceof HTMLDetailsElement && element?.open === false) {
    return {result: true, type: 'details'};
  } else if (element instanceof HTMLDetailsElement && element?.open === true) {
    return {result: false, type: 'details', message: `Expected <details> to not be "open"`};
  }

  // If `<dialog>` is used
  if (element instanceof HTMLDialogElement && element?.open === false) {
    return {result: true, type: 'dialog'};
  } else if (element instanceof HTMLDialogElement && element?.open === true) {
    return {result: false, type: 'dialog', message: `Expected <dialog> to not be "open"`};
  }

  return {result: false, type: 'unknown', message: 'Element is not a recognized type for checking expanded status'};
}

export function toBeExpanded(recieved: unknown) {
    if (recieved instanceof HTMLElement === false) {
        throw new TypeError('Element is not defined!');
    }

    const pass = checkElementExpandedStatus(recieved);

    if (pass.result) {
        return {
          message: () =>
            `Expected aria-expanded: value to equal "true" OR "<details>" | "<dialog>" to be "open"`,
          pass: true,
        };
      } else {
        return {
          message: () =>
            `Expected: aria-expanded value to equal "true" OR "<details>" | "<dialog>" to not be "open". \nRecieved: "${pass.message}"`,
          pass: false,
        };
    }
}

export function toBeCollapsed(recieved: unknown) {
    if (recieved instanceof HTMLElement === false) {
        throw new TypeError('Element is not defined!');
    }

    const pass = checkElementCollapsedStatus(recieved);

    if (pass.result) {
        return {
          message: () =>
            `Expected: aria-expanded value to equal "false" OR "<details>" | "<dialog>" to not be "open"`,
          pass: true,
        };
      } else {
        return {
          message: () =>
            `Expected: aria-expanded value to equal "false" OR "<details>" | "<dialog>" to not be "open". \nRecieved: ${pass.message}`,
          pass: false,
        };
    }
}

