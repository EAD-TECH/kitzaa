import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import backgroundPattern from "../../../public/images/event-pattern.png"

const CreateEventCard = () => {
    return (
        <div className='relative isolate overflow-hidden rounded-2xl bg-secondary p-6 text-secondary-foreground shadow-sm'>
            <Image
                src={backgroundPattern}
                alt=""
                aria-hidden="true"
                className='pointer-events-none absolute -left-4 -bottom-6 -z-10 w-56 invert opacity-20'
            />
            <div className="relative text-center">
                <p className='mb-3 font-heading text-2xl font-bold'>Eigene Idee?</p>
                <p className='text-base'>Hast du ein tolles Konzept für ein Treffen oder einen Workshop?</p>
                <Button
                    render={<Link href="/events/create" />}
                    nativeButton={false}
                    className="mt-6 px-6 tablet:px-8 desktop:px-6 cursor-pointer rounded-full bg-background text-foreground shadow-sm transition-all 
                    "
                >
                    Organisiere dein eigenes Event!
                </Button>
            </div>
        </div>
    )
}

export default CreateEventCard
