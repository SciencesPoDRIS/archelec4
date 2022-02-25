import { useHistory, useLocation } from "react-router-dom";

type SetterInputFunction<Z> = (prev: Z) => Z;

// This magic is messy when working with string.
// TODO: add a cast method params to useStateUrl definition to define when and how to cast string into T
/**
 * Guess the type of a string and return it casted.
 * examples:
 *   - "true" => true
 *   - "10.1" => 10.1
 */
export function stringGuessCast(value: string): any {
  if (value !== null && value !== "") {
    if (isNaN((value as unknown) as number) === false) {
      return parseFloat(value) % 1 === 0 ? parseInt(value) : (parseFloat(value) as unknown);
    }
    if (value === "false" || value === "true") {
      return (value === "true") as unknown;
    }
  }
  return value;
}

/**
 * Hook to manage a variable in the url.
 *
 * @param key {string} Name of the variable
 * @param defaultValue {string} The default / initial value of the attribute (not set in the url)
 * @param replace {boolean} When the url change; do we replace or put in the history
 */
export function useStateUrl<T>(
  key: string,
  defaultValue: T,
  replace = false,
): [T, (value: T | SetterInputFunction<T>) => void, (value: T | SetterInputFunction<T>) => Partial<Location> | null] {
  const history = useHistory();

  const location = useLocation();

  /**
   * Retrieve the value of the given parameter.
   */
  function getQueryParam(key: string): T {
    const urlQueryParams = new URLSearchParams(window.location.search);
    const value = urlQueryParams.get(key);

    if (value === null) {
      return defaultValue;
    } else {
      return (value as unknown) as T;
    }
  }

  /**
   * Given a parameter, it returns the setter for it.
   */
  function getSetQueryParam(key: string): (value: T | SetterInputFunction<T>) => void {
    return (value: T | SetterInputFunction<T>): void => {
      const urlQueryParams = new URLSearchParams(window.location.search);
      const prevValue = getQueryParam(key);
      const computedValue = typeof value === "function" ? (value as SetterInputFunction<T>)(prevValue) : value;
      if (computedValue !== prevValue) {
        if (computedValue !== defaultValue) {
          urlQueryParams.set(key, computedValue + "");
        } else {
          urlQueryParams.delete(key);
        }
        if (replace) {
          history.replace({ search: `?${urlQueryParams.toString()}` });
        } else {
          history.push({ search: `?${urlQueryParams.toString()}` });
        }
      }
    };
  }

  /**
   * returns the new state as a URL to be used in direct link
   */
  function getLinkURL(key: string): (value: T | SetterInputFunction<T>) => Partial<Location> | null {
    return (value: T | SetterInputFunction<T>): Partial<Location> | null => {
      const urlQueryParams = new URLSearchParams(location.search);
      const prevValue = getQueryParam(key);
      const computedValue = typeof value === "function" ? (value as SetterInputFunction<T>)(prevValue) : value;
      if (computedValue !== prevValue) {
        if (computedValue !== defaultValue) {
          urlQueryParams.set(key, computedValue + "");
        } else {
          urlQueryParams.delete(key);
        }
        return { ...location, search: urlQueryParams.toString() };
      }
      return null;
    };
  }

  return [getQueryParam(key), getSetQueryParam(key), getLinkURL(key)];
}
