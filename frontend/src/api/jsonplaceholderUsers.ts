import { User } from "@/app/types";
import { axiosInstance } from "./axiosInstance";

export const jsonplaceholderUsers = async () => {
  const { data } = await axiosInstance.get(
    "https://jsonplaceholder.typicode.com/users"
  );
  return data as User[];
};
