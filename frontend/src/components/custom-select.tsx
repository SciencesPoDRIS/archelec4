import { compact } from "lodash";
import ReactAsyncSelect, { AsyncProps } from "react-select/async";
import ReactAsyncCreatableSelect, { AsyncCreatableProps } from "react-select/async-creatable";
import ReactSelect, { GroupBase, Props } from "react-select";
import ReactCreatableSelect, { CreatableProps } from "react-select/creatable";

import { isWildcardSpecialValue, wildcardSpecialLabel } from "./filters/utils";

const CLASS_NAME = "react-select";
const CLASS_NAME_PREFIX = "react-select";
const COMMON_PROPS = {
  className: CLASS_NAME,
  classNamePrefix: CLASS_NAME_PREFIX,
  formatCreateLabel: (value: string) => `Rechercher "${value}"`,
  isValidNewOption: () => false,
};

export type OptionType = {
  value: string;
  label: string;
  isDisabled?: boolean;
};

/**
 * Utils functions to transform "React-Select" like values (ie `{value: string, label: string}`) to simpler (and URI
 * complient) strings, and vice versa:
 */
export function stringToObjectValue(
  value?: string | string[],
  options?: OptionType[],
): OptionType | OptionType[] | undefined {
  //recure on array
  if (Array.isArray(value)) return compact(value.map((v) => stringToObjectValue(v, options) as OptionType));
  if (typeof value !== "string") return value;
  if (isWildcardSpecialValue(value))
    // special value prefixed with WILDCARD to be used in a wildcard query
    return {
      value,
      label: wildcardSpecialLabel(value),
    };
  // default behaviour : find the value in options prop or return the value itself
  return options ? options.find((option) => option.value === value) : { label: value, value };
}
export function objectToStringValue(value?: OptionType | OptionType[]): string[] {
  if (Array.isArray(value)) return value.flatMap((v) => objectToStringValue(v));
  if (!value) return [];

  return [value.value];
}

export const Select = (props: Props<OptionType, boolean, GroupBase<OptionType>>) => (
  <ReactSelect {...{ ...COMMON_PROPS, ...props }} />
);
export const CreatableSelect = (props: CreatableProps<OptionType, boolean, GroupBase<OptionType>>) => (
  <ReactCreatableSelect {...{ ...COMMON_PROPS, ...props }} />
);

export const AsyncSelect = (props: AsyncProps<OptionType, boolean, GroupBase<OptionType>>) => (
  <ReactAsyncSelect {...{ ...COMMON_PROPS, ...props }} />
);
export const AsyncCreatableSelect = (props: AsyncCreatableProps<OptionType, boolean, GroupBase<OptionType>>) => (
  <ReactAsyncCreatableSelect {...{ ...COMMON_PROPS, ...props }} isClearable />
);
