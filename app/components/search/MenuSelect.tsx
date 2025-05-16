import { useEffect, useState } from "react";
import { useCurrentRefinements, useRefinementList } from "react-instantsearch";
import type { ChangeEvent } from "react";

interface Props {
  attribute: string;
  total?: number;
  attributeLabel?: string;
  operator?: "and" | "or";
}

const MenuSelect = ({ attribute, total, attributeLabel, operator }: Props) => {
  const { items, refine } = useRefinementList({
    attribute,
    operator: operator ?? "and",
  });

  const { refine: clear, items: currentRefinements } = useCurrentRefinements();

  const [selectedValue, setSelectedValue] = useState<string | undefined>("");

  useEffect(() => {
    setSelectedValue(items[0].isRefined ? items[0].value : "");
  }, [items]);

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
        className="w-36 p-1 border-2 rounded-sm text-sm capitalize"
        value={selectedValue}
        onChange={handleChange}
      >
        {items[0] && items.every((item) => !item.isRefined) ? (
          <option value="">{`Select ${attributeLabel ?? attribute}`}</option>
        ) : (
          <option value="all">{`All (${total})`}</option>
        )}
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
