insert into e_user values('liubei', '123');
commit;

--drop table e_user;

create table e_user(username varchar(20) primary key, password varchar(20));

select * from e_user;

user coco;--使用某个数据库