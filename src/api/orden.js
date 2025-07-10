import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
//const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;

export const crearOrden = async ({ cliente, user, total, items, id_cliente }) => {
  const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;
  try {
    const data = {
      data: {
        fecha: new Date().toISOString(),
        cliente: {
          connect: {
            documentId: cliente,
          },
        },
        user: {
          connect: {
            documentId: user,
          },
        },
        total,
        id_cliente: String(id_cliente),
        items: items.map((item) => ({
          variaciones_de_producto: {
            connect: {
              documentId: item.variaciones_de_producto,
            },
          },
          sku: item.sku,
          cantidad: item.cantidad,
          bonificacion: item.bonificacion ?? 0,
          precio: item.precio ?? 0,
        })),
      },
    };

    console.log("📦 Payload de orden:", JSON.stringify(data, null, 2));

    const response = await axios.post(`${API_URL}/ordenes`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error al crear la orden:", error.response?.data || error);
    throw error;
  }
};

export const getOrdenesDelUsuario = async ({ userId, page = 1, pageSize = 10 }) => {
  const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;

  try {
    const response = await axios.get(
      `${API_URL}/ordenes?filters[user][id][$eq]=${userId}&populate=items.variaciones_de_producto.producto&sort=fecha:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("❌ Error al obtener órdenes del usuario:", error.response?.data || error);
    throw error;
  }
};

