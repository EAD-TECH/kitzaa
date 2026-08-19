

import React from 'react'
import type { EventDTO } from '@/features/events/types/event.types'
import EventCard from './EventCard'

// Platzhalterdaten, bis die echte /api/v1/events-Liste eingebunden ist
const mockEvents: EventDTO[] = [
    {
        _id: '1',
        title: 'Großes Picknick & Spiele im Park',
        slug: 'grosses-picknick-spiele-im-park',
        description: '',
        coverImage: null,
        images: [],
        categoryId: { _id: 'c1', name: 'Outdoor', slug: 'outdoor', icon: 'tree' },
        ageRange: { min: 0, max: 18 },
        createdBy: { _id: 'u1', username: 'Sarah M.', avatarUrl: null, role: 'user' },
        status: 'approved',
        isFree: true,
        price: null,
        schedule: { startDate: '2026-10-12', startTime: '14:00', endTime: '17:00' },
        location: {
            venueName: 'Gleisdreieck Park',
            addressLine: '',
            city: 'Berlin',
            country: 'DE',
            coordinates: { type: 'Point', coordinates: [13.3833, 52.4966] },
        },
        capacity: { max: 30, current: 12 },
        viewCount: 0,
        createdAt: '',
        updatedAt: '',
    },
    {
        _id: '2',
        title: 'Mal-Workshop für Kinder',
        slug: 'mal-workshop-fuer-kinder',
        description: '',
        coverImage: null,
        images: [],
        categoryId: { _id: 'c2', name: 'Workshop', slug: 'workshop', icon: 'palette' },
        ageRange: { min: 4, max: 6 },
        createdBy: { _id: 'u2', username: 'Kreativhaus Mitte', avatarUrl: null, role: 'organizer' },
        status: 'approved',
        isFree: false,
        price: { amount: 15, currency: 'EUR' },
        schedule: { startDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10), startTime: '10:00', endTime: '12:00' },
        location: {
            venueName: 'Kreativhaus Mitte',
            addressLine: '',
            city: 'Berlin',
            country: 'DE',
            coordinates: { type: 'Point', coordinates: [13.3989, 52.5219] },
        },
        capacity: { max: 15, current: 9 },
        viewCount: 0,
        createdAt: '',
        updatedAt: '',
    },
    {
        _id: '3',
        title: 'Waldabenteuer-Wanderung',
        slug: 'waldabenteuer-wanderung',
        description: '',
        coverImage: null,
        images: [],
        categoryId: { _id: 'c1', name: 'Outdoor', slug: 'outdoor', icon: 'tree' },
        ageRange: { min: 7, max: 10 },
        createdBy: { _id: 'u3', username: 'Elena V.', avatarUrl: null, role: 'user' },
        status: 'approved',
        isFree: true,
        price: null,
        schedule: { startDate: '2026-10-13', startTime: '09:30', endTime: '12:30' },
        location: {
            venueName: 'Grunewald Parkplatz',
            addressLine: '',
            city: 'Berlin',
            country: 'DE',
            coordinates: { type: 'Point', coordinates: [13.2333, 52.4833] },
        },
        capacity: { max: 20, current: 4 },
        viewCount: 0,
        createdAt: '',
        updatedAt: '',
    },
]


const EventList = () => {
    return (
        <div className='mt-12 grid grid-cols-1 max-w-90 tablet:grid-cols-[repeat(2,minmax(320px,370px))] desktop:grid-cols-[repeat(3,minmax(250px,1fr))] desktop:max-w-270 gap-10 mx-auto justify-center desktop:justify-start desktop:mx-0'>
            {mockEvents.map((event) => (
                <EventCard key={event._id} event={event} />
            ))}
        </div>
    )
}

export default EventList