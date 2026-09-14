CREATE TABLE directory_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    admin_status INTEGER DEFAULT 0
);

CREATE TABLE specialist_slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    specialist_name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    clinic_name TEXT NOT NULL,
    appointment_time INTEGER NOT NULL,
    availability INTEGER DEFAULT 8
);

CREATE TABLE appointment_reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slot_id INTEGER NOT NULL,
    username TEXT NOT NULL
);

INSERT INTO directory_users (username, password, admin_status) VALUES
    ('healthadmin', 'admin123', 1),
    ('patient1', 'patient123', 0);

INSERT INTO specialist_slots
    (specialist_name, specialty, clinic_name, appointment_time, availability)
VALUES
    ('Dr Maya Patel', 'Cardiology', 'Harbour Medical Centre', 9, 5),
    ('Dr Daniel Reed', 'Dermatology', 'Riverside Clinic', 9, 3),
    ('Dr Sofia Khan', 'Neurology', 'Central Health Hub', 11, 4),
    ('Dr Oliver Grant', 'Physiotherapy', 'Harbour Medical Centre', 11, 6),
    ('Dr Amelia Woods', 'Paediatrics', 'Riverside Clinic', 13, 2),
    ('Dr Noah Evans', 'General Medicine', 'Central Health Hub', 15, 7),
    ('Dr Emily Stone', 'Ophthalmology', 'Harbour Medical Centre', 15, 0);
