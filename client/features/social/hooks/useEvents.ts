import { getEvents } from "@/features/events/api/eventApi";
import { useQuery } from "@tanstack/react-query";

export const useEvents = () => {

    return useQuery({
        queryKey: ['events'],
        queryFn: () => {
            const params = new URLSearchParams();
            params.set("limit", "100"); // veya ihtiyacına göre 50, 200
            return getEvents(params);
        }
    })
}

