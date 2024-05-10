import { useQuery } from "@tanstack/react-query";
import { Todo } from "../type";

const useGetTodos = () => {
  async function getTodos(): Promise<Todo[]> {
    const res = await fetch("http://localhost:3000/todos");
    if (!res.ok) {
      throw new Error("fetch failed");
    }
    const data = res.json();
    return data;
  }

  return useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });
};
export default useGetTodos;
