import { FC, useEffect, useState } from "react";

import {
  OptionType,
  stringToObjectValue,
  AsyncCreatableSelect,
  CreatableSelect,
  objectToStringValue,
} from "../../components/custom-select";
import { TermsFilterType, ESSearchQueryContext } from "../../types";

import { useStateUrl } from "../../hooks/state-url";

const SEPARATOR = "|";
export const TermsFilter: FC<{
  filter: TermsFilterType;
  context: ESSearchQueryContext;
}> = ({ filter, context }) => {
  // const remainingCount = histogram ? histogram.total - histogram.values.length : 0;
  // const valuesDict: PlainObject<boolean> = mapValues(keyBy(getArrayValue(state.value)), constant(true));

  const [termsUrl, setTermsUrl] = useStateUrl<string>(filter.id, "");

  const [terms, setTerms] = useState<string[]>([]);
  useEffect(() => {
    setTerms(termsUrl && termsUrl !== "" ? termsUrl.split(SEPARATOR) : []);
  }, [termsUrl]);

  // TODO:
  // Find a better way to invalidate cache.
  // Indeed, here, the cache must be invalidated when the given context
  // changes. But react-select does not provide a way to invalidate cache on
  // **the current input**, only on previous/upcoming inputs.
  return (
    <div className="filter-block" role="search">
      <label htmlFor={filter.id} className="filter-label">
        {filter.label}
      </label>

      <div>
        {filter.asyncOptions ? (
          <AsyncCreatableSelect
            key={JSON.stringify(context)}
            inputId={filter.id}
            loadOptions={(inputValue: string) => filter.asyncOptions && filter.asyncOptions(inputValue, context)}
            value={stringToObjectValue(terms)}
            isMulti={!!filter.isMulti}
            placeholder={"Sélectionner..."}
            noOptionsMessage={() => "Aucune option disponible dans les filtres actuels"}
            defaultOptions
            onChange={(value: any) =>
              setTermsUrl(objectToStringValue(value as OptionType | OptionType[]).join(SEPARATOR))
            }
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                neutral50: "rgb(0,0,0,0.7)", // Placeholder color
              },
            })}
            aria-multiselectable={true}
          />
        ) : (
          <CreatableSelect options={filter.options} value={stringToObjectValue(terms)} isMulti={filter.isMulti} />
        )}
      </div>
    </div>
  );
};
