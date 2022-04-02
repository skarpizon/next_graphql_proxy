const { RESTDataSource } = require("apollo-datasource-rest")

function getApiUrl(url, id, after) {
  return `${url}${id ? `/${id}` : ""}${after ? `/${after}` : ""}`
}

const BASE_URL = process.env.SERVER_API_URL

const USERS_BRANCH = "/users"
const SIGNUP_LEAF = USERS_BRANCH + "/sign_up"
const REFRESH_TOKEN_LEAF = USERS_BRANCH + "/get_refresh_token"
const ACCESS_TOKEN_LEAF = USERS_BRANCH + "/get_access_token"
const CURRENT_USER_LEAF = USERS_BRANCH + "/current"
const CONFIRM_USER_LEAF = USERS_BRANCH + "/confirm_registration"
const REQUEST_RECOVERY_LEAF = USERS_BRANCH + "/send_password_recovery_code"
const RECOVER_PASSWORD_LEAF = USERS_BRANCH + "/recover_password"

class Api extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = BASE_URL
  }

  async willSendRequest(request) {
    if (this.context.refresh_token) {
      if (!this.context.access_token && request.path !== ACCESS_TOKEN_LEAF) {
        await this.getAccessToken()
      }
      request.headers.set(
        "Authorization",
        `Bearer ${this.context.access_token}`
      )
    }
    return request
  }

  async getRefreshToken(data) {
    const res = await this.post(REFRESH_TOKEN_LEAF, data)
    const token = res?.token
    this.context.refresh_token = token
    this.context.new_refresh_token = token
    return {
      refresh_token: token
    }
  }

  async getAccessToken(data) {
    const res = await this.post(
      ACCESS_TOKEN_LEAF,
      data || {
        refresh_token: this.context.refresh_token
      }
    )
    const token = res?.token
    this.context.access_token = token
    this.context.new_access_token = token
    return {
      access_token: token
    }
  }

  async auth(data) {
    const token = await this.getRefreshToken(data)
    return token
  }

  async currentUser() {
    return this.get(getApiUrl(CURRENT_USER_LEAF))
  }

  async signUp(data) {
    try {
      await this.post(SIGNUP_LEAF, data)
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error?.extensions?.response?.body?.error ?? true
      }
    }
  }

  async signUpConfirm(data) {
    try {
      await this.post(CONFIRM_USER_LEAF, data)
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error?.extensions?.response?.body?.error ?? true
      }
    }
  }

  async getRecoveryCode(data) {
    try {
      await this.post(REQUEST_RECOVERY_LEAF, data)
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error?.extensions?.response?.body?.error ?? true
      }
    }
  }

  async recoverPassword(data) {
    try {
      await this.post(RECOVER_PASSWORD_LEAF, data)
      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error?.extensions?.response?.body?.error ?? true
      }
    }
  }
}

module.exports = Api
