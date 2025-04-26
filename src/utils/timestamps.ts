function decodeTimestamp(timestamp: number): string {
  // Convert to a Date object (UTC)
  const utcDate = new Date(timestamp);

  // Convert to Vietnam time zone (UTC+7)
  const options = {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
  };

  // Format the date manually to ensure consistent formatting
  const localDate = new Date(utcDate.toLocaleString('en-US', {
      timeZone: 'Asia/Ho_Chi_Minh'
  }));

  const hours = String(localDate.getHours()).padStart(2, '0');
  const minutes = String(localDate.getMinutes()).padStart(2, '0');
  const day = String(localDate.getDate()).padStart(2, '0');
  const month = String(localDate.getMonth() + 1).padStart(2, '0');
  const year = localDate.getFullYear();

  const formattedTime = `${hours}:${minutes} ${day}/${month}/${year}`;
  return formattedTime;
}

export default decodeTimestamp;