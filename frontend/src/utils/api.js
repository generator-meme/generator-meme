class Api {
  constructor(options) {
    this._options = options;
  }

  _errorHandler(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  getTemplates() {
    return fetch('api/memes', {
      method: 'GET',
      body: JSON.stringify(),
      headers: this._options.headers,
  })
    .then(this._errorHandler)
  }

  getTemplate(id) {
    return fetch(`/api/memes/${id}`, {
      method: 'GET',
      headers: this._options.headers,
  })
    .then(this._errorHandler)
  }

}

const api = new Api({
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;