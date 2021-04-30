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
      {histogram ? (
        <ul className="list-unstyled">
          {histogram.values.map(({ label, count }, i) => (
            <li key={i}>
              <div
                className="flex mv-1 filter-bar-container"
                onClick={(e) => {
                  valuesDict[label]
                    ? setState({ type: "terms", value: without(getArrayValue(state.value), label) })
                    : setState({ type: "terms", value: getArrayValue(state.value).concat([label]) });
                  e.preventDefault();
                }}
              >
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="#">{valuesDict[label] ? <strong>{label}</strong> : label}</a>
                <span className="sm grey fg ml-1">({count})</span>
                <button className="btn btn-light inline sm">
                  <i className={cx("fas mr-1", valuesDict[label] ? "fa-times" : "fa-plus")} />
                  {valuesDict[label] ? "Retirer" : "Filtrer"}
                </button>
              </div>
              <div className="sub-bar">
                <div style={{ width: (count / (histogram?.maxCount || 1)) * 100 + "%" }} />
              </div>
            </li>
          ))}
          {!!remainingCount && (
            <li className="sm grey">
              <i>
                ...et {remainingCount} autre{remainingCount > 1 ? "s" : ""} valeur{remainingCount > 1 ? "s" : ""}
              </i>
            </li>
          )}
        </ul>
      ) : (
        <Loader tag="h6" className="mv-1" />
      )}
    </div>
  );
};
