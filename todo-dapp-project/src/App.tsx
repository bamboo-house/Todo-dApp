import React, { useEffect, useState } from 'react';
import './App.css';
import Button from '@mui/material/Button';
// ethers.jsのライブラリ
import { ethers } from "ethers";
import abi from "./utils/MyTodoPortal.json";

interface Todo {
  creator: any,
  timestamp: number,
  message: string,
  limit: number,
}

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  console.log("currentAccount: ", currentAccount);

  // コントラクトのデプロイ先のアドレス
  const contractAddress = "0x40D062FE3e3E439492AAf4d3c52C07B21aDb5FB1";
  // ABIの内容を参照する変数
  const contractABI = abi.abi;

  // コントラクトとのデータ共有部分
  const [allTodos, setAllTodos] = useState([]);

  const getAllTodos = async() => {
    // MetaMaskのライブラリ
    const { ethereum }: any = window;

    try {
      if (ethereum) {
        // MetaMaskを介して、イーサリアムノードに接続する
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const todoPortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const todos = await todoPortalContract.getAllTodos();
        const todosCleaned = todos.map((todo: Todo) => {
          return {
            address: todo.creator,
            timestamp: new Date(todo.timestamp * 1000),
            message: todo.message,
            limit: todo.limit
          };
        });
        setAllTodos(todosCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const checkIFWalletIsConnected = async () => {
  //   // window.ethereumにアクセスできることを確認する
  //   try {
  //     const { ethereum }: any = window;
  //     if (!ethereum) {
  //       console.log("Make sure you have MetaMask!");
  //     } else {
  //       console.log("We have the ethereum object", ethereum);
  //     }
  
  //     // ユーザーのウォレットへのアクセスが許可されているかどうかを確認
  //     const accounts = await ethereum.request({ method: "eth_accounts" });
  //     if (accounts.length !== 0) {
  //       const account = accounts[0];
  //       console.log("Found an authorized account: ", account);
  //       setCurrentAccount(account);
  //     } else {
  //       console.log("No authorized account found");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const connectWallet = async () => {
    try {
      const { ethereum }: any = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    const { ethereum }: any = window;
    // eimitされたイベントに反応する
    let todoPortalContract: ethers.Contract;
    const onNewTodo = (from: any, timestamp: number, message: string, limit: number): void => {
      console.log("NewTodo", from, timestamp, message, limit);
      setAllTodos((prevState): any => [
        ...prevState,
        {
          creator: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
          limit: limit,
        },
      ]);
    };

    /* NewTodoイベントがコントラクトから発信されたときに、情報を受け取る */
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
  
      todoPortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      todoPortalContract.on("NewTodo", onNewTodo);
    }
    /*メモリリークを防ぐために、NewTodoのイベントを解除する*/
    return () => {
      if (todoPortalContract) {
        todoPortalContract.off("NewTodo", onNewTodo);
      }
    };

  }, []);



  return (
    <div>
      {/* ウォレットコネクトボタン */}
      {!currentAccount && (
        <Button variant="contained" onClick={connectWallet}>Connect Wallet</Button>
      )}
      {currentAccount && (
        <Button variant="contained" onClick={connectWallet}>Wallet Connected</Button>
      )}
    </div>

  );
}

export default App;
