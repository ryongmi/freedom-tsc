"use client";

import { jsonplaceholderUsers } from "@/api/jsonplaceholderUsers";
import { User } from "../types";
import { useQuery } from "@tanstack/react-query";

export default function ListUsers() {
  const { data } = useQuery<User[]>(
    ["stream-hydrate-users"],
    jsonplaceholderUsers,
    {
      staleTime: 5 * 1000,
      cacheTime: 6 * 1000,
    }
  );

  return (
    <>
      {
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 20,
          }}
        >
          {data?.map((user) => (
            <div
              key={user.id}
              style={{ border: "1px solid #ccc", textAlign: "center" }}
            >
              <img
                src={`https://robohash.org/${user.id}?set=set2&size=180x180`}
                alt={user.name}
                style={{ width: 180, height: 180 }}
              />
              <h3>{user.name}</h3>
            </div>
          ))}
        </div>
      }
    </>
  );
}
