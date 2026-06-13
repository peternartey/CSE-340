import db from '../models/db.js';

const setup = async () => {
  await db.query(`CREATE TABLE IF NOT EXISTS project_volunteer (
    user_id INTEGER NOT NULL,
    project_id INTEGER NOT NULL,
    signed_up_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, project_id)
  )`);

  console.log('project_volunteer table created');
  process.exit(0);
};

setup().catch((err) => {
  console.error(err);
  process.exit(1);
});
