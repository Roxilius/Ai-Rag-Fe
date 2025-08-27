export const formatNumberInput = (digits: string) => {
  const onlyDigits = digits.replace(/\D/g, "").slice(0, 12);
  return onlyDigits.replace(
    /(\d{0,3})(\d{0,4})(\d{0,4})/,
    (_, p1, p2, p3) => `+62 ${p1}${p2 ? "-" + p2 : ""}${p3 ? "-" + p3 : ""}`
  );
};

export const formatNumberEdit = (digits: string) => {
  const clean = digits.replace(/[^\d+]/g, "");
  if (!clean.startsWith("+62")) return clean;
  const withoutPrefix = clean.slice(3, 15);
  return withoutPrefix.replace(
    /(\d{3})(\d{3,4})(\d{0,4})/,
    (_, p1, p2, p3) => `+62 ${p1}-${p2}${p3 ? "-" + p3 : ""}`
  );
};

export const validatePhoneNumber = (phone: string) => {
  return (
    /^\+62 \d{3}-\d{4}-\d{4}$/.test(phone) ||
    /^\+62 \d{3}-\d{4}-\d{5}$/.test(phone)
  );
};
