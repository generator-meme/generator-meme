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

  _checkReponce(res) {
    return res.ok
      ? res.json()
      : res.json().then((err) => {
          return Promise.reject(err);
        });
  }

  getTemplates() {
    return fetch(`${this._baseUrl}/templates/`, {
      method: "GET",
      body: JSON.stringify(),
      headers: this._headers,
    }).then(this._errorHandler);
  }
  getTags() {
    return fetch(`${this._baseUrl}/tags/`, {
      method: "GET",
      body: JSON.stringify(),
      headers: this._headers,
    }).then(this._errorHandler);
  }
  getTagsWithQueryName(name) {
    return fetch(`${this._baseUrl}/tags/?name=${name}`, {
      method: "GET",
      body: JSON.stringify(),
      headers: this._headers,
    }).then(this._errorHandler);
  }
  getfilteredTemplates(id) {
    return fetch(`${this._baseUrl}/templates/?tag=${id}`, {
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

  getCreatedMeme(memeId) {
    return fetch(`${this._baseUrl}/memes/${memeId}`, {
      method: "GET",
      headers: this._headers,
      body: JSON.stringify(),
    }).then(this._errorHandler);
  }

  downloadNewMem(memeId) {
    return fetch(`${this._baseUrl}/memes/${memeId}/download_meme/`, {
      method: "GET",
      headers: this._headers,
    }).then((res) => {
      return new Promise((resolve, reject) => {
        if (res.status < 400) {
          return res.blob().then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "yourMeme";
            document.body.appendChild(a);
            a.click();
            a.remove();
          });
        }
        reject();
      });
    });
  }

  copyNewMeme() {}
}

const api = new Api({
  baseUrl: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
