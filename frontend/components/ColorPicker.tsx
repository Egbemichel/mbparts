interface ColorPickerProps {
    colors: string[];
    selectedColor: string;
    onSelect: (color: string) => void;
}

export default function ColorPicker({ colors, selectedColor, onSelect }: ColorPickerProps) {
    return (
        <div className="flex gap-2 mt-4">
            {colors.map(color => (
                <button
                    key={color}
                    className={`w-6 h-6 rounded-full border-2 ${selectedColor === color ? 'border-black' : 'border-gray-300'}`}
                    style={{ backgroundColor: color }}
                    onClick={() => onSelect(color)}
                />
            ))}
        </div>
    );
}
