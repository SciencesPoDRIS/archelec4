import { FC, useEffect, useMemo, useState } from "react";
import { config } from "../../config";
import { DatesFilterType } from "../../types";
import { useStateUrl } from "../../hooks/state-url";

export const DatesFilter: FC<{
  filter: DatesFilterType;
}> = ({ filter }) => {
  const boundaries = useMemo(
    () => ({
      min: config.minYear,
      max: config.maxYear,
    }),
    [],
  );

  const [minDateUrl, setMinDateUrl] = useStateUrl<string>(`${filter.id}.min`, "" + boundaries.min);
  const [maxDateUrl, setMaxDateUrl] = useStateUrl<string>(`${filter.id}.max`, "" + boundaries.max);

  const [value, setValue] = useState<{ min: number; max: number }>(boundaries);
  useEffect(() => {
    setValue({
      min: minDateUrl && minDateUrl !== "" ? parseInt(minDateUrl) : boundaries.min,
      max: maxDateUrl && maxDateUrl !== "" ? parseInt(maxDateUrl) : boundaries.max,
    });
  }, [minDateUrl, maxDateUrl, boundaries]);

  function submit() {
    const min = Math.max(boundaries.min, Math.min(value.min, boundaries.max));
    const max = Math.max(min, Math.min(value.max, boundaries.max));
    setMinDateUrl(min === boundaries.min ? "" : "" + min);
    setMaxDateUrl(max === boundaries.max ? "" : "" + max);
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
          disabled={value.min === parseInt(minDateUrl) && value.max === parseInt(maxDateUrl)}
        >
          Valider
        </button>
      </form>
    </div>
  );
};
