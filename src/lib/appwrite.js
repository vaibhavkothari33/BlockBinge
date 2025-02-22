import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client();

client
    .setEndpoint('YOUR_APPWRITE_ENDPOINT') // Replace with your Appwrite endpoint
    .setProject('YOUR_PROJECT_ID'); // Replace with your project ID

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client); 