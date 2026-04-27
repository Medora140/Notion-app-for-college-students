import API from "./api";

export const getApplications = async () => {
  const token = localStorage.getItem("token");

  const response = await API.get("/api/applications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createApplication = async (data) => {
  const token = localStorage.getItem("token");

  const response = await API.post("/api/applications", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteApplication = async (id) => {
  const token = localStorage.getItem("token");

  await API.delete(`/api/applications/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateApplication = async (id, data) => {
  const token = localStorage.getItem("token");

  const response = await API.put(`/api/applications/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
