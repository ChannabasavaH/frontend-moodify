export const setAccessToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
  
  // Dispatch custom event to notify other components of token change
  window.dispatchEvent(new Event('accessTokenUpdated'));
};