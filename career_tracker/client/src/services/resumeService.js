import API from "./api";

export const getResumes = async () => {
  const token = localStorage.getItem("token");

  const response = await API.get("/resumes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const uploadResume = async (file) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  formData.append("resume", file);

  const response = await API.post("/resumes", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteResume = async (id) => {
  const token = localStorage.getItem("token");

  await API.delete(`/resumes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
