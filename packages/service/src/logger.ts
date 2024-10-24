export const customLogger = {
  level: 'info',
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      headers: req.headers,
    }),
  },
};
