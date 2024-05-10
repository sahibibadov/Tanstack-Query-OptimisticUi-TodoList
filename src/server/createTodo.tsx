import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo } from "../type";

const useCreateTodo = () => {
  const queryClient = useQueryClient();
  async function createTodo(title: string) {
    // await new Promise((res) => setTimeout(res, 3000));
    const res = await fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        completed: false,
      }),
    });
    if (!res.ok) {
      throw new Error("fetch failed");
    }
    const data = res.json();
    return data;
  }

  return useMutation({
    mutationKey: ["createTodo"],
    mutationFn: createTodo,
    onMutate: async (newTodo) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      // error olarsa evvelki datani saxlayiriq
      const previousTodos = queryClient.getQueryData(["todos"]);
      const todo = { title: newTodo, completed: false, id: Math.random() };
      // Optimistically update to the new value
      queryClient.setQueryData(["todos"], (old: Todo[]) => [...old, todo]);

      // Return a context object with the snapshotted value
      return { previousTodos };
    },
    // If the mutation fails,
    // error olarsa kohne datani gostermek
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(["todos"], context?.previousTodos);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};
export default useCreateTodo;
