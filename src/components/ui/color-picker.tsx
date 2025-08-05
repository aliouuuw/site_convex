import * as React from "react"

interface ColorPickerProps {
  onColorSelect: (color: string) => void;
}

const colors = [
  "#000000", "#ffffff", "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#64748b",
  "#f87171", "#fb923c", "#facc15", "#4ade80", "#22d3ee", "#60a5fa",
  "#818cf8", "#a78bfa", "#f472b6", "#94a3b8"
];

export function ColorPicker({ onColorSelect }: ColorPickerProps) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {colors.map((color) => (
        <button
          key={color}
          className="w-8 h-8 rounded-md border-2 border-gray-200 hover:border-gray-400 transition-colors"
          style={{ backgroundColor: color }}
          onClick={() => onColorSelect(color)}
          title={color}
        />
      ))}
    </div>
  );
}
