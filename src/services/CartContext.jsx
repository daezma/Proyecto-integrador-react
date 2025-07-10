import { createContext, useContext, useState, useMemo, useEffect } from "react";
import axios from "axios";
import { agregarItemAlCarrito, actualizarItemCarrito } from "../api/carrito";
import { normalizarItem } from "../utils/normalizarItem";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = JSON.parse(localStorage.getItem("auth") || "{}")?.token;
  const { user } = useAuth();

  useEffect(() => {
    if (user?.id && token) {
      cargarCarrito(user.id);
    }
  }, [user?.id]);

  const cargarCarrito = async (userId) => {
    if (!userId || !token) return;

    setLoading(true);
    try {
      // const res = await axios.get(
      //   `${import.meta.env.VITE_API_URL}/item-carritos?filters[user][id][$eq]=${userId}&populate=variacion_de_producto`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/item-carritos/con-datos`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //console.log("🧾 Carrito cargado desde Strapi:", res.data.data);
      const normalizados = (res.data.data || []).map((item) =>
        normalizarItem(item)
      );
      setItems(normalizados);
    } catch (err) {
      //console.error("❌ Error al cargar el carrito:", err);
    } finally {
      setLoading(false);
    }
  };

  // 👇 Esto recalcula automáticamente la cantidad total cada vez que items cambia
  const cantidadTotal = useMemo(() => {
    return items.reduce((acc, item) => {
      const cantidad = Number(item?.attributes?.cantidad ?? 0);
      return acc + (isNaN(cantidad) ? 0 : cantidad);
    }, 0);
  }, [items]);

  const agregarItem = async ({
    userId,
    variacionId,
    sku,
    precio,
    cantidad,
    bonificacion,
    descripcion,
    url_imagen,
  }) => {
    try {
      const existente = items.find((item, index) => {
        const itemSku = item?.attributes?.sku ?? "";
        const rawVariacion = item?.attributes?.variacion_de_producto;
        const itemVariacionDocumentId =
          typeof rawVariacion === "object"
            ? rawVariacion?.documentId
            : rawVariacion;

        const coincide =
          itemSku === sku &&
          String(itemVariacionDocumentId) === String(variacionId);
        return coincide;
      });

      if (existente) {
        const documentId = existente.documentId ?? existente.id;
        const cantidadExistente = parseInt(
          existente?.attributes?.cantidad ?? 0,
          10
        );
        const nuevaCantidad = cantidadExistente + cantidad;

        const res = await actualizarItemCarrito(documentId, {
          cantidad: nuevaCantidad,
          precio,
          bonificacion,
        });

        const actualizado = res.data?.data;

        if (actualizado) {
          const itemActualizado = normalizarItem(actualizado, {
            userId,
            variacionId,
          });

          setItems((prev) =>
            prev.map((item) =>
              item.documentId === documentId ? itemActualizado : item
            )
          );
        }
      } else {
        const res = await agregarItemAlCarrito({
          userId,
          variacionId,
          sku,
          precio,
          cantidad,
          bonificacion,
          descripcion,
          url_imagen,
        });

        const nuevo = res.data?.data;

        if (nuevo) {
          const itemNuevo = normalizarItem(nuevo, { userId, variacionId });
          setItems((prev) => [...prev, itemNuevo]);
        }
      }
    } catch (err) {
      //console.error("❌ Error al agregar/modificar item:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        setItems,
        cargarCarrito,
        cantidadTotal,
        agregarItem,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCarrito = () => useContext(CartContext);
