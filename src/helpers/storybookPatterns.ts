import { accessibleMenuPattern } from "./menu/menu";
import { expect } from '@storybook/jest'

export function accessibleMenuPatternStorybook({ component, strict, delay, event}) {
    return accessibleMenuPattern({ component, strict, delay, event, expectType: expect })
}
