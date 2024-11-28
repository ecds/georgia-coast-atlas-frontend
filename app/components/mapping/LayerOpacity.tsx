interface Props {
  opacity: number;
  handleChange: (newValue: string) => void;
  disabled: boolean;
  id: string;
}

const LayerOpacity = ({ opacity, handleChange, disabled, id }: Props) => {
  return (
    <div className="w-max">
      <input
        type="range"
        min={0}
        max={100}
        step={5}
        value={opacity}
        onInput={({ target }) =>
          handleChange((target as HTMLInputElement).value)
        }
        className="cursor-ew-resize w-full"
        id={`opacity-${id}`}
        disabled={disabled}
      />
      <label
        htmlFor={`opacity-${id}`}
        className={disabled ? "text-black/65" : "text-black"}
      >
        Opacity {opacity}%
      </label>
    </div>
  );
};

export default LayerOpacity;
