insert into e_user values('liubei', '123');


--drop table e_user;  

create table e_user(username varchar(20) primary key, password varchar(20));
--create table e_user(username varchar2(20) primary key, password varchar2(20));
select * from e_user;

select * from t_user u;

--user coco;--使用某个数据库


select * from t_department where supDepartMentCostCode != departMentCostCode;

select * from t_branch 

----------------财务运营部-----------------

select supDepartMentCostCode from t_department where departMentCostCode = '1000020100';

select * from t_department where departMentCostCode = '1000020000';

select * from t_department where len(departMentCostCode) >= 10 and enablestate != 0;

select * from t_user u where username = 'Belinda.Gao';

