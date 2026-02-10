import React, { useState } from 'react';
import { useEffect } from "react";

type Month = '' | '01' | '02' | '03' | '04' | '05' | '06' |
'07' | '08' | '09' | '10' | '11' | '12';

type Day = '' | '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' |
'10' | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20' |
'21' | '22' | '23' | '24' | '25' | '26' | '27' | '28' | '29' | '30' | '31';

type Year = '' | '2014' | '2015' | '2016' | '2017' | '2018' | '2019' | '2020' |
'2021' | '2022' | '2023' | '2024' | '2025';

interface Todo extends NewTodo {
  id: number,
  title: string,
  day: Day,
  month: Month,
  year: Year,
  completed: boolean,
  description: string,
};

interface NewTodo {
  title: string,
  day?: Day,
  month?: Month,
  year?: Year,
  completed: boolean,
  description?: string,
};

interface DataButton extends HTMLButtonElement {
  dataset: { id: string }
};

type SortedTodo = {
  [key: string]: Todo[],
  'No Due Date': Todo[],
};

type Visibility = 'visible' | 'hidden';

function Modal(
  { currTodo, title, description, year, month, day, refreshTodos,
    setTitle, setDescription, setYear, setMonth, setDay, toggleModal,
    sendComplete, setRefresh }:
  { currTodo: undefined | Todo,
    title: string,
    description: string,
    year: Year,
    month: Month,
    day: Day,
    refreshTodos: boolean,
    setTitle: React.Dispatch<React.SetStateAction<string>>,
    setDescription: React.Dispatch<React.SetStateAction<string>>,
    setYear: React.Dispatch<React.SetStateAction<Year>>,
    setMonth: React.Dispatch<React.SetStateAction<Month>>,
    setDay: React.Dispatch<React.SetStateAction<Day>>,
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>,
    toggleModal: () => void,
    sendComplete: (currTodo: Todo) => Promise<void>
  }) {
  
  function updateTitle(event: React.SyntheticEvent) {
    let target = event.target as HTMLInputElement;
    let value: string = target.value;

    setTitle(value);
  }

  function updateDescription(event: React.SyntheticEvent) {
    let target = event.target as HTMLTextAreaElement;
    let value: string = target.value;

    setDescription(value);
  }

  function updateDay(event: React.SyntheticEvent) {
    let target = event.target as HTMLSelectElement;
    let value: Day = target.value as Day;

    setDay(value);
  }

  function updateMonth(event: React.SyntheticEvent) {
    let target = event.target as HTMLSelectElement;
    let value: Month = target.value as Month;

    setMonth(value);
  }
  
  function updateYear(event: React.SyntheticEvent) {
    let target = event.target as HTMLSelectElement;
    let value: Year = target.value as Year;

    setYear(value);
  }

  function resetModalState() {
    setTitle('');
    setDescription('');
    setDay('');
    setMonth('');
    setYear('');
  }

  function handleMarkComplete() {
    if (currTodo === undefined) {
      alert('Cannot complete a todo that does not yet exist');
      return;
    } else if (currTodo.completed === false) {
      sendComplete(currTodo)
    }

    toggleModal();
    resetModalState()
  }

  function handleSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    
    if (!currTodo) {
      postNew();
    } else {
      putEdits();
    }

    toggleModal();
    resetModalState();
  }

  function createTodoFromForm(newTodo: true): NewTodo;
  function createTodoFromForm(newTodo: false): Todo;
  function createTodoFromForm(newTodo: boolean): Todo | NewTodo {
    let todo = {
      title: title,
      completed: false,
      description: description || undefined,
      day: day || undefined,
      month: month || undefined,
      year: year || undefined,
    };

    if (newTodo) {
      return todo;
    } else if (currTodo && !newTodo) {
      return {...todo, id: currTodo.id, completed: currTodo.completed }
    } else {
      throw new Error('function called without existing todo')
    }
  }

  async function putEdits() {
    let editedTodo: Todo = createTodoFromForm(false);
    let body = JSON.stringify(editedTodo);
    let options = {
      method: 'PUT',
      body: body,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    let path = `http://localhost:3000/api/todos/${editedTodo.id}`;

    try {
      let response: Response = await fetch(path, options)
      if (response.ok) {
        setRefresh(!refreshTodos);
      } else {
        console.error(response.status)
      }
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
    }
  }

  async function postNew() {
    let newTodo: NewTodo = createTodoFromForm(true);
    
    let body = JSON.stringify(newTodo);
    let options = {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    let path = `http://localhost:3000/api/todos/`;

    try {
      let response: Response = await fetch(path, options)
      if (response.ok) {
        setRefresh(!refreshTodos);
      } else {
        console.error(response.status)
      }
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
    }
  }

  function generateDayOptions() {

    let dayOptions = [<option value='' key='defaultDay'>Day</option>];
    
    for (let i = 1; i <= 31; i += 1) {
      let strVal = String(i);
      if (strVal.length === 1) {
        strVal = '0' + strVal;
      }
      
      dayOptions.push(<option value={strVal} key={"day-"+ strVal}>{i}</option>)

    }
    
    return dayOptions;
  }
  
  return (
    <>
      <form onSubmit={handleSubmit}>
        <ul>
          <li>
            <label>Title<input type="text"
                               placeholder="Todo title"
                               onChange={updateTitle}
                               value={title}/></label>
          </li>

          <li>
            <label>Due Date
              <div className="due_day">
                <select onChange={updateDay} value={day}>
                  {generateDayOptions()}
                </select>
              </div>
              <div className="due_month">
                <select onChange={updateMonth} value={month}>
                  <option value=''>Month</option>
                  <option value='01'>January</option>
                  <option value='02'>February</option>
                  <option value='03'>March</option>
                  <option value='04'>April</option>
                  <option value='05'>May</option>
                  <option value='06'>June</option>
                  <option value='07'>July</option>
                  <option value='08'>August</option>
                  <option value='09'>September</option>
                  <option value='10'>October</option>
                  <option value='11'>November</option>
                  <option value='12'>December</option>
                </select>
              </div>
              <div className="due_year">
                <select onChange={updateYear} value={year}>
                  <option value=''>Year</option>
                  <option value='2014'>2014</option>
                  <option value='2015'>2015</option>
                  <option value='2016'>2016</option>
                  <option value='2017'>2017</option>
                  <option value='2018'>2018</option>
                  <option value='2019'>2019</option>
                  <option value='2020'>2020</option>
                  <option value='2021'>2021</option>
                  <option value='2022'>2022</option>
                  <option value='2023'>2023</option>
                  <option value='2024'>2024</option>
                  <option value='2025'>2025</option>
                </select>
              </div>
            </label>
          </li>
          <li>
            <label>Decription
              <textarea onChange={updateDescription}
              value={description}>
              </textarea>
            </label>
          </li>
        </ul>

        <input type="submit"/>
        <button type="button" onClick={handleMarkComplete}>
          Mark as Complete
        </button>
      </form>
    </>
  )
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [refreshTodos, setRefresh] = useState(false);
  const [currTodo, setCurrTodo] = useState<Todo | undefined>(undefined);
  const [visibility, setVisibility] = useState<Visibility>('hidden');
  const [title, setTitle] = useState('');
  const [year, setYear] = useState<Year>('');
  const [month, setMonth] = useState<Month>('');
  const [day, setDay] = useState<Day>('');
  const [description, setDescription] = useState('');

  function getTodos() {
    fetch('http://localhost:3000/api/todos')
      .then((response: Response) => {
        return response.json();
      })
      .then ((data: Array<Todo>) => {
        setTodos(data)
      })
  }

  async function sendComplete(currentTodo: Todo) {
    let body = JSON.stringify({ completed: !currentTodo.completed });
    let options = {
      method: 'PUT',
      body: body,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    let path = `http://localhost:3000/api/todos/${currentTodo.id}`;

    try {
      let response: Response = await fetch(path, options)
      if (response.ok) {
        setRefresh(!refreshTodos);
      }
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
    }
  }

  function markComplete(event: React.SyntheticEvent) {
    let target = event.target as DataButton;
    let id: number = Number(target.dataset.id);
    let currentTodo = todos.filter( todo => todo.id === id)[0];

    sendComplete(currentTodo);
  }
  
  function toggleModal() {
    if (visibility === 'visible') {
      setVisibility('hidden');
    } else {
      setVisibility('visible');
    }
    return;
  }

  function createNewTodo() {
    setCurrTodo(undefined);
    toggleModal();
  }

  function editTodo(event: React.SyntheticEvent) {
    toggleModal();

    let target = event.target as DataButton;
    let id = target.dataset.id;
    let currTodo = todos.find(todo => todo.id === Number(id));
    setCurrTodo(currTodo);
    if (currTodo == undefined) {
      alert('That todo does not exist but should');
    } else {
      setTitle(currTodo.title);
      setDescription(currTodo.description);
      setDay(currTodo.day);
      setYear(currTodo.year);
      setMonth(currTodo.month);
    }
  }

  async function sendDelete(id: number) {
    let options = {
      method: 'DELETE',
    };

    let path = `http://localhost:3000/api/todos/${id}`;
    
    try {
      let response: Response =  await fetch(path, options);
      
      if (response.ok) {
        setRefresh(!refreshTodos);
      } else {
        console.error(response.status)
      }
    } catch(error) {
      if (error instanceof Error) console.log(error.message);
    }
  }

  function handleDelete(event: React.SyntheticEvent) {
    let target = event.target as DataButton;
    let id = Number(target.dataset.id);
    sendDelete(id);
  }

  function sortListByDate(todos: Todo[]) {
    // let sorted: SortedTodo;
    // todos.forEach(todo => {
    //   let date = todo.month && todo.year
    // })
  }

  function todoListsByCompletion() {
    let completed = todos.filter(todo => todo.completed);
    let allSorted = sortListByDate(todos);
    let completedSorted = sortListByDate(completed);

    return {allSorted, completedSorted};
  }

  useEffect(getTodos, [refreshTodos]);

  return (
    <>
      <NavBar/>
      <button onClick={createNewTodo}>Add new todo</button>
      <Header title={'Your Todo List'} todoCount={todos.length}/>
      <TodoList todos={todos} editTodo={editTodo}
                          markComplete={markComplete}
                          handleDelete={handleDelete}/>
      
      <div style={{"visibility": visibility}}>
        <Modal currTodo={currTodo}
               title={title}
               setTitle={setTitle}
               description={description}
               setDescription={setDescription}
               month={month}
               setMonth={setMonth}
               day={day}
               setDay={setDay}
               year={year}
               setYear={setYear}
               toggleModal={toggleModal}
               sendComplete={sendComplete}
               refreshTodos={refreshTodos}
               setRefresh={setRefresh}/>
      </div>
    </>
  )
}

function NavBar(
  // { todoLists }:
  // { todoLists: string[] }
) {
  return (<></>);
}

function TodoList(
  { todos, editTodo, markComplete, handleDelete }:
  {
    todos: Todo[],
    editTodo: (event: React.SyntheticEvent) => void,
    markComplete: (event: React.SyntheticEvent) => void,
    handleDelete: (event: React.SyntheticEvent) => void,
}
) {
  return (<ul>
    {todos.map((todo) => {
      return <TodoItem todo={todo}
                       key={todo.id}
                       editTodo={editTodo}
                       markComplete={markComplete}
                       handleDelete={handleDelete}/>
    })}
  </ul>)
}

function TodoItem(
{ todo, editTodo, markComplete, handleDelete }:
{
  todo: Todo,
  editTodo: (event: React.SyntheticEvent) => void,
  markComplete: (event: React.SyntheticEvent) => void,
  handleDelete: (event: React.SyntheticEvent) => void,
}) {
  function formatDate() {
    if (todo.month && todo.year) {
      return `${todo.month}/${todo.year}`;
    } else {
      return "No Due Date";
    }
  }

  return (
    <li data-id={String(todo.id)}>
      {todo.title} | {formatDate()} | completed: {String(todo.completed)}
      <button onClick={editTodo}
              data-id={String(todo.id)}>Edit Todo</button>
      <button onClick={markComplete}
              data-id={String(todo.id)}>Toggle Complete</button>
      <button onClick={handleDelete}
              data-id={String(todo.id)}>Delete</button>
    </li>
  )
}

function Header(
  { title, todoCount }: 
  { title: string, todoCount: number }
) {
  return (
    <div>
      <h3>{title}:  
        <span>{todoCount}</span>
      </h3>
    </div>
  )
}

export default App