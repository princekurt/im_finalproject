-- Independent tables first (no foreign keys)
CREATE TABLE tbl_gender (
    gender_id SERIAL PRIMARY KEY,
    gender_name VARCHAR(10)
);

CREATE TABLE tbl_relationshipstatus (
    relation_status_id SERIAL PRIMARY KEY,
    relation_status_name VARCHAR(10)
);

CREATE TABLE tbl_walkintype (
    walkintype_id SERIAL PRIMARY KEY,
    walkintype_name VARCHAR(100),
    walkin_fee DECIMAL(10,2)
);

CREATE TABLE tbl_receptionist (
    receptionist_id SERIAL PRIMARY KEY,
    receptionist_name VARCHAR(100)
);

CREATE TABLE tbl_paymenttype (
    paymenttype_id SERIAL PRIMARY KEY,
    paymenttype_name VARCHAR(50)
);

CREATE TABLE tbl_discounttype (
    discounttype_id SERIAL PRIMARY KEY,
    discounttype_name VARCHAR(50),
    discounttype_fee DECIMAL(10,2)
);

CREATE TABLE tbl_membershiptype (
    membershiptype_id SERIAL PRIMARY KEY,
    membershiptype_name VARCHAR(100),
    membership_fee DECIMAL(10,2)
);

-- Customer (depends on gender and relationshipstatus)
CREATE TABLE tbl_customer (
    customer_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100),
    contact_number VARCHAR(20),
    address VARCHAR(150),
    gender_id INT REFERENCES tbl_gender(gender_id),
    dob DATE,
    relation_status_id INT REFERENCES tbl_relationshipstatus(relation_status_id)
);

-- Membership (depends on membershiptype and customer)
CREATE TABLE tbl_membership (
    membership_id SERIAL PRIMARY KEY,
    membershiptype_id INT REFERENCES tbl_membershiptype(membershiptype_id),
    customer_id INT REFERENCES tbl_customer(customer_id),
    start_date DATE,
    end_date DATE
);

-- Transaction (depends on receptionist, paymenttype, discounttype)
-- discounttype_id is NULL when no discount is applied
CREATE TABLE tbl_transaction (
    transac_id SERIAL PRIMARY KEY,
    receptionist_id INT REFERENCES tbl_receptionist(receptionist_id),
    paymenttype_id INT REFERENCES tbl_paymenttype(paymenttype_id),
    transac_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2),
    discounttype_id INT DEFAULT NULL REFERENCES tbl_discounttype(discounttype_id),
    amount_due DECIMAL(10,2)
);

-- MembershipTransaction subtype (depends on transaction and membership)
CREATE TABLE tbl_membershiptransaction (
    transac_id INT PRIMARY KEY REFERENCES tbl_transaction(transac_id) ON DELETE CASCADE ON UPDATE CASCADE,
    membership_id INT REFERENCES tbl_membership(membership_id)
);

-- WalkInTransaction subtype (depends on customer, walkintype, transaction)
CREATE TABLE tbl_walkintransaction (
    transac_id INT PRIMARY KEY REFERENCES tbl_transaction(transac_id) ON DELETE CASCADE ON UPDATE CASCADE,
    customer_id INT REFERENCES tbl_customer(customer_id),
    time_in TIMESTAMP,
    time_out TIMESTAMP,
    walkintype_id INT REFERENCES tbl_walkintype(walkintype_id)
);

ALTER TABLE tbl_relationshipstatus
ALTER COLUMN relation_status_name TYPE VARCHAR(30);
