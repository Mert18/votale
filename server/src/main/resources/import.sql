-- This file allow to write SQL commands that will be emitted in test and dev.
-- The commands are commented as their support depends of the database
-- insert into myentity (id, field) values(1, 'field-1');
-- insert into myentity (id, field) values(2, 'field-2');
-- insert into myentity (id, field) values(3, 'field-3');
-- alter sequence myentity_seq restart with 4;

INSERT INTO Story (id, name, lang) VALUES (1, 'The Adventure Begins', 'English');
INSERT INTO Story (id, name, lang) VALUES (2, 'Mystery in the Forest', 'English');

SELECT setval('Story_SEQ', (SELECT MAX(id) FROM Story));

INSERT INTO Sentence (id, story_id, sentence_order, votes, content) VALUES (1, 1, 1, 5, 'Once upon a time, in a land far away...');
INSERT INTO Sentence (id, story_id, sentence_order, votes, content) VALUES (2, 1, 2, 3, 'There lived a brave knight who sought adventure.');
INSERT INTO Sentence (id, story_id, sentence_order, votes, content) VALUES (3, 1, 3, 7, 'One day, he received a mysterious letter.');
INSERT INTO Sentence (id, story_id, sentence_order, votes, content) VALUES (4, 2, 1, 4, 'The forest was dark and full of secrets.');
INSERT INTO Sentence (id, story_id, sentence_order, votes, content) VALUES (5, 2, 2, 6, 'Strange sounds echoed through the trees.');

SELECT setval('Sentence_SEQ', (SELECT MAX(id) FROM Sentence));