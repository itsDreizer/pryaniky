import { Button, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { login, setErrorMessage } from "@/redux/reducers/authSlice";
import "./LoginPage.scss";

interface IFormData {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { register, handleSubmit } = useForm<IFormData>({ reValidateMode: "onSubmit" });
  const { errorMessage, isAuthLoading } = useAppSelector((state) => {
    return state.authReducer;
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    document.title = "Страница входа";
  }, []);

  const onSubmit: SubmitHandler<IFormData> = async ({ username, password }) => {
    dispatch(login({ username, password }));
  };

  return (
    <main className="login-page login">
      <div className="login__container">
        <h1 className="login__title">Тестовое задание в Пряники</h1>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate className="login-form">
          <TextField
            color={errorMessage ? "error" : "primary"}
            disabled={isAuthLoading}
            className="login-form__input"
            {...register("username", {
              required: "Заполните обязательные поля!",
              onChange: () => {
                if (errorMessage) {
                  dispatch(setErrorMessage(""));
                }
              },
            })}
            label="Имя пользователя"
          />
          <TextField
            type="password"
            color={errorMessage ? "error" : "primary"}
            disabled={isAuthLoading}
            className="login-form__input"
            {...register("password", {
              required: "Заполните обязательные поля!",
              onChange: () => {
                if (errorMessage) {
                  dispatch(setErrorMessage(""));
                }
              },
            })}
            label="Пароль"
          />
          {errorMessage && <div className="login-form__error">{errorMessage}</div>}
          <Button
            color={errorMessage ? "error" : "primary"}
            type="submit"
            disabled={isAuthLoading}
            variant="outlined"
            className="login-form__submit">
            Войти
          </Button>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
