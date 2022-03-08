import { FC, ReactElement, useEffect, useState } from "react";

import {
  OptionType,
  stringToObjectValue,
  AsyncCreatableSelect,
  CreatableSelect,
  objectToStringValue,
} from "../../components/custom-select";
import { TermsFilterType, ESSearchQueryContext } from "../../types";

import { useStateUrl } from "../../hooks/state-url";
import { IoMdInformationCircleOutline } from "react-icons/io";

const SEPARATOR = "|";
export const TermsFilter: FC<{
  filter: TermsFilterType;
  context: ESSearchQueryContext;
  setTooltipMessage: (message: { element: ReactElement; x: number; y: number } | null) => void;
}> = ({ filter, context, setTooltipMessage }) => {
  // const remainingCount = histogram ? histogram.total - histogram.values.length : 0;
  // const valuesDict: PlainObject<boolean> = mapValues(keyBy(getArrayValue(state.value)), constant(true));

  const [termsUrl, setTermsUrl] = useStateUrl<string>(filter.id, "");

  const [terms, setTerms] = useState<string[]>([]);
  useEffect(() => {
    setTerms(termsUrl && termsUrl !== "" ? termsUrl.split(SEPARATOR) : []);
  }, [termsUrl]);

  const showDescription: React.MouseEventHandler<SVGElement> = (e) =>
    setTooltipMessage({ element: <span>{filter.description}</span>, x: e.nativeEvent.x, y: e.nativeEvent.y });

  // TODO:
  // Find a better way to invalidate cache.
  // Indeed, here, the cache must be invalidated when the given context
  // changes. But react-select does not provide a way to invalidate cache on
  // **the current input**, only on previous/upcoming inputs.
  return (
    <div className="filter-block" role="search">
      <div className="d-flex justify-content-between align-items-center">
        <label htmlFor={filter.id} className="filter-label">
          {filter.label}
        </label>
        {filter.description && (
          <IoMdInformationCircleOutline
            className="ml-3"
            title={filter.description}
            size={"1.2rem"}
            onMouseEnter={showDescription}
            onMouseLeave={() => setTooltipMessage(null)}
          />
        )}
      </div>
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
