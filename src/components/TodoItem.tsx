import { Button } from "@headlessui/react";
import useDeleteTodo from "../server/deleteTodo";
import { Todo } from "../type";
import EditModal from "./EditModal";

const TodoItem = ({ todo }: { todo: Todo }) => {
  const { mutate, isPending } = useDeleteTodo();
  const deleteTodo = (id: string) => {
    mutate(id);
  };

  return (
    <li
      className={`flex items-center p-2 border rounded ${
        isPending && "opacity-50 pointer-events-none"
      } 
     `}
    >
      <input type="checkbox" className="peer" readOnly checked={todo.completed} />
      <span className="ml-2 peer-checked:line-through">{todo?.title}</span>
      <Button
        disabled={isPending}
        onClick={() => deleteTodo(todo.id)}
        className="px-4 py-2 ml-auto mr-2 text-sm font-medium text-white bg-red-400 rounded-md focus:outline-none disabled:opacity-50"
      >
        delete
      </Button>
      <EditModal todoItem={todo} />
    </li>
  );
};
export default TodoItem;
