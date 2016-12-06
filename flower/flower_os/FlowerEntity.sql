-- 用户登录表
-- drop table e_user;  
-- mysql:create table e_user(username varchar(20) primary key, password varchar(20));
create table e_user(username varchar2(20) primary key, password varchar2(20));
insert into e_user values('liubei', '123');
select * from e_user;

select * from t_branch;