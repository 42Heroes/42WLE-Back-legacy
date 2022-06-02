export const cookieExtractor = (req) => {
  let token = null;

  if (req && req.cookie) {
    token = req.cookie['refreshToken'];
  }
  return token;
};
