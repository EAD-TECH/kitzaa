import { useAuthStore } from "@/features/auth/store/authStore"
import { ApiError } from "@/lib/api/client"
import { useQuery } from "@tanstack/react-query"
import { getUnreadNotificationCount } from "../api"



export const useUnreadCount=()=>{

  const isReady=useAuthStore((state)=>state.isReady)
  const accessToken=useAuthStore((state)=>state.accessToken)
    const isSocketConnected = useAuthStore((state) => state.isSocketConnected);
  
  /* console.log("hazırmı",isReady)
  console.log("token varmı",accessToken) */

  return useQuery({
    queryKey:["notifications","unread-count"],
    queryFn:getUnreadNotificationCount,
    enabled:isReady && !!accessToken,


   /* burda ıste condıtıonal yapım duz bellı bır tıme da baceknde ıstek atmıyorm */

   refetchInterval:isSocketConnected ? false : 30000,


  retry: (failureCount, error) => {
    if(error instanceof ApiError && (error.status === 401 || error.status === 403)) {
      return false /* deneme  */
    }
    return failureCount < 3  /* bu satıra geldıysen 3 kereye kadar dene */

     
   },


  })


}