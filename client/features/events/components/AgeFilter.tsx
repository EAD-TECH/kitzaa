
import React from 'react'

const AgeFilter = () => {

  const ages = ["Alle Alter","0-3 Jahre","4-6 Jahre","7-10 Jahre","10-14 Jahre", "Für Eltern"]

  return (
    <div className='flex flex-wrap gap-x-4 gap-y-2 mt-6'>
      {ages.map((a, index )=> (
      <button className='bg-popover/40 py-1.5 px-4 rounded-4xl text-sm border hover:bg-primary/90 hover:text-primary-foreground cursor-pointer transition-colors duration-200 ease-in-out' key={index}>{a}</button>
      ))}
    </div>
  )
}

export default AgeFilter