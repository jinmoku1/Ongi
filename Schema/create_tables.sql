
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
    helperId varchar(250) not null,
    helpeeId varchar(250) not null,
    primary key (helperId, helpeeId),
    foreign key (helperId) references users(userId) on delete cascade
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

create table userUsage (
  id int auto_increment primary key not null,
  uid varchar(250),
  `timestamp` timestamp default CURRENT_TIMESTAMP,
  voltage int,
  `current` int,
  activePower int,
  apparentPower int,
  reactivePower int,
  powerFactor int,
  wattHour int,
  powerBase int,
  index(uid)
);
