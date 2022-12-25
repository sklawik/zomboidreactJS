export type ValueRange = { min: number; max: number };
export type NamedValue = { name: string; value: number };

export const RANGE_360 = { min: 0, max: 360 };
export const RANGE_255 = { min: 0, max: 255 };
export const RANGE_100 = { min: 0, max: 100 };
export const RANGE_1 = { min: 0, max: 1 };

/**
 * Tests values with assigned names, ensuring that all values passed are not null, undefined, NaN, and infinite.
 *
 * @param namedValues The values to test.
 *
 * @throws Error - Thrown when a value is null, undefined, NaN, or infinite.
 */
export const checkValues = (...namedValues: NamedValue[]) => {
  for (const namedValue of namedValues) {
    const { name, value } = namedValue;
    if (value == null || isNaN(value) || !isFinite(value)) {
      throw new Error(
        `The value '${name}' as null, NaN, or Infinite: ${value}`
      );
    }
  }
};

/**
 * A simple clamp where a value is limited to a range.
 *
 * @param value The value to clamp.
 * @param min The minimum accepted value.
 * @param max The maximum accepted value.
 *
 * @returns The clamped value.
 */
export const clamp = (value: number, range: ValueRange): number => {
  return math.min(math.max(range.min, value), range.max);
};

/**
 * Calculates a value between a range of values from a percentage value of 0.0 to 1.0.
 *
 * @param percent The percentage to calculate between the range.
 * @param range The range to calculate from min to max.
 * @param clampValue If true, values below range.min or exceeding range.max are clamped to their respective value.
 *
 * @returns The calculated value between the range based on the percent.
 */
export const lerp = (
  percent: number,
  range: ValueRange = { min: 0, max: 1 },
  clampValue: boolean = true
): number => {
  const val = range.min + percent * (range.max - range.min);
  return clampValue ? clamp(val, range) : val;
};

export const unlerp = (start: number, stop: number, value: number): number => {
  checkValues(
    { name: 'start', value: start },
    { name: 'stop', value: stop },
    { name: 'value', value }
  );
  if (value == stop || start == stop) return 1;
  const swap = start > stop;
  if (swap) {
    const temp = start;
    start = stop;
    stop = temp;
  }
  if (swap) return 1.0 - (value - start) / (stop - start);
  else return (value - start) / (stop - start);
};

export const easeInOut = (t: number): number => {
  checkValues({ name: 't', value: t });
  return t > 0.5 ? 4 * Math.pow(t - 1, 3) + 1 : 4 * Math.pow(t, 3);
};

export const easeIn = (t: number): number => {
  checkValues({ name: 't', value: t });
  return 1.0 - Math.cos(t * Math.PI * 0.5);
};

export const easeOut = (t: number): number => {
  checkValues({ name: 't', value: t });
  return Math.sin(t * Math.PI * 0.5);
};
