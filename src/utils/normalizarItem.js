export const normalizarItem = (item, { userId, variacionId } = {}) => {
  const attrs = item.attributes ?? item;

  const rawVariacion = item.variacion_de_producto ?? attrs.variacion_de_producto;
  const variacion =
    typeof rawVariacion === "object"
      ? {
          ...rawVariacion,
          id: rawVariacion?.id,
          documentId: rawVariacion?.documentId ?? rawVariacion?.id,
        }
      : { id: variacionId, documentId: variacionId };

  return {
    id: item.id,
    documentId: item.documentId ?? item.id,
    precio_actualizado: item.precio_actualizado ?? null,
    variacion_de_producto: variacion,
    attributes: {
      cantidad: Number(attrs.cantidad ?? 0),
      sku: attrs.sku ?? "",
      precio: Number(attrs.precio ?? 0),
      bonificacion: Number(attrs.bonificacion ?? 0),
      variacion_de_producto: {
        id: variacion.id,
        documentId: variacion.documentId,
      },
      descripcion: item.descripcion ?? "",
      url_imagen: item.url_imagen ?? "",
      user:
        typeof attrs.user === "object"
          ? attrs.user
          : { id: userId },
    },
  };
};
