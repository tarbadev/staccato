interface RequestOptions {
  url: string
  method?: string
  body?: object
}

export const request = (options: RequestOptions) => {
  if (!options.method) {
    options.method = 'GET'
  }

  let body
  if (['POST', 'PUT', 'DELETE'].includes(options.method.toUpperCase())) {
    body = JSON.stringify(options.body)
  }

  const fetchOptions = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    ...options,
    body,
  }

  return fetch(options.url, fetchOptions).then((response) => {
    if (response.status >= 400) {
      throw new Error(`Response Error: ${response.status}`)
    }
    return response.json().then(json => json)
  })
}