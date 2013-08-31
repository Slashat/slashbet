Slashbet
========


Bra att ha
----------
Håll scss filerna uppdaterade när du jobbar genom att köra:

$ grunt watch

Grunt sass kräver att du har sass gemen installerad (ruby)

$ gem install sass



Database
--------

CREATE DATABASE slashbet


-- Table: bets

-- DROP TABLE bets;

CREATE TABLE bets
(
  id serial NOT NULL,
  bet text,
  color character(6),
  date date,
  hash character varying(10),
  CONSTRAINT bets_key PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE bets
  OWNER TO <user>;


-- Table: votes

-- DROP TABLE votes;

CREATE TABLE votes
(
  bet_id integer NOT NULL,
  ip character(15) NOT NULL,
  vote boolean NOT NULL,
  CONSTRAINT "Primary_key" PRIMARY KEY (bet_id, ip, vote)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE votes
  OWNER TO <user>;