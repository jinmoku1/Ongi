

create table users (
    uid varchar(250) primary key not null,
    nickName varchar(250) not null,
    email varchar(250) not null,
    phone varchar(30) not null,
    meteringDay double not null,
    maxLimitUsageBill double not null,
    userType ENUM('N', 'O')
)

create table receiver_list (
    uid varchar(250) primary key not null,
    last_time_received timestamp default now(),
    total_amount_received double,
    foreign key (uid) references users(uid) on delete cascade
)

create table donation_list (
    uidFrom varchar(250) not null,
    uidTo varchar(250) not null,
    amount double not null,
    id int primary key not null,
    index(uidFrom),
    index(uidTo)
)

create table userAuthCode (
  authCode varchar(250) not null,
  accessToken varchar(250) not null,
  nickName varchar(250) not null,
  identification varchar(250) not null
)
