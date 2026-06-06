-- ========================================
-- Create organization table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (
    name,
    description,
    contact_email,
    logo_filename
)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);


-- ========================================
-- Create project table
-- ========================================
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(100),
    project_date DATE NOT NULL,
    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
);

-- ========================================
-- Insert sample data: Projects
-- ========================================
INSERT INTO project (
    organization_id,
    title,
    description,
    location,
    project_date
)
VALUES
-- BrightFuture Builders
(
    1,
    'Community Center Renovation',
    'Renovating an old community center for local families.',
    'Portland',
    '2026-05-10'
),
(
    1,
    'Bridge Safety Inspection',
    'Inspecting and improving small community bridges.',
    'Salem',
    '2026-06-15'
),
(
    1,
    'Affordable Housing Initiative',
    'Building affordable housing units for low-income families.',
    'Eugene',
    '2026-07-01'
),
(
    1,
    'Neighborhood Cleanup',
    'Cleaning and restoring public community spaces.',
    'Bend',
    '2026-07-20'
),
(
    1,
    'Park Accessibility Upgrade',
    'Improving park accessibility for disabled visitors.',
    'Corvallis',
    '2026-08-05'
),

-- GreenHarvest Growers
(
    2,
    'Urban Garden Workshop',
    'Teaching urban gardening techniques to residents.',
    'Portland',
    '2026-05-18'
),
(
    2,
    'Community Compost Program',
    'Launching a neighborhood composting initiative.',
    'Hillsboro',
    '2026-06-02'
),
(
    2,
    'School Greenhouse Project',
    'Building greenhouses for local schools.',
    'Beaverton',
    '2026-06-25'
),
(
    2,
    'Farmers Market Support',
    'Helping organize and support local farmers markets.',
    'Gresham',
    '2026-07-10'
),
(
    2,
    'Food Sustainability Seminar',
    'Hosting seminars about sustainable food systems.',
    'Tigard',
    '2026-08-01'
),

-- UnityServe Volunteers
(
    3,
    'Food Bank Volunteer Day',
    'Coordinating volunteers at local food banks.',
    'Portland',
    '2026-05-12'
),
(
    3,
    'Charity Run Event',
    'Organizing a community charity marathon.',
    'Salem',
    '2026-06-18'
),
(
    3,
    'Senior Assistance Program',
    'Helping elderly residents with daily tasks.',
    'Eugene',
    '2026-07-08'
),
(
    3,
    'Disaster Relief Preparation',
    'Preparing emergency kits for disaster response.',
    'Medford',
    '2026-07-30'
),
(
    3,
    'Youth Mentorship Program',
    'Connecting mentors with local youth.',
    'Corvallis',
    '2026-08-12'
);

-- ========================================
-- Create category table
-- ========================================

CREATE TABLE category (

    category_id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE

);

-- ========================================
-- Create project_category table
-- ========================================

CREATE TABLE project_category (

    project_id INTEGER NOT NULL,

    category_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES project(project_id),

    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)

);

-- ========================================
-- Insert sample data: Categories
-- ========================================

INSERT INTO category (name)
VALUES
('Environmental'),
('Educational'),
('Community Service');

-- ========================================
-- Insert sample data: Project Categories
-- ========================================

INSERT INTO project_category (
    project_id,
    category_id
)
VALUES

-- Environmental
(1, 1),
(2, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),

-- Educational
(6, 2),
(8, 2),
(10, 2),
(15, 2),

-- Community Service
(1, 3),
(4, 3),
(11, 3),
(12, 3),
(13, 3),
(14, 3),
(15, 3);