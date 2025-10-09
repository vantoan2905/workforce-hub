
CREATE TABLE employee (
    employeeId    SERIAL PRIMARY KEY,                
    username       VARCHAR(150) UNIQUE NOT NULL,
    password       VARCHAR(255) NOT NULL,             -- HASH (bcrypt/argon2)
    email          VARCHAR(255) UNIQUE NOT NULL,
    phoneNumber   VARCHAR(20),
    firstName     VARCHAR(100),
    lastName      VARCHAR(100),
    address        TEXT,
    dateOfBirth  DATE,
    cardId       VARCHAR(50),
    isActive      BOOLEAN DEFAULT true,
    isDeleted     BOOLEAN DEFAULT false,
    role           VARCHAR(50) DEFAULT 'employee' CHECK (role IN ('employee','manager', 'admin')),
    createdAt     TIMESTAMP DEFAULT now(),
    updatedAt     TIMESTAMP DEFAULT now()
);
CREATE TABLE auth (
    authId        SERIAL PRIMARY KEY,
    employeeId    INT UNIQUE NOT NULL REFERENCES employee(employeeId) ON DELETE CASCADE,
    refreshToken  TEXT,
    createdAt     TIMESTAMP DEFAULT now(),
    updatedAt     TIMESTAMP DEFAULT now()
);

CREATE TABLE roles (
    roleId        SERIAL PRIMARY KEY,
    roleName      VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE employeeRoles (
    employeeId    INT NOT NULL REFERENCES employee(employeeId) ON DELETE CASCADE,
    roleId        INT NOT NULL REFERENCES roles(roleId) ON DELETE CASCADE,
    PRIMARY KEY (employeeId, roleId)
);


CREATE TABLE tasks (
    taskId        SERIAL PRIMARY KEY,
    nameTask      VARCHAR(255) NOT NULL,
    status         VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','inProgress','done')),
    priority       VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
    createdBy     INT REFERENCES employee(employeeId),
    createdAt     TIMESTAMP DEFAULT now(),
    updatedAt     TIMESTAMP DEFAULT now()
);


CREATE TABLE employeeTasks (
    employeeId    INT NOT NULL REFERENCES employee(employeeId) ON DELETE CASCADE,
    taskId        INT NOT NULL REFERENCES tasks(taskId) ON DELETE CASCADE,
    PRIMARY KEY (employeeId, taskId)
);


CREATE TABLE taskUpdateHistory (
    updateId      SERIAL PRIMARY KEY,
    taskId        INT NOT NULL REFERENCES tasks(taskId) ON DELETE CASCADE,
    fieldName     VARCHAR(100),                      
    oldValue      TEXT,
    newValue      TEXT,
    updatedBy     INT REFERENCES employee(employeeId),
    updatedAt     TIMESTAMP DEFAULT now()
);


CREATE TABLE taskDescriptions (
    descriptionId SERIAL PRIMARY KEY,
    taskId        INT NOT NULL REFERENCES tasks(taskId) ON DELETE CASCADE,
    description    TEXT,
    createdBy     INT REFERENCES employee(employeeId),
    createdAt     TIMESTAMP DEFAULT now()
);

CREATE TABLE checked (
    checkedId     SERIAL PRIMARY KEY,
    employeeId    INT NOT NULL REFERENCES employee(employeeId) ON DELETE CASCADE,
    checkDate     DATE NOT NULL,
    checkIn       TIMESTAMP,
    checkOut      TIMESTAMP,
    status         VARCHAR(50) DEFAULT 'present' CHECK (status IN ('present','late','absent'))
);


CREATE TABLE timekeeping (
    timekeepingId SERIAL PRIMARY KEY,
    taskId        INT NOT NULL REFERENCES tasks(taskId) ON DELETE CASCADE,
    employeeId    INT NOT NULL REFERENCES employee(employeeId) ON DELETE CASCADE,
    startTime     TIMESTAMP NOT NULL,
    endTime       TIMESTAMP,
    totalHours    DECIMAL(5,2) GENERATED ALWAYS AS 
                   (EXTRACT(EPOCH FROM (COALESCE(endTime, now()) - startTime)) / 3600) STORED
);

CREATE TABLE blackList (
    blackListId  SERIAL PRIMARY KEY,
    employeeId    INT NOT NULL REFERENCES employee(employeeId) ON DELETE CASCADE,
    token         TEXT,
    createdAt     TIMESTAMP DEFAULT now(),
    updatedAt     TIMESTAMP DEFAULT now()
);