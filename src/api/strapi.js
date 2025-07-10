import axios from "axios";

// ⚙️ Base de la API Strapi
const API_URL = import.meta.env.VITE_API_URL;
const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;

// 🛡️ Instancia Axios configurada
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

api.interceptors.request.use((config) => {
  const stored = JSON.parse(localStorage.getItem("auth") || "{}");
  const token = stored?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 📦 Función para obtener un producto
export const getProductoById = async (id) => {
  try {
    const response = await api.get(`/productos/${id}?populate[variaciones][populate]=foto&populate=foto_principal`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener producto:", error);
    throw error;
  }
};

export const getProductoConPrecioById = async (id) => {
  try {
    const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;

    const response = await api.get(`/productos-con-precio/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    //console.log("📦 Producto recibido desde la API:", response.data);

    return response.data;
  } catch (error) {
    console.error("Error al obtener producto con precio:", error);
    throw error;
  }
};


export async function loginUser(identifier, password) {
  const res = await fetch(`${API_URL}/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error?.message || "Error al iniciar sesión");
  }

  return res.json(); // Devuelve { jwt, user }
}

export async function getUserMe(token) {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("No se pudo obtener el usuario");
  }

  return res.json(); // Devuelve el objeto usuario
}

//Empresa
export const getEmpresa = async () => {
  try {
    const response = await api.get(`/empresa?populate=*`);
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener empresa:", error);
    throw error;
  }
};

export async function getProductosConPrecios(page = 1, pageSize = 9, categoria = null, busqueda = "") {
  const auth = localStorage.getItem("auth");
  const token = auth ? JSON.parse(auth).token : null;

  const params = {
    page,
    pageSize,
  };

  if (categoria) {
    params.categoria = categoria;
  }

  if (busqueda) {
    params.busqueda = busqueda;
  }

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/productos/productos-con-precios`, {
    params,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  //console.log("📦 Productos recibidos desde la API:", res.data?.data);

  return res.data;
}

export default api;
