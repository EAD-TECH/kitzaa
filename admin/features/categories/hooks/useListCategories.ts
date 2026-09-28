'use client'
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { listAdminCategories } from "../api/getCategories";

/* api kuryemı cagırdm */
export const useListCategories = () => {
  const limit=6

  return useInfiniteQuery({
    queryKey: ["categories",limit], 
    initialPageParam:1,
    queryFn: ({ pageParam }) => listAdminCategories(pageParam, limit),
    getNextPageParam:(lastPage,allPages)=>{
      const categories = lastPage.categories || []
      if(categories.length<limit) return undefined
      return allPages.length+1
      
    }
    
  });
};
