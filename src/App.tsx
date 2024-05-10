import { useState } from "react";
import useGetTodos from "./server/getTodos";
import { Todo } from "./type";
import useCreateTodo from "./server/createTodo";
import TodoItem from "./components/TodoItem";
import { Input } from "@headlessui/react";
// pnpm dlx json-server src/db/db.json

const App = () => {
  const { data: todos, isLoading, isError } = useGetTodos();
  const { mutate, isPending } = useCreateTodo();
  const [todo, setTodo] = useState("");
  if (isError) return <pre>{JSON.stringify(isError, null, 2)}</pre>;

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typeof todo === "string" && todo.length >= 2) {
      mutate(todo);
      setTodo("");
    }
  };

  return (
    <div className="container max-w-3xl mx-auto">
      <form className="mx-auto my-12 space-y-3 " onSubmit={submit}>
        <Input
          type="text"
          placeholder="todo"
          name="todo"
          className=" block w-full rounded-lg border bg-white/5 py-1.5 px-3 text-sm/6 text-black focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25"
          value={todo}
          disabled={isPending}
          onChange={(e) => setTodo(e.target.value)}
        />
        <button
          disabled={isPending}
          className="w-full px-3 py-2 font-medium text-white bg-blue-400 rounded disabled:opacity-50"
        >
          Create
        </button>
      </form>

      <ul className="flex flex-col gap-2 list-disc ">
        {isLoading ? (
          <li>Loading...</li>
        ) : (
          todos?.map((todo: Todo) => <TodoItem todo={todo} key={todo.id} />)
        )}
      </ul>
    </div>
  );
};
export default App;
