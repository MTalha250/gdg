import axios from "axios";

export const login = async (username: string, password: string) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/login`,
    {
      username,
      password,
    }
  );
  localStorage.setItem("token", data.token);
  return data;
};

export const register = async (values: object) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/register`,
    values
  );
  localStorage.setItem("token", data.token);
  return data;
};

export const logout = async () => {
  localStorage.removeItem("token");
  return null;
};

export const loginBack = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return null;
  }

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/by-token`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return { user: data, token };
};
