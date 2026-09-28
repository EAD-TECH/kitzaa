import { useInfiniteQuery } from "@tanstack/react-query";

/* api kuryemı cagırdm */
import { listAdminUsers } from "../api/getUsers";


export const useListUsers = () => {
  const limit=6

  return useInfiniteQuery({
    queryKey: ["users",limit], 
    initialPageParam:1,
    queryFn: ({ pageParam }) => listAdminUsers(pageParam, limit),
    getNextPageParam:(lastPage,allPages)=>{
      const users=lastPage.user || []
      if(users.length<limit) return undefined
      return allPages.length+1
      
    }
    
  }); 
};
