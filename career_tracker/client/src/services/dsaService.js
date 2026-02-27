import API from "./api";

export const getProblems = async () => {
  const token = localStorage.getItem("token");

  const response = await API.get("/dsa", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createProblem = async (data) => {
  const token = localStorage.getItem("token");

  const response = await API.post("/dsa", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteProblem = async (id) => {
  const token = localStorage.getItem("token");

  await API.delete(`/dsa/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
