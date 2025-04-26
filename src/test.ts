function decodeTimestamp(timestamp: number): string {
  const timestampWithOffset = timestamp + 946684800 * 1000;
  const utcDate = new Date(timestampWithOffset);

  const localDate = new Date(utcDate.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  
  const hours = String(localDate.getHours()).padStart(2, '0');
  const minutes = String(localDate.getMinutes()).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const year = localDate.getFullYear();

  const formattedTime = `${hours}:${minutes} ${day}/${month}/${year}`;
  return formattedTime;
}


// Example usage
const timestamp = 1745609425000;
const result = decodeTimestamp(timestamp);
console.log(`The decoded timestamp is: ${result}`);