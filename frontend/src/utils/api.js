class Api {
  constructor(data) {
    this._baseUrl = data.baseUrl;
    this._headers = data.headers;
  }

  _errorHandler(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  getTemplates() {
    return fetch(`${this._baseUrl}/templates/`, {
      method: "GET",
      body: JSON.stringify(),
      headers: this._headers,
    }).then(this._errorHandler);
  }

  createNewMem(memeUrl, memeId) {
    return fetch(`${this._baseUrl}/memes/`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        image: memeUrl,
        template: memeId,
      }),
    }).then(this._errorHandler);
  }
}

const api = new Api({
  baseUrl: "http://localhost/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
