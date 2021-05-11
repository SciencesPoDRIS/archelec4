import { FC, useEffect, useState } from "react";
import { config } from "../../config";
import { DatesFilterState, DatesFilterType, ESSearchQueryContext } from "../../types";
import { omitBy, isUndefined } from "lodash";

export const DatesFilter: FC<{
  filter: DatesFilterType;
  state: DatesFilterState;
  setState: (newState: DatesFilterState | null) => void;
  context: ESSearchQueryContext;
}> = ({ filter, state, setState }) => {
  const boundaries = {
    min: config.minYear,
    max: config.maxYear,
  };

  const [value, setValue] = useState<{ min: number; max: number }>({ ...boundaries, ...state.value });

  useEffect(() => {
    setValue({ ...boundaries, ...state.value });
    // eslint-disable-next-line
  }, [state]);

  function submit() {
    const min = Math.max(boundaries.min, Math.min(value.min, boundaries.max));
    const max = Math.max(min, Math.min(value.max, boundaries.max));
    setState({
      type: "dates",
      value: omitBy(
        { min: min === boundaries.min ? undefined : min, max: max === boundaries.max ? undefined : max },
        isUndefined,
      ),
    });
  }

  return (
    <div className="filter-block">
      <span className="filter-label">{filter.label}</span>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="flex">
          <label style={{ width: "2em" }} className="mr-2" htmlFor={`${filter.id}-min-input`}>
            De
          </label>
          <div className="fg">
            <input
              id={`${filter.id}-min-input`}
              className="w100"
              type="number"
              step="1"
              min={boundaries.min}
              max={value.max || boundaries.max}
              value={value.min || boundaries.min}
              placeholder={boundaries.min + ""}
              onChange={(e) => setValue({ min: +e.target.value, max: value.max })}
            />
          </div>
        </div>
        <div className="flex mv-1">
          <label style={{ width: "2em" }} className="mr-2" htmlFor={`${filter.id}-max-input`}>
            À
          </label>{" "}
          <div className="fg">
            <input
              id={`${filter.id}-max-input`}
              className="w100"
              type="number"
              step="1"
              min={value.min || boundaries.min}
              max={boundaries.max}
              value={value.max || boundaries.max}
              placeholder={boundaries.max + ""}
              onChange={(e) => setValue({ max: +e.target.value, min: value.min })}
            />
          </div>
        </div>
        <button
          className="btn btn-sm"
          type="submit"
          disabled={value.min === state.value.min && value.max === state.value.max}
        >
          Valider
        </button>
      </form>
    </div>
  );
};
