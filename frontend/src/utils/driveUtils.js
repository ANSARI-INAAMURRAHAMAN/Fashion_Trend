export const getGoogleDriveImageUrl = (fileId) => {
  if (!fileId) return null;
  // Use direct thumbnail URL for better performance
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
};

export const extractFileIdFromUrl = (url) => {
  if (!url) return null;
  
  // Handle different Google Drive URL formats
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,  // Format: /file/d/{fileId}
    /id=([a-zA-Z0-9_-]+)/,          // Format: id={fileId}
    /([a-zA-Z0-9_-]{25,})/          // Just the fileId
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  
  return null;
};
