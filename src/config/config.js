require('pg')
require('pg-hstore')
require('dotenv').config();

module.exports = {
  "development": {
    use_env_variable: "DATABASE_URL_DEVELOPMENT",
  },
  "test": {
    use_env_variable: "DATABASE_URL_TEST",
  },
  "production": {
    use_env_variable: "DATABASE_URL_PRODUCTION",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
}