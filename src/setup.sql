-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS organizations;

-- Create organizations table
CREATE TABLE organizations (
  organization_id SERIAL PRIMARY KEY,
  organization_name VARCHAR(255) NOT NULL UNIQUE,
  organization_address VARCHAR(255),
  organization_phone VARCHAR(12),
  organization_email VARCHAR(255)
);

-- Create categories table
CREATE TABLE categories (
  category_id SERIAL PRIMARY KEY,
  category_name VARCHAR(255) NOT NULL UNIQUE
);

-- Create projects table
CREATE TABLE projects (
  project_id SERIAL PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL,
  project_description TEXT,
  organization_id INT NOT NULL,
  FOREIGN KEY (organization_id) REFERENCES organizations(organization_id)
);

-- Create project_categories junction table for many-to-many relationship
CREATE TABLE project_categories (
  project_id INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (project_id, category_id),
  FOREIGN KEY (project_id) REFERENCES projects(project_id),
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- Insert sample organizations
INSERT INTO organizations (organization_name, organization_address, organization_phone, organization_email)
VALUES
  ('Community Outreach Foundation', '123 Main St, Springfield, IL 62701', '217-555-1234', 'info@cofo.org'),
  ('Education First Initiative', '456 Oak Ave, Springfield, IL 62702', '217-555-5678', 'contact@efi.org'),
  ('Health & Wellness Alliance', '789 Elm St, Springfield, IL 62703', '217-555-9012', 'hello@hwa.org');

-- Insert sample categories
INSERT INTO categories (category_name)
VALUES
  ('Environmental'),
  ('Educational'),
  ('Community Service'),
  ('Health and Wellness');

-- Insert sample projects
INSERT INTO projects (project_name, project_description, organization_id)
VALUES
  ('Park Cleanup Initiative', 'Monthly park cleanup and environmental restoration', 1),
  ('Tutoring Program', 'Free tutoring for underprivileged students', 2),
  ('Community Garden', 'Community-led urban garden project', 1),
  ('Health Awareness Campaign', 'Health education and wellness workshops', 3);

-- Associate projects with categories
INSERT INTO project_categories (project_id, category_id)
VALUES
  (1, 1), -- Park Cleanup: Environmental
  (1, 3), -- Park Cleanup: Community Service
  (2, 2), -- Tutoring: Educational
  (2, 3), -- Tutoring: Community Service
  (3, 1), -- Community Garden: Environmental
  (3, 3), -- Community Garden: Community Service
  (4, 4); -- Health Awareness: Health and Wellness
