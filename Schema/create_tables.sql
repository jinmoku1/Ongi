
create table users (
    userId varchar(250) primary key not null,
    nickName varchar(250),
    email varchar(250),
    phone varchar(30),
    meteringDay double,
    maxLimitUsageBill double,
    userType ENUM('N', 'O'),
    unique(email),
    unique(phone)
);

create table relations (
    helper_id varchar(250) not null,
    helpee_id varchar(250) not null,
    primary key (helper_id, helpee_id),
    foreign key (helper_id) references users(userId) on delete cascade
);

create table receiver_list (
    userId varchar(250) primary key not null,
    last_time_received timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    total_amount_received double,
    foreign key (userId) references users(userId) on delete cascade
);

create table donor_list (
    userId varchar(250) primary key not null,
    last_time_donated timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    total_amount_donated double,
    foreign key (userId) references users(userId) on delete cascade
);

create table donation_list (
    userIdFrom varchar(250) not null,
    userIdTo varchar(250) not null,
    amount double not null,
    id int primary key not null auto_increment,
    time_donated timestamp DEFAULT CURRENT_TIMESTAMP,
    index(userIdFrom),
    index(userIdTo)
);

create table userAuthCode (
    userId varchar(250) primary key not null,
    accessToken varchar(250) not null,
    deviceId varchar(250) not null
);



