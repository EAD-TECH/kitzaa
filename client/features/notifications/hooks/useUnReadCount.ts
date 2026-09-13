import { useAuthStore } from "@/features/auth/store/authStore"
import { useQuery } from "@tanstack/react-query"
import { getUnreadNotificationCount } from "../api"



export const useUnreadCount=()=>{

  const isReady=useAuthStore((state)=>state.isReady)
  const accessToken=useAuthStore((state)=>state.accessToken)
  
  /* console.log("hazırmı",isReady)
  console.log("token varmı",accessToken) */

  return useQuery({
    queryKey:["notifications","unread-count"],
    queryFn:getUnreadNotificationCount,
    enabled:isReady && !!accessToken
  })


}