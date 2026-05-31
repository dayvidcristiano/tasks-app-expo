import axios from 'axios';
import React from 'react';
import { useAuthStore } from '../store/useAuthStore';

const baseURL = process.env.EXPO_PUBLIC_API_URL;
const authURL = process.env.EXPO_PUBLIC_API_URL;

export interface TaskItem {
  _id: string;
  text: string;
  completed?: boolean;
  dueDate?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAllTasks = (
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>,
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (setLoading) setLoading(true);

  axios
    .get<TaskItem[]>(`${baseURL}`, getAuthHeaders())
    .then(({ data }) => {
      setTasks(data);
      if (setLoading) setLoading(false);
    })
    .catch((err) => {
      console.log(
        'GET TASKS ERROR:',
        err.response?.status,
        err.response?.data
      );

      if (setLoading) setLoading(false);
    });
};

export const addTask = (
  text: string,
  completed: boolean,
  dueDate: string | null,
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>,
  onSuccess: () => void
) => {
  axios
    .post(
      `${baseURL}/save`,
      {
        text,
        completed,
        dueDate,
      },
      getAuthHeaders()
    )
    .then(() => {
      onSuccess();
      getAllTasks(setTasks);
    })
    .catch((err) => {
      console.log(
        'ADD TASK ERROR:',
        err.response?.status,
        err.response?.data
      );
    });
};

export const updateTask = (
  taskId: string,
  text: string,
  completed: boolean,
  dueDate: string | null,
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>,
  onSuccess: () => void
) => {
  axios
    .post(
      `${baseURL}/update`,
      {
        _id: taskId,
        text,
        completed,
        dueDate,
      },
      getAuthHeaders()
    )
    .then(() => {
      onSuccess();
      getAllTasks(setTasks);
    })
    .catch((err) => {
      console.log(
        'UPDATE TASK ERROR:',
        err.response?.status,
        err.response?.data
      );
    });
};

export const deleteTask = (
  _id: string,
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>
) => {
  axios
    .post(
      `${baseURL}/delete`,
      {
        _id,
      },
      getAuthHeaders()
    )
    .then(() => {
      getAllTasks(setTasks);
    })
    .catch((err) => {
      console.log(
        'DELETE TASK ERROR:',
        err.response?.status,
        err.response?.data
      );
    });
};

export const loginAPI = async (
  data: {
    email: string;
    password: string;
  }
): Promise<{
  token: string;
  user: User;
}> => {
  const response = await axios.post(
    `${authURL}/api/auth/login`,
    data
  );

  return response.data;
};

export const signupAPI = async (
  data: {
    name: string;
    email: string;
    password: string;
  }
): Promise<{
  token: string;
  user: User;
}> => {
  const response = await axios.post(
    `${authURL}/api/auth/signup`,
    data
  );

  return response.data;
};

export const logoutAPI = async (): Promise<void> => {
  const token = useAuthStore.getState().token;

  await axios.post(
    `${authURL}/api/auth/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};