'use client'

import { Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CartButton({handlePlus, handleMinus, count, buttonSize, textSize}) {


  return (
    <div className="inline-flex items-center justify-center rounded-md border border-input bg-background p-1 hover:bg-accent hover:text-accent-foreground">
      <Button
        variant="ghost"
        size="icon"
        onClick={handleMinus}
        aria-label="Decrease count"
        className={buttonSize?buttonSize:"h-8 w-8"}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className={textSize?`mx-2 text-center ${textSize}`:"mx-2 text-center"} aria-live="polite">
        {count}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePlus}
        aria-label="Increase count"
        className={buttonSize?buttonSize:"h-8 w-8"}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}

