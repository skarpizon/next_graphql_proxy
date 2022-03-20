const { RESTDataSource } = require('apollo-datasource-rest')

function getApiUrl (url, id, after) {
  return `${url}${id ? `/${id}` : ''}${after ? `/${after}` : ''}`
}

const BASE_URL = 'server-url-with-rest'

const USERS_BRANCH = '/users'
const SIGNUP_LEAF = USERS_BRANCH + '/sign_up'
const REFRESH_TOKEN_LEAF = USERS_BRANCH + '/get_refresh_token'
const ACCESS_TOKEN_LEAF = USERS_BRANCH + '/get_access_token'
const CURRENT_USER_LEAF = USERS_BRANCH + '/current'

const COMPUTERS_BRANCH = '/computers'
const CREDENTIALS_BRANCH = '/credentials'

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
      request.headers.set('Authorization', `Bearer ${this.context.access_token}`)
    }
    return request
  }

  async getRefreshToken (data) {
    const res = await this.post(REFRESH_TOKEN_LEAF, data)
    const token = res?.token
    this.context.refresh_token = token
    this.context.new_refresh_token = token
    return {
      refresh_token: token
    }
  }

  async getAccessToken (data) {
    const res = await this.post(ACCESS_TOKEN_LEAF, data || {
      refresh_token: this.context.refresh_token
    })
    const token = res?.token
    this.context.access_token = token
    this.context.new_access_token = token
    return {
      access_token: token
    }
  }

  async auth (data) {
    const token = await this.getRefreshToken(data)
    return token
  }

  async signUp (data) {
    try {
      await this.post(SIGNUP_LEAF, data)
      return {
        success: true
      }
    } catch (error) {
      return {
        error: error
      }
    }
  }

  async getComputers () {
    return this.get(COMPUTERS_BRANCH)
  }

  async getCredentials (id) {
    return this.get(getApiUrl(CREDENTIALS_BRANCH, id))
  }

  async createCredential (data) {
    return this.post(CREDENTIALS_BRANCH, data)
  }

  async updateCredential (data) {
    return this.put(getApiUrl(CREDENTIALS_BRANCH, data?.id), data)
  }

  async deleteCredential (data) {
    try {
      await this.delete(getApiUrl(CREDENTIALS_BRANCH, data?.id))
      return {
        success: true
      }
    } catch (error) {
      return {
        error: error
      }
    }
  }
}

module.exports = Api
