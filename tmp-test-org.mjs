import dotenv from 'dotenv';
import { getAllOrganizations } from './src/models/organizations.js';
dotenv.config();
try {
  const orgs = await getAllOrganizations();
  console.log('orgs', orgs.slice(0, 3));
} catch (err) {
  console.error('org error', err);
}
