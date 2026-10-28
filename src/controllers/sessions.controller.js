export const register = async (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'Endpoint preliminar de registro (Sessions)'
  });
};

export const login = async (req, res) => {
  return res.status(200).json({
    status: 'success',
    message: 'Endpoint preliminar de login (Sessions)'
  });
};