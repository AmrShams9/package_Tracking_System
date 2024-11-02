const URL = "http://127.0.0.1:5000/";

// Function to register a user
async function postData(data: object, url: string): Promise<Response> {
  const response = await fetch(URL + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const jsonData = await response.json();

  if (response.ok) {
    console.log("User registered successfully:", jsonData);
    return response;
  } else {
    console.error("Registration failed:", jsonData.message);
    return jsonData.message;
  }
}

export { postData };
