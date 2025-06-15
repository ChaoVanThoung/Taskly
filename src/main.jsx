import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./page/auth/Login.jsx";
import Signup from "./page/auth/Signup.jsx";
import VerifyEmail from "./page/auth/VerifyEmail.jsx";
import Todo from "./page/todo.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <StrictMode>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="/" element={<App />} />

          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="todo" element={<Todo />} />
        </Routes>
      </StrictMode>
    </BrowserRouter>
  </Provider>
);
