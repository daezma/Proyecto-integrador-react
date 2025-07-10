import axios from "axios";

export const agregarItemAlCarrito = async ({
  userId,
  variacionId, // 👉 este ya es el documentId
  sku,
  precio,
  cantidad,
  bonificacion,
  descripcion,
  url_imagen,
}) => {
  const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;

  return axios.post(
    `${import.meta.env.VITE_API_URL}/item-carritos`,
    {
      data: {
        user: {
          connect: {
            id: userId, // ✅ documentId del user
          },
        },
        variacion_de_producto: {
          connect: {
            documentId: variacionId, // ✅ documentId de la variación
          },
        },
        sku,
        precio,
        cantidad,
        bonificacion,
        descripcion,
        url_imagen,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const actualizarItemCarrito = async (documentId, data) => {
  const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;

  return await axios.put(
    `${import.meta.env.VITE_API_URL}/item-carritos/${documentId}`,
    { data },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const eliminarItemDelCarrito = async (documentId) => {
  const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;

  return await axios.delete(
    `${import.meta.env.VITE_API_URL}/item-carritos/${documentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

