const webpack = require("webpack")
const FRONTEND_ENV_KEYS = ["GRAPHQL_GATEWAY_URL", "SERVER_API_URL"]

const envPlugin = FRONTEND_ENV_KEYS.reduce(
  (result, key) =>
    Object.assign({}, result, {
      [`process.env.${key}`]: JSON.stringify(process.env[key])
    }),
  {}
)

module.exports = {
  webpack(cfg) {
    cfg.plugins.push(new webpack.DefinePlugin(envPlugin))
    return cfg
  }
}
