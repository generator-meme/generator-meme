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
  _errorHa(res) {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`);
    }
  }

  _checkReponce(res) {
    return res.ok
      ? res.json()
      : res.json().then((err) => {
          return Promise.reject(err);
        });
  }

  getTemplates(savedToken, options, pagination = { offset: 0, limit: 21 }) {
    // console.log("test")
    // console.log(options, pagination)
    // console.log(`${this._baseUrl}/templates/?tag=${options.tags}&category=${options.categories}&is_favorited=${options.areFavorite}&ordering=${options.ordering}
    // &offset=${pagination.offset}&limit=${pagination.limit}`)
    return fetch(
      `${this._baseUrl}/templates/?tag=${options.tags}&category=${options.categories}&is_favorited=${options.areFavorite}&ordering=${options.ordering}&offset=${pagination.offset}&limit=${pagination.limit}`,
      {
        method: "GET",
        body: JSON.stringify(),
        headers:
          savedToken.length > 0
            ? {
                "Content-Type": "application/json",
                "Authorization": `Token ${savedToken}`, // prettier-ignore
              }
            : this._headers,
      }
    ).then(this._errorHandler);
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
            window.URL.revokeObjectURL(url);
          });
        }
        reject();
      });
    });
  }

  addTemplateToFavorites(templateId, token) {
    return fetch(`${this._baseUrl}/templates/${templateId}/favorite/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`, // prettier-ignore
      },
    }).then(this._checkReponce);
  }

  removeTemplateFromFavorites(templateId, token) {
    return fetch(`${this._baseUrl}/templates/${templateId}/favorite/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`, // prettier-ignore
      },
    }).then(this._checkReponce);
  }

  getCategories() {
    return fetch(`${this._baseUrl}/categories/`, {
      method: "GET",
      body: JSON.stringify(),
      headers: this._headers,
    }).then(this._errorHandler);
  }
  getTeam() {
    return fetch(`${this._baseUrl}/team/`, {
      method: "GET",
      body: JSON.stringify(),
      headers: this._headers,
    }).then(this._errorHandler);
  }
  addMemeToMyCollection(meme_url, token) {
    return fetch(`${this._baseUrl}/memes/my-collection/add/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        meme: meme_url,
      }),
    }).then(this._errorHa);
  }
  getMemesInMyCollection(
    token,
    option = {
      template_tag: "/*/",
      limit: 4,
      offset: 0,
      only_my: "true",
      ordering: "-added_at",
    }
  ) {
    return fetch(
      `${this._baseUrl}/memes/my-collection/?template_tag=${option.template_tag}&limit=${option.limit}&offset=${option.offset}&only_my='${option.only_my}'&ordering=${option.ordering}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(),
      }
    ).then(this._checkReponce);
  }
  deleteMemeFromMyCollection(meme_id, token) {
    return fetch(`${this._baseUrl}/memes/my-collection/delete/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        meme: meme_id,
      }),
    }).then(this._errorHa);
  }
  getGroups(search = "") {
    return fetch(`${this._baseUrl}/groups/?name=${search}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    }).then(this._checkReponce);
  }
  getMyGroups(token) {
    return fetch(`${this._baseUrl}/users/mygroups`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(),
    }).then(this._checkReponce);
  }
}

const api = new Api({
  baseUrl: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
