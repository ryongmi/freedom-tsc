import { jsonplaceholderUsers } from "@/api/jsonplaceholderUsers";
import ListUsers from "./list-users";
import { Suspense } from "react";

export default async function InitialData() {
  const users = await jsonplaceholderUsers();

  return (
    <Suspense
      fallback={
        <p style={{ textAlign: "center" }}>loading... on initial request</p>
      }
    >
      <ListUsers users={users} />;
    </Suspense>
  );
}
