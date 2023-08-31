import axios from "axios"
import { useEffect, useState } from "react"

const host = 'https://todolist-api.hexschool.io'

function handleInput(e, form, setForm) {
    setForm({
        ...form,
        [e.target.name]: e.target.value
    }) 
}

function SignUp() {

    const [form, setForm] = useState({
        email: "",
        password: "",
        nickname: ""
    })

    const [message, setMessage] = useState("")

    const signUp = async() => {
        try {
            const res = await axios.post(`${host}/users/sign_up`, form)
            // console.log(res)
            setMessage(`註冊成功 UID = ${res.data.uid}`)
        } catch (error){
            setMessage(`註冊失敗:${error}`)
        }
    }

    return (
        <div>
            <h2>註冊</h2>
            <div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" onChange={(e) => handleInput(e, form, setForm)} />
            </div>
            <div>
                <label htmlFor="password">password</label>
                <input type="password" id="password" name="password" onChange={(e) => handleInput(e, form, setForm)} />
            </div>
            <div>
                <label htmlFor="nickname">nickname</label>
                <input type="text" id="nickname" name="nickname" onChange={(e) => handleInput(e, form, setForm)} />
            </div>
            <button onClick={signUp}>註冊</button>
            <p>{message}</p>
        </div>
    )
}

function SignIn() {

    const [message, setMessage] = useState("")

    const [form, setForm] = useState({
        email: "",
        password: "",
        nickname: ""
    });

    const signIn = async() => {
        try {
            const res = await axios.post(`${host}/users/sign_in`, form)
            setMessage(`登入成功 Token = ${res.data.token}`)
        } catch (error){
            setMessage(`登入失敗:${error}`)
        }
    }

    return (
        <div>
            <h2>登入</h2>
            <div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" onChange={(e) => handleInput(e, form, setForm)} />
            </div>
            <div>
                <label htmlFor="password">password</label>
                <input type="password" id="password" name="password" onChange={(e) => handleInput(e, form, setForm)} />
            </div>
            <button onClick={signIn}>登入</button>
            <p>{message}</p>
        </div>
    )
}

function CheckOut({token, setToken, setCheck}) {
    const [message, setMessage] = useState("")
    // const [token, setToken] = useState('')

    const checkOut = async() => {
        try {
            const res = await axios.get(`${host}/users/checkout`, {
                headers: {
                    authorization: token
                }
            }) 
            setMessage(`驗證成功 UID = ${res.data.uid}`)
            setCheck(true)
            // console.log(res.data.uid)
        } catch (error){
            setMessage(`驗證失敗:${error}`)
        }
    }

    return (
    <div>
        <h2>驗證</h2>
        <div>
            <label htmlFor="token">Token</label>
            <input type="text" id="token" name="token" onChange={(e) => {
                setToken(e.target.value);
            }} />
        </div>
        <button onClick={checkOut}>驗證</button>
        <p>{message}</p>
    </div>)
}

function SignOut({setCheck}) {
    const [token, setToken] = useState('')
    const [message, setMessage] = useState("")

    const signOut = async() => {
        try {
            const res = await axios.post(`${host}/users/sign_out`, {}, {
                headers:{
                    authorization: token
                }
            })
            setMessage("登出成功")
            setCheck(false)
        } catch (error){
            setMessage(`登出失敗:${error}`)
        }
    }

    return (
    <div>
        <h2>登出</h2>
        <div>
            <label htmlFor="token">Token</label>
            <input type="text" id="token" name="token" onChange={(e) => {
                setToken(e.target.value)
            }} />
        </div>
        <button onClick={signOut}>登出</button>
        <p>{message}</p>
    </div>)
}

const TodoList = ({ token }) => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [todoEdit, setTodoEdit] = useState({});
  
    useEffect(() => {
      getTodos();
    }, []);
  
    const getTodos = async () => {
      try {
        const response = await axios.get(`${host}/todos`, {
          headers: {
            Authorization: token,
          },
        });
        setTodos(response.data.data);
      } catch (error) {
        console.error('取得失敗:', error);
      }
    };
  
    const addTodo = async () => {
      if (!newTodo) return;
  
      const todo = {
        content: newTodo,
      };
  
      try {
        await axios.post(`${host}/todos`, todo, {
          headers: {
            Authorization: token,
          },
        });
        setNewTodo('');
        getTodos();
      } catch (error) {
        console.error('新增失敗:', error);
      }
    };
  
    const deleteTodo = async (id) => {
      try {
        await axios.delete(`${host}/todos/${id}`, {
          headers: {
            Authorization: token,
          },
        });
        getTodos();
      } catch (error) {
        console.error('刪除失敗:', error);
      }
    };
  
    const updateTodo = async (id) => {
      const updatedContent = todoEdit[id];
  
      if (!updatedContent) return;
  
      try {
        await axios.put(`${host}/todos/${id}`, { content: updatedContent }, {
          headers: {
            Authorization: token,
          },
        });
        getTodos();
        setTodoEdit((prevEdit) => ({
          ...prevEdit,
          [id]: '',
        }));
      } catch (error) {
        console.error('更新失敗:', error);
      }
    };
  
    const toggleStatus = async (id) => {
      try {
        await axios.patch(
          `${host}/todos/${id}/toggle`,
          {},
          {
            headers: {
              Authorization: token,
            },
          }
        );
        getTodos();
      } catch (error) {
        console.error('更新狀態失敗:', error);
      }
    };
  
    return (
      <div>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder='New Todo'
        />
        <button onClick={addTodo}>Add Todo</button>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              {todo.content} {todo.status ? '完成' : '未完成'}
              <input
                type='text'
                placeholder='更新值'
                value={todoEdit[todo.id] || ''}
                onChange={(e) => {
                  setTodoEdit((prevEdit) => ({
                    ...prevEdit,
                    [todo.id]: e.target.value,
                  }));
                }}
              />
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              <button onClick={() => updateTodo(todo.id)}>Update</button>
              <button onClick={() => toggleStatus(todo.id)}>Toggle Status</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

function Todo() {
    const [token, setToken] = useState('')
    const [check, setCheck] = useState(false)
    return (
        <div>
            <SignUp />
            <SignIn />
            <CheckOut token={token} setToken={setToken} setCheck={setCheck} />
            <SignOut setCheck={setCheck} />
            <hr />
            <h2>Todo list</h2>
            {
                check && <TodoList token={token} />
            }
            </div>
    )
}

export default Todo