const formatBRL = (v?: number) =>
  typeof v === "number"
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(v)
    : "-";

export default formatBRL;
