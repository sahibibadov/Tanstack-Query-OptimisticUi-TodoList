import {
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { FormEvent, Fragment, useState } from "react";
import { Todo } from "../type";
import useUpdateTodo from "../server/updateTodo";

export default function EditModal({ todoItem }: { todoItem: Todo }) {
  const [isOpen, setIsOpen] = useState(false);
  const [todo, setTodo] = useState({
    todo: todoItem.title,
    completed: todoItem.completed,
  });

  const { mutate, isPending, isError } = useUpdateTodo();

  function open() {
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
  }

  function editTodo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate({
      title: todo.todo,
      id: todoItem.id,
      completed: todo.completed,
    });
    close();
  }
  if (isError) return <pre>Error</pre>;
  return (
    <>
      <Button
        onClick={open}
        className="px-4 py-2 text-sm font-medium text-white bg-yellow-400 rounded-md focus:outline-none "
      >
        Edit
      </Button>

      <Transition appear show={isOpen}>
        <Dialog as="div" className="relative z-10 focus:outline-none" onClose={close}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 backdrop-blur" />
          </TransitionChild>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-2">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 transform-[scale(95%)]"
                enterTo="opacity-100 transform-[scale(100%)]"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 transform-[scale(100%)]"
                leaveTo="opacity-0 transform-[scale(95%)]"
              >
                <DialogPanel className="w-full max-w-md p-6 bg-white rounded-xl backdrop-blur-2xl">
                  <DialogTitle as="h3" className="font-medium text-black text-base/7">
                    Edit Todo
                  </DialogTitle>
                  <form className="mx-auto space-y-3 " onSubmit={editTodo}>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={(e) =>
                          setTodo((prev) => ({ ...prev, completed: e.target.checked }))
                        }
                      />
                      <input
                        type="text"
                        placeholder="todo"
                        name="todo"
                        className="w-full p-2 border disabled:opacity-50"
                        checked={todo.completed}
                        value={todo.todo}
                        onChange={(e) => setTodo((prev) => ({ ...prev, todo: e.target.value }))}
                      />
                    </div>
                    <Button
                      className="inline-flex items-center gap-2 rounded-md bg-gray-200 py-1.5 px-3 text-sm/6 font-semibold text-black mr-2 shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                      onClick={close}
                      type="button"
                    >
                      Close
                    </Button>
                    <Button
                      className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                      type="submit"
                    >
                      {isPending ? "Editing..." : "Edit"}
                    </Button>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
