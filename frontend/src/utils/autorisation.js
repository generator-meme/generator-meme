class Authorisation {
  constructor(data) {
    this._baseUrl = data.baseUrl;
    this._headers = data.headers;
  }

  async _checkResponse(res) {
    if (res.ok) {
      return res.status === 204 ? res.text : res.json();
    }
    return Promise.reject(await res.json());
  }

  signIn(name, email, password) {
    return fetch(`${this._baseUrl}`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        username: name,
        email: email,
        password: password,
      }),
    }).then(this._checkResponse);
  }
  activateAccount(uid, token) {
    return fetch(`${this._baseUrl}activation/`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        uid: uid,
        token: token,
      }),
    }).then(this._checkResponse);
  }
  //   signIn(name, email, password) {
  //     return fetch(`${this._baseUrl}`, {
  //       method: "POST",
  //       headers: this._headers,
  //       body: JSON.stringify({
  //         name: name,
  //         email: email,
  //         password: password,
  //       }),
  //     }).then(this._checkResponse);
  //   }

  //   login(email, password) {
  //     return fetch(`${this._baseUrl}/signin`, {
  //       method: "POST",
  //       credentials: "include",
  //       headers: this._headers,
  //       body: JSON.stringify({
  //         password: password,
  //         email: email,
  //       }),
  //     }).then(this._checkResponse);
  //   }

  //   checkToken() {
  //     return fetch(`${this._baseUrl}/users/me`, {
  //       method: "GET",
  //       credentials: "include",
  //       headers: this._headers,
  //     }).then(this._checkResponse);
  //   }

  //   signout() {
  //     return fetch(`${this._baseUrl}/signout`, {
  //       method: "POST",
  //       credentials: "include",
  //       headers: this._headers,
  //     }).then(this._checkResponse);
  //   }
}

export const authorisation = new Authorisation({
  baseUrl: "/api/auth/users/",
  headers: {
    "Content-Type": "application/json",
  },
});
