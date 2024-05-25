function timeAgo(timestamp) {
    const dateTime = new Date(timestamp);
    const now = new Date();
    const secondsPast = (now.getTime() - dateTime.getTime()) / 1000;
    
    if (secondsPast < 60) { // less than a minute
      return `${Math.round(secondsPast)} seconds ago`;
    }
    if (secondsPast < 3600) { // less than an hour
      return `${Math.round(secondsPast / 60)} minutes ago`;
    }
    if (secondsPast <= 86400) { // less than a day
      return `${Math.round(secondsPast / 3600)} hours ago`;
    }
    if (secondsPast > 86400) { // more than one day
      const days = Math.round(secondsPast / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }
  
  export default timeAgo;
  