import { FC } from "react";

import {
  OptionType,
  stringToObjectValue,
  AsyncCreatableSelect,
  CreatableSelect,
  objectToStringValue,
} from "../../components/custom-select";
import { TermsFilterState, TermsFilterType, FilterHistogramType, ESSearchQueryContext, PlainObject } from "../../types";

import { compact, keyBy, mapValues, constant, without } from "lodash";
import { Loader } from "../loader";
import cx from "classnames";

function getArrayValue(value: string | string[] | undefined): string[] {
  return Array.isArray(value) ? value : compact([value]);
}

export const TermsFilter: FC<{
  filter: TermsFilterType;
  state: TermsFilterState;
  histogram?: FilterHistogramType;
  setState: (newState: TermsFilterState | null) => void;
  context: ESSearchQueryContext;
}> = ({ filter, state, setState, context, histogram }) => {
  const remainingCount = histogram ? histogram.total - histogram.values.length : 0;
  const valuesDict: PlainObject<boolean> = mapValues(keyBy(getArrayValue(state.value)), constant(true));

  // TODO:
  // Find a better way to invalidate cache.
  // Indeed, here, the cache must be invalidated when the given context
  // changes. But react-select does not provide a way to invalidate cache on
  // **the current input**, only on previous/upcoming inputs.
  return (
    <div className="filter-block">
      <h5>
        <span className="highlight">{filter.label}</span>
      </h5>
      <div>
        {filter.asyncOptions ? (
          <AsyncCreatableSelect
            key={JSON.stringify(context)}
            loadOptions={(inputValue: string) => filter.asyncOptions && filter.asyncOptions(inputValue, context)}
            value={stringToObjectValue(state.value)}
            isMulti={!!filter.isMulti}
            placeholder={"Rechercher une valeur..."}
            noOptionsMessage={() => "Aucune option disponible dans les filtres actuels"}
            defaultOptions
            onChange={(value: any) =>
              setState({ type: "terms", value: objectToStringValue(value as OptionType | OptionType[]) })
            }
          />
        ) : (
          <CreatableSelect options={filter.options} value={stringToObjectValue(state.value)} isMulti={filter.isMulti} />
        )}
      </div>
    </div>
  );
};
