"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";

function TanStackProviders({ children }: React.PropsWithChildren) {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          // onError: queryErrorHandler,
          refetchOnMount: false, // 컴포넌트가 마운트될 때마다 자동으로 새로운 데이터를 가져올지 여부 설정
          refetchOnReconnect: true, // 인터넷 연결이 끊어지고 다시 연결될 때마다 자동으로 새로운 데이터를 가져올지 여부를 설정
          refetchOnWindowFocus: false, // 창이 포커스를 잃고 되돌아올 때마다 자동으로 새로운 데이터를 가져올지 여부를 설정
          staleTime: 1000 * 60 * 60 * 3,
          cacheTime: 1000 * 60 * 60 * 5,
          retry: 0,
          suspense: true,
        },

        mutations: {
          // onError:queryErrorHandler
        },
      },
    })
  );

  return (
    <QueryClientProvider client={client}>
      <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default TanStackProviders;
