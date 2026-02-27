import API from "./api";

export const getApplications = async () => {
  const token = localStorage.getItem("token");

  const response = await API.get("/applications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createApplication = async (data) => {
  const token = localStorage.getItem("token");

  const response = await API.post("/applications", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteApplication = async (id) => {
  const token = localStorage.getItem("token");

  await API.delete(`/applications/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateApplication = async (id, data) => {
  const token = localStorage.getItem("token");

  const response = await API.put(`/applications/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
