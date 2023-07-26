export function generateRandomID(number) {
  return (Math.random() * number).toString(8).substr(2, 12);
}

