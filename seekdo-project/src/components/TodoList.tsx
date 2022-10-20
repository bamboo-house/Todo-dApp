import React, { useEffect, useState } from 'react';
import { Todo } from './Todo';
// 型
import { TodoType } from '../common/Types';
// コントラクト関連ライブラリ
import { ethers } from 'ethers';
import { LOCAL_CONSTANT } from '../common/LocalConstant';
import abi from '../utils/TodoFactory.json';

interface Props {
  currentAccount: string;
}

export const TodoList: React.FC<Props> = (props) => {
  const [todoItems, setTodoItems] = useState<TodoType[]>([]);
  const contractAddress = LOCAL_CONSTANT.CONTRACT_ADDRESS;
  const contractABI = abi.abi;

  const getAllTodos = async () => {
    const { ethereum }: any = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const todoFactoryContract = new ethers.Contract(contractAddress, contractABI, signer);

        const todos = await todoFactoryContract.getAllTodos();
        const todosCleaned = todos.map((todo: TodoType) => {
          return {
            title: todo.title,
            body: todo.body,
            poolAmount: Number(todo.poolAmount),
          };
        });
        setTodoItems(todosCleaned);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // ここで、NewTodoイベントを受け取って、todoItemsのstate更新する
    let todoFactoryContract: ethers.Contract;

    const onNewTodo = (title: string, body: string, poolAmount: number): void => {
      console.log('NewTodo:', title, body, poolAmount.toString());
      setTodoItems((prevState) => [
        ...prevState,
        {
          title,
          body,
          poolAmount: Number(poolAmount),
          // 竹内
          deadline: new Date(),
          done: false,
        },
      ]);
    };

    const { ethereum }: any = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      todoFactoryContract = new ethers.Contract(contractAddress, contractABI, signer);

      // コントラクトのNewTodoイベントがemitされたときに、フロントのonNewTodo関数を呼び出す
      todoFactoryContract.on('NewTodo', onNewTodo);
    }
    // メモリリークを防ぐために、NewTodoのイベントを解除する
    return () => {
      if (todoFactoryContract) {
        todoFactoryContract.off('NewTodo', onNewTodo);
      }
    };
  }, []);

  useEffect(() => {
    if (props.currentAccount) {
      getAllTodos();
    }
  }, [props.currentAccount]);

  return (
    <div>
      {todoItems.map((item: TodoType, index: number) => (
        <Todo key={index} items={item} />
      ))}
    </div>
  );
};
