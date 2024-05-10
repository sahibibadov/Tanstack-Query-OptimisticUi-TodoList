import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo } from "../type";

const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  async function deleteTodo(id: string) {
    // await new Promise((res) => setTimeout(res, 3000));
    const res = await fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("fetch failed");
    }
    const data = res.json();
    return data;
  }

  return useMutation({
    mutationFn: deleteTodo,
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["todos", id] });

      // Snapshot the previous value
      const previousTodo = queryClient.getQueryData(["todos", id]);
      console.log(previousTodo);

      // Optimistically update to the delete

      queryClient.setQueryData(["todos"], (old: Todo[]) => old?.filter((todo) => todo.id !== id));
      // Return a context with the previous and new todo

      return { previousTodo };
    },

    onError: (_err, id, context) => {
      queryClient.setQueryData(["todos", id], context?.previousTodo);
    },

    onSettled: (_err, id) => {
      queryClient.invalidateQueries({ queryKey: ["todos", id] });
    },
  });
};
export default useDeleteTodo;
