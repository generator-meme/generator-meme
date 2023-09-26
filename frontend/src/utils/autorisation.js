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
    return fetch(`${this._baseUrl}/users/`, {
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
    return fetch(`${this._baseUrl}/users/activation/`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        uid: uid,
        token: token,
      }),
    }).then(this._checkResponse);
  }
  logIn(email, password) {
    return fetch(`${this._baseUrl}/token/login/`, {
      method: "POST",
      //   credentials: "include", // для tokena внутри httpOnly cookie, если потом будет реализовывать
      headers: this._headers,
      body: JSON.stringify({
        password: password,
        email: email,
      }),
    }).then(this._checkResponse);
  }
  resetPassword(email) {
    return fetch(`${this._baseUrl}/users/reset_password/`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        email: email,
      }),
    }).then(this._checkResponse);
  }
  resetPasswordConfirm(uid, token, new_password) {
    return fetch(`${this._baseUrl}/users/reset_password_confirm/`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        uid: uid,
        token: token,
        new_password: new_password,
      }),
    }).then(this._checkResponse);
  }
  checkToken(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      // credentials: "include", // для отправки httpOnlyCookie
      headers: {
        "Accept": "application/json", // prettier-ignore
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`, // prettier-ignore
      },
    }).then(this._checkResponse);
  }

  logOut(token) {
    return fetch(`${this._baseUrl}/token/logout/`, {
      method: "POST",
      // credentials: "include",
      headers: {
        "Accept": "application/json", // prettier-ignore
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`, // prettier-ignore
      },
    }).then(this._checkResponse);
  }
}

export const authorisation = new Authorisation({
  baseUrl: "/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
});
