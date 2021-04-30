import React from "react";
import { CreatableSelect, OptionType } from "./custom-select";
import { SortType } from "../types";

// Props definition
interface Props {
  value: SortType;
  options: Array<SortType>;
  onChange: (selectec: SortType) => void;
}

function castSortTypeToOption(sort: SortType): OptionType {
  return {
    label: sort.label,
    value: sort.label,
  };
}

export const SearchSort: React.FC<Props> = (props: Props) => {
  const { options, value, onChange } = props;

  return (
    <div>
      <h4>
        <span className="highlight">
          <i className="fas fa-sort-amount-down-alt mr1"></i>Trier par
        </span>
      </h4>

      <CreatableSelect
        options={options.map(castSortTypeToOption)}
        value={castSortTypeToOption(value)}
        onChange={(data: any) => {
          const sortObj = options.find((o) => o.label === data.value);
          if (sortObj) onChange(sortObj);
        }}
      />
    </div>
  );
};
