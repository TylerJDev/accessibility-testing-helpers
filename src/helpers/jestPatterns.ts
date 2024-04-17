import { accessibleMenuPattern } from "./menu/menu";

interface AccessibleMenuPatternOptions {
    component: any; // RenderResult;
    strict?: boolean;
    delay?: number;
    event: any;
}

export function accessibleMenuPatternJest({ component, strict, delay, event }: AccessibleMenuPatternOptions) {
    return accessibleMenuPattern({ component, strict, delay, event })
}
