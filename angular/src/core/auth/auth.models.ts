import { UserData } from "../store/projects/projects.model";


export const AUTH_KEY = 'AUTH';

export interface AuthState {
  isAuthenticated: boolean;
  token: string;
  email: string;
  loading: boolean;
  user: UserData;
}

export interface AuthRegisterUser {
  name: string;
  surname: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResetPassword {
  email: string;
  password: string;
  password_confirmation: string;
  token: string
}

export interface AuthCompleteRegistration {
  name: string,
  surname: string,
  password: string,
  password_confirmation: string,
  expires: string,
  user: string,
  signature: string
}
