import axios from "axios";

const apiClient = axios.create({
    baseURL: "http://localhost:4001",
})


export const getTodos = async () => {
    return apiClient.get("/todos");
};

export const createTodo = async (formData) => {
    console.log(formData)
   await apiClient.post("/todos", formData)
};

export const deleteTodo = async (todoId) => {
  await apiClient.delete(`/todos/${todoId}`)
};
