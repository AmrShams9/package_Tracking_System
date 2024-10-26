// Function to register a user
async function registerUser(user: JSON): Promise<Response> {
  const response = await fetch("http://127.0.0.1:5000/sign-up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const data = await response.json();

  if (response.ok) {
    console.log("User registered successfully:", data);
    return response;
  } else {
    console.error("Registration failed:", data.message);
    return data.message;
  }
}

// Function to login a user
async function loginUser(user: JSON): Promise<Response> {
  const response = await fetch("http://127.0.0.1:5000/sign-in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const data = await response.json();

  if (response.ok) {
    console.log("Login successful:", data);
    return response;
  } else {
    console.error("Login failed:", data.message);
    return data.message;
  }
}

export { loginUser, registerUser };
