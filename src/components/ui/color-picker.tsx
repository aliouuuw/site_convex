import * as React from "react"
import { HexColorPicker } from "react-colorful"

import { cn } from "@/lib/utils"

interface ColorPickerProps {
  onColorSelect: (color: string) => void
  className?: string
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorSelect, className }) => {
  const [color, setColor] = React.useState("#000000")

  const handleChange = (newColor: string) => {
    setColor(newColor)
    onColorSelect(newColor)
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <HexColorPicker
        color={color}
        onChange={handleChange}
        className="!w-full !h-32 !rounded-md !border !border-gray-200"
      />
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={color}
          onChange={(e) => handleChange(e.target.value)}
          className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
        />
        <input
          type="text"
          value={color}
          onChange={(e) => handleChange(e.target.value)}
          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-md"
          placeholder="#000000"
        />
      </div>
    </div>
  )
}

export { ColorPicker }
