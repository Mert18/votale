-- This file allow to write SQL commands that will be emitted in test and dev.
-- The commands are commented as their support depends of the database
-- insert into myentity (id, field) values(1, 'field-1');
-- insert into myentity (id, field) values(2, 'field-2');
-- insert into myentity (id, field) values(3, 'field-3');
-- alter sequence myentity_seq restart with 4;

INSERT INTO Sentence (id, previous_sentence_id, votes, content) VALUES (1, null, 63, '1 Once upon a time, in a land far away...');
INSERT INTO Sentence (id, previous_sentence_id, votes, content) VALUES (2, 1, 4,'There lived a brave knight who sought adventure.');
INSERT INTO Sentence (id, previous_sentence_id, votes, content) VALUES (3, 1, 1, 'One day, he received a mysterious letter.');
INSERT INTO Sentence (id, previous_sentence_id, votes, content) VALUES (4, 2, 2, 'The forest was dark and full of secrets.');
INSERT INTO Sentence (id, previous_sentence_id, votes, content) VALUES (5, 3, 2, 'Strange sounds echoed through the trees.');
INSERT INTO Sentence (id, previous_sentence_id, votes, content) VALUES (6, null, 4, 'Another first');
INSERT INTO Sentence (id, previous_sentence_id, votes, content) VALUES (7, 6, 2, 'Another second');
INSERT INTO Sentence (id, previous_sentence_id, votes, content) VALUES (8, null, 53, 'Voaaah it makes three');



SELECT setval('Sentence_SEQ', (SELECT MAX(id) FROM Sentence));