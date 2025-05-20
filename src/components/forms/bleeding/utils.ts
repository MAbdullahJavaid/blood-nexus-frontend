
export const generateBagNumber = (): string => {
  // Generate a random number between 10001 and 99999
  const bagNum = Math.floor(Math.random() * 90000) + 10000;
  return `B${bagNum}`;
};

export const generateRandomScreeningValue = (): string => {
  return (Math.random() * 0.43 + 0.01).toFixed(2);
};

export const generateRandomHBValue = (): string => {
  return (Math.random() * 2.4 + 13.5).toFixed(1);
};

export const calculateTestResult = (value: string): string => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return "";
  if (numValue >= 1.0) return "REACTIVE";
  if (numValue >= 0.5) return "Border Line REACTIVE";
  return "NON REACTIVE";
};

export const getFormattedDate = (): string => {
  const today = new Date();
  return `${today.getDate().toString().padStart(2, '0')}/${
    (today.getMonth() + 1).toString().padStart(2, '0')}/${
    today.getFullYear()}`;
};
