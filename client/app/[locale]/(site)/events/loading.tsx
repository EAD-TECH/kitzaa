
export default function Loading() {
  return (
    <div className='grid desktop:grid-cols-[320px_1fr] gap-16 px-6 tablet:px-20 desktop:px-10 mt-10 mx-auto'>
      <div className='hidden desktop:flex flex-col gap-10'>
        <div className='h-40 rounded-lg bg-muted animate-pulse' />
      </div>
      <div className='mt-12 grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-10'>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className='h-64 rounded-lg bg-muted animate-pulse' />
        ))}
      </div>
    </div>
  )
}
