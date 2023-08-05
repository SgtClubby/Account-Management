function savePassword() {
    const website = document.getElementById("website")?.value || null;
    const username = document.getElementById("username")?.value;
    const password = document.getElementById("password")?.value;

    // Check if website, username, and password are provided
    if (!website || !username || !password) {
        alert("Please fill all fields.");
        return;
    }

    // Retrieve existing passwords from local storage
    let passwords = JSON.parse(localStorage.getItem("passwords")) || [];

    // Save new password entry
    passwords.push({ website, username, password });
    localStorage.setItem("passwords", JSON.stringify(passwords));

    alert("Password saved successfully.");
}

function getPassword() {
    const website = document.getElementById("website").value;

    if (!website) {
        alert("Please enter the website to get the password.");
        return;
    }

    let passwords = JSON.parse(localStorage.getItem("passwords")) || [];

    // Find the password entry for the specified website
    let passwordEntry = passwords.find((entry: string) => entry.website === website);

    if (passwordEntry) {
        alert(`Website: ${passwordEntry.website}\nUsername: ${passwordEntry.username}\nPassword: ${passwordEntry.password}`);
    } else {
        alert("Password not found for the specified website.");
    }
}