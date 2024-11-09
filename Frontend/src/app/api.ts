const URL = "http://127.0.0.1:5000/";

async function postData(data: object, url: string): Promise<Response> {
  const response = await fetch(URL + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    return response;
  } else {
    console.error(response);
    return response;
  }
}

async function getData(url: string): Promise<Response> {
  const response = await fetch(URL + url);

  if (response.ok) {
    console.log(response);
    return response;
  } else {
    console.error(response);
    return response;
  }
}

export { postData, getData };
