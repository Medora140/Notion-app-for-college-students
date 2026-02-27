import API from "./api";

export const getInterviews = async () => {
  const token = localStorage.getItem("token");

  const response = await API.get("/interviews", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createInterview = async (data) => {
  const token = localStorage.getItem("token");

  const response = await API.post("/interviews", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteInterview = async (id) => {
  const token = localStorage.getItem("token");

  await API.delete(`/interviews/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
