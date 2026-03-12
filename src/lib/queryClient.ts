// src/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {

      // данные считаются свежими 30 секунд
      staleTime: 1000 * 30,

      // не перезапрашивать при фокусе вкладки
      refetchOnWindowFocus: false,

      // количество повторных запросов
      retry: 1,

    },

    mutations: {

      // не повторять мутации автоматически
      retry: 0,

    }
  }
});