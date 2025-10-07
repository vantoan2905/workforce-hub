
CREATE TABLE employee (
    employee_id    SERIAL PRIMARY KEY,                
    username       VARCHAR(150) UNIQUE NOT NULL,
    password       VARCHAR(255) NOT NULL,             -- HASH (bcrypt/argon2)
    email          VARCHAR(255) UNIQUE NOT NULL,
    phone_number   VARCHAR(20),
    first_name     VARCHAR(100),
    last_name      VARCHAR(100),
    address        TEXT,
    date_of_birth  DATE,
    card_id``        VARCHAR(50),
    is_active      BOOLEAN DEFAULT true,
    is_deleted     BOOLEAN DEFAULT false,
    role           VARCHAR(50) DEFAULT 'employee' CHECK (role IN ('employee','manager', 'admin')),
    created_at     TIMESTAMP DEFAULT now(),
    updated_at     TIMESTAMP DEFAULT now()
);
CREATE TABLE auth (
    auth_id        SERIAL PRIMARY KEY,
    employee_id    INT UNIQUE NOT NULL REFERENCES employee(employee_id) ON DELETE CASCADE,
    refresh_token  TEXT,
    created_at     TIMESTAMP DEFAULT now(),
    updated_at     TIMESTAMP DEFAULT now()
);

CREATE TABLE roles (
    role_id        SERIAL PRIMARY KEY,
    role_name      VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE employee_roles (
    employee_id    INT NOT NULL REFERENCES employee(employee_id) ON DELETE CASCADE,
    role_id        INT NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    PRIMARY KEY (employee_id, role_id)
);


CREATE TABLE tasks (
    task_id        SERIAL PRIMARY KEY,
    name_task      VARCHAR(255) NOT NULL,
    status         VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','in_progress','done')),
    priority       VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
    created_by     INT REFERENCES employee(employee_id),
    created_at     TIMESTAMP DEFAULT now(),
    updated_at     TIMESTAMP DEFAULT now()
);


CREATE TABLE employee_tasks (
    employee_id    INT NOT NULL REFERENCES employee(employee_id) ON DELETE CASCADE,
    task_id        INT NOT NULL REFERENCES tasks(task_id) ON DELETE CASCADE,
    PRIMARY KEY (employee_id, task_id)
);


CREATE TABLE task_update_history (
    update_id      SERIAL PRIMARY KEY,
    task_id        INT NOT NULL REFERENCES tasks(task_id) ON DELETE CASCADE,
    field_name     VARCHAR(100),                      -- Trường nào thay đổi
    old_value      TEXT,
    new_value      TEXT,
    updated_by     INT REFERENCES employee(employee_id),
    updated_at     TIMESTAMP DEFAULT now()
);


CREATE TABLE task_descriptions (
    description_id SERIAL PRIMARY KEY,
    task_id        INT NOT NULL REFERENCES tasks(task_id) ON DELETE CASCADE,
    description    TEXT,
    created_by     INT REFERENCES employee(employee_id),
    created_at     TIMESTAMP DEFAULT now()
);

CREATE TABLE checked (
    checked_id     SERIAL PRIMARY KEY,
    employee_id    INT NOT NULL REFERENCES employee(employee_id) ON DELETE CASCADE,
    check_date     DATE NOT NULL,
    check_in       TIMESTAMP,
    check_out      TIMESTAMP,
    status         VARCHAR(50) DEFAULT 'present' CHECK (status IN ('present','late','absent'))
);


CREATE TABLE timekeeping (
    timekeeping_id SERIAL PRIMARY KEY,
    task_id        INT NOT NULL REFERENCES tasks(task_id) ON DELETE CASCADE,
    employee_id    INT NOT NULL REFERENCES employee(employee_id) ON DELETE CASCADE,
    start_time     TIMESTAMP NOT NULL,
    end_time       TIMESTAMP,
    total_hours    DECIMAL(5,2) GENERATED ALWAYS AS 
                   (EXTRACT(EPOCH FROM (COALESCE(end_time, now()) - start_time)) / 3600) STORED
);
