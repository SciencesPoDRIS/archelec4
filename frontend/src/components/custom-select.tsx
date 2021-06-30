import React from "react";
import { compact } from "lodash";
import ReactSelect, { Props as ReactSelectProps } from "react-select";
import ReactAsyncSelect, { Props as ReactAsyncSelectProps } from "react-select/async";
import ReactCreatableSelect, { Props as ReactCreatableSelectProps } from "react-select/creatable";
import ReactAsyncCreatableSelect, { Props as ReactAsyncCreatableSelectProps } from "react-select/async-creatable";
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

export const Select = (props: ReactSelectProps<OptionType>) => <ReactSelect {...{ ...COMMON_PROPS, ...props }} />;
export const AsyncSelect = (props: ReactAsyncSelectProps<OptionType, boolean>) => (
  <ReactAsyncSelect {...{ ...COMMON_PROPS, ...props }} />
);
export const CreatableSelect = (props: ReactCreatableSelectProps<OptionType, boolean>) => (
  <ReactCreatableSelect {...{ ...COMMON_PROPS, ...props }} />
);
export const AsyncCreatableSelect = (props: ReactAsyncCreatableSelectProps<OptionType, boolean>) => (
  <ReactAsyncCreatableSelect {...{ ...COMMON_PROPS, ...props }} />
);
