import { Core } from "@asledgehammer/pipewrench";
import { CMYK_2_RGB, parseCMYK } from "../css/color/CMYK";
import { transparent } from "../css/color/Color";
import { parseHEX } from "../css/color/HEX";
import { HSL_2_RGB, parseHSL } from "../css/color/HSL";
import { parseRGB } from "../css/color/RGB";
import { RGBA, parseRGBA } from "../css/color/RGBA";
import { AbstractElement } from "../elements/AbstractElement";

export const formatColor = (
    element: AbstractElement<string>,
    value: string
): RGBA => {
    value = value.toLowerCase().trim();
    if (value.indexOf('#') === 0) return parseHEX(value, '1');
    else if (value.indexOf('cmyk(') !== -1) {
        return { ...CMYK_2_RGB(parseCMYK(value), '1'), a: 1 };
    } else if (value.indexOf('rgb(') !== -1) {
        return { ...parseRGB(value, '1'), a: 1 };
    } else if (value.indexOf('rgba(') !== -1) {
        return parseRGBA(value, '1');
    } else if (value.indexOf('hsl(') !== -1) {
        return { ...HSL_2_RGB(parseHSL(value), '1'), a: 1 };
    } else if (value.indexOf('inherit') !== -1) {
        if (element.parent != null) {
            return { ...element.parent.cache.backgroundColor.value };
        } else {
            return transparent();
        }
    } else if (
        value.indexOf('transparent') !== -1 ||
        value.indexOf('initial') !== -1 ||
        value.indexOf('none') !== -1 ||
        value.indexOf('unset') !== -1
    ) {
        return transparent();
    }
};

export const formatNumValue = (
    element: AbstractElement<string>,
    property: string,
    value: string
): number => {
    // TODO: Implement alternative lengths at scale.
    if (value.endsWith('px')) {
        let calcVal = tonumber(value.replace('px', ''));
        if (element.parent != null) {
            if (property === 'left') {
                calcVal += element.parent.cache.outer.x1;
            } else if (property == 'right') {
                calcVal = element.parent.cache.outer.x2 - (calcVal - element.cache.width.value);
            } else if (property == 'top') {
                calcVal += element.parent.cache.outer.y1;
            } else if (property == 'bottom') {
                calcVal = element.parent.cache.outer.y2 - (calcVal - element.cache.height.value);
            }
        }
        return calcVal;
    } else if (value.endsWith('%')) {
        let compare = 0;
        if (
            property === 'left' ||
            property === 'right' ||
            property === 'width' ||
            property === 'min-width' ||
            property === 'max-width'
        ) {
            compare =
                element.parent != null
                    ? element.parent.cache.width.value
                    : Core.getInstance().getScreenWidth();
        } else if (
            property === 'top' ||
            property === 'bottom' ||
            property === 'height' ||
            property === 'min-height' ||
            property === 'max-height'
        ) {
            compare =
                element.parent != null
                    ? element.parent.cache.height.value
                    : Core.getInstance().getScreenHeight();
        } else {
            // TODO: Future percentage checks.
            return 0;
        }
        return (compare * tonumber(value.replace('%', ''))) / 100.0;
    }
};