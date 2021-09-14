import React, {useEffect, useState} from "react";
import "./App.css";
import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Todo from "./components/Todo";
import FormTodo from "./components/FormTodo";
import axios from "axios";



function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [todos, setTodos] = React.useState([]);
  const url = "http://localhost:8000/api";

  useEffect(() => {
    fetch(url + "/todos")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setTodos(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [todos])

  const addTodo = task => {
    const todo = {"task": task , "isDone" : false};
    axios.post(url + "/todo/create", todo);
    const newTodos = [...todos, { task }];
    setTodos(newTodos);
  };

  const markTodo = index => {
    const newTodos = [...todos];
    newTodos[index].isDone = true;
    axios.put(url + "/todo/" + newTodos[index]._id + "/update", newTodos[index]);
    setTodos(newTodos);
  };

  const removeTodo = index => {
    const newTodos = [...todos];
    axios.delete(url + "/todo/" + newTodos[index]._id + "/delete");
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
  return (
    <div className="app">
      <div className="container">
        <h1 className="text-center mb-4">Todo List</h1>
        <FormTodo addTodo={addTodo} />
        <div>
          {todos.map((todo, index) => (
            <Card>
              <Card.Body>
                <Todo
                key={index}
                index={index}
                todo={todo}
                markTodo={markTodo}
                removeTodo={removeTodo}
                />
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );}
}

export default App;