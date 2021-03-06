module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV:
    process.env.NODE_ENV ||
    'development',
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'postgresql://postgres@localhost/frenmo',
  DATABASE_TEST_URL:
    process.env.DATABASE_TEST_URL ||
    'postgresql://javier@localhost/frenmo_test',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRY:
    process.env.JWT_EXPIRY || '3h'
};
