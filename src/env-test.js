// Test environment variable loading
console.log("=== Environment Variables Test ===");
console.log("MODE:", import.meta.env.MODE);
console.log("DEV:", import.meta.env.DEV);
console.log("PROD:", import.meta.env.PROD);
console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);
console.log("VITE_APP_ENV:", import.meta.env.VITE_APP_ENV);
console.log("All env vars:", import.meta.env);
