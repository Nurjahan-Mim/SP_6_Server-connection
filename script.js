document.getElementById("loginBtn").addEventListener("click", async () => {
  
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  
  if (!username || !password) {
    alert("Please fill in both username and password!");
    return;
  }

  try {
    const response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }), 
    });

    
    const data = await response.json();

    
    if (response.ok) {
      alert(data.message); 
     
    } else {
      alert("Login failed! " + data.message); 
    }
  } catch (error) {
    
    console.error("Error:", error);
    alert("An error occurred during login. Please try again later.");
  }
});
