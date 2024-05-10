import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo } from "../type";

const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  async function updateTodo(todo: Todo) {
    // await new Promise((res) => setTimeout(res, 3000));
    const res = await fetch(`http://localhost:3000/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: todo.title,
        completed: todo.completed,
      }),
    });
    if (!res.ok) {
      throw new Error("fetch failed");
    }
    const data = res.json();
    return data;
  }

  return useMutation({
    mutationKey: ["updateTodo"],
    mutationFn: updateTodo,
    onMutate: async (newTodo) => {
      //  yeniden data cekmeyin onleyririk
      await queryClient.cancelQueries({ queryKey: ["todos", newTodo.id] });

      // evvelki datani cekib errorda goster hemin datani gostermek icin
      const previousTodo = queryClient.getQueryData(["todos", newTodo.id]);

      // gelen datani kewdeki data ile deyisirik
      queryClient.setQueryData(["todos"], (old: Todo[]) =>
        old.map((todo) => (todo.id === newTodo.id ? newTodo : todo))
      );
      // Return a context with the previous and new todo

      return { previousTodo, newTodo };
    },
    // If the mutation fails, use the context we returned above
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData(["todos", context?.newTodo.id], context?.previousTodo);
    },
    // succesde hemin todonu sadece guncelleyirik
    onSettled: (newTodo) => {
      queryClient.invalidateQueries({ queryKey: ["todos", newTodo.id] });
    },
  });
};
export default useUpdateTodo;
