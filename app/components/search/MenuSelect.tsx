import { useEffect, useState } from "react";
import { useClearRefinements, useRefinementList } from "react-instantsearch";

interface Props {
  attribute: string;
}

const MenuSelect = ({ attribute }: Props) => {
  const { items, refine } = useRefinementList({
    attribute,
    operator: "or",
  });
  const { refine: clear } = useClearRefinements();

  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    "Historical"
  );

  useEffect(() => {
    clear();
    refine(selectedValue ?? "Historical");
  }, [selectedValue, refine, clear]);

  return (
    <div>
      <h2 className="capitalize">{attribute}</h2>
      <select
        value={selectedValue ?? "Historical"}
        onChange={(event) => {
          setSelectedValue(event.target.value);
        }}
      >
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
