---

# Uploading the Paystack Webhook to Firebase Functions

## Prerequisites
- Node.js installed on your machine
- Firebase CLI installed (`npm install -g firebase-tools`)
- A Firebase project created on the [Firebase Console](https://console.firebase.google.com/)

## Steps


### 1. Navigate to the Functions Directory

```bash
cd functions
```

### 2. Replace or Add Your Existing Function

Replace the `index.js` file in the `functions` directory with your existing Firebase Cloud Function or add new functions as needed.

### 3. Update Dependencies

If your existing function has additional dependencies, make sure to install them.

```bash
npm install
```

### 4. Update .env.example in Functions Folder

Update the .env.example file by first rename it to .env and placing in it your secret keys for prisma and paystack.

### 5. Deploy to Firebase Functions

Deploy your functions to Firebase using the following command:

```bash
firebase deploy --only functions
```

This command will deploy only the functions to Firebase.

### 6. Verify Deployment

After the deployment is complete, Firebase will provide you with the URLs for your deployed functions. Verify the deployment status and function URLs in the terminal output.

### Additional Notes:

- If you have environment variables or configuration files, make sure they are appropriately configured for your production environment.

- Firebase Functions are hosted in the same Firebase project as your other Firebase services. Ensure that the Firebase project is properly set up with the necessary configurations.

- Always test your functions locally before deploying to production to catch any potential issues.

Congratulations! You have successfully uploaded your already created Firebase function to Firebase Functions.

Feel free to reach out if you have any questions or need further assistance.