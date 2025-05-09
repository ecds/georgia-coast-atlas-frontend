import { useState } from "react";
import { useCurrentRefinements, useRefinementList } from "react-instantsearch";
import type { ChangeEvent } from "react";

interface Props {
  attribute: string;
}

const MenuSelect = ({ attribute }: Props) => {
  const { items, refine } = useRefinementList({
    attribute,
    operator: "or",
  });

  const { refine: clear, items: currentRefinements } = useCurrentRefinements();

  const [selectedValue, setSelectedValue] = useState<string | undefined>("all");

  const totalCount = items
    .map((item) => item.count)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const handleChange = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    const currentRefinement = currentRefinements.find(
      (r) => r.attribute === "categories"
    );
    if (target.value === "all" && currentRefinement) {
      for (const refinement of currentRefinement.refinements) {
        clear(refinement);
      }
      setSelectedValue("all");
    } else {
      refine(target.value);
      setSelectedValue(target.value);
    }
  };

  return (
    <div className="mt-4 ms-6 ">
      <h2 className="capitalize text-lg">{attribute}</h2>
      <select
        className="w-36 p-1 border-2 rounded-sm"
        value={selectedValue}
        onChange={handleChange}
      >
        <option value="all">{`All (${totalCount})`}</option>
        {items.map((item) => (
          <option key={item.label} value={item.value}>
            {item.label} ({item.count})
          </option>
        ))}
      </select>
    </div>
  );
};

export default MenuSelect;
