-- Seed data for techniques
INSERT INTO techniques (name, description, category, belt_level, status) VALUES
('Armbar from Guard', 'Basic armbar submission from closed guard position', 'Guard', 'white', 'not_started'),
('Triangle Choke', 'Triangle choke submission from guard', 'Guard', 'white', 'not_started'),
('Kimura from Side Control', 'Kimura shoulder lock from side control position', 'Side Control', 'white', 'not_started'),
('Double Leg Takedown', 'Basic double leg takedown', 'Takedowns', 'white', 'not_started'),
('Spider Guard Sweep', 'Basic spider guard sweep', 'Guard', 'blue', 'not_started'),
('Berimbolo', 'Advanced guard inversion technique', 'Guard', 'purple', 'not_started'),
('Back Take from Turtle', 'Taking the back from turtle position', 'Back Control', 'blue', 'not_started'),
('Cross Collar Choke from Mount', 'Basic cross collar choke from mount position', 'Mount', 'white', 'not_started');

-- Note: User progress will be created automatically when users sign up and start tracking their progress
