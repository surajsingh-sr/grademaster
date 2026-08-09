import { Account, Client, Databases, ID } from "appwrite";

// Endpoint + Project ID are PUBLIC values — safe in frontend code.
// Never put an Appwrite API key here; API keys are server-only secrets.
export const appwriteConfig = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT as string,
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID as string,
  databaseId: (import.meta.env.VITE_APPWRITE_DATABASE_ID as string) || "grademaster_db",
  profilesCollectionId:
    (import.meta.env.VITE_APPWRITE_COLLECTION_PROFILES as string) || "profiles",
};

const client = new Client();

if (appwriteConfig.endpoint && appwriteConfig.projectId) {
  client.setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId);
} else {
  console.warn(
    "[GradeMaster] Missing VITE_APPWRITE_ENDPOINT / VITE_APPWRITE_PROJECT_ID in .env",
  );
}

export const account = new Account(client);
export const databases = new Databases(client);
export { ID };
export default client;
