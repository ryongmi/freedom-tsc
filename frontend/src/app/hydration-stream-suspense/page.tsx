import Counter from "./counter";
import ListUsers from "./list-users";
import { Suspense } from "react";

// 권장되는 방식
// 현재는 SEO에 좋지 않지만 향후 해결할 것으로 보임
/* To verify if the data is initially fetched on the server, manually refresh the browser and check the terminal where the dev server is running. 
You should see the API request logged in the terminal, confirming that the data is being fetched on the server. 
Because we are using Suspense boundaries to achieve data streaming from the server to the client, when you inspect the document in your browser’s dev tools, 
you will only see the loading component used in the fallback function. This is not good for SEO.
As of now, this is one of the drawbacks of using the @tanstack/react-query-next-experimental package. 
Nevertheless, it’s expected that future releases will address the SEO compatibility issue. In the meantime, if you require improved SEO, you can consider implementing the workarounds provided below.
*/
export default async function Page() {
  return (
    <main style={{ maxWidth: 1200, marginInline: "auto", padding: 20 }}>
      <Counter />
      <Suspense
        fallback={
          <p style={{ textAlign: "center" }}>loading... on initial request</p>
        }
      >
        <ListUsers />
      </Suspense>
    </main>
  );
}
