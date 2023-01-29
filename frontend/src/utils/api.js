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

  getMemes() {
    return fetch(`api/memes`, {
    method: 'GET',
    body: JSON.stringify(),
    headers: this._options.headers,
  })
    .then(this._errorHandler)
  }

  getMemes(meme_id) {
    return fetch(`/api/memes/${meme_id}`, {
    method: 'GET',
    headers: this._options.headers,
  })
    .then(this._errorHandler)
  }

}

export default new Api(process.env.API_URL || 'http://localhost', { 'content-type': 'application/json' })