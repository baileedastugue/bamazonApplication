drop database if exists bamazon;
create database bamazon;
use bamazon;

drop table if exists products;

create table products (
    item_id INT auto_increment NOT NULL,
    product_name VARCHAR(60) NOT NULL,
    department_name VARCHAR(30) not null,
    price decimal (10,2) not null,
    stock_quantity int (10) not null,
    product_sales DECIMAL(20, 2) DEFAULT 0,
    primary key(item_id)
);

select * from products;

update products set product_sales=(price*stock_quantity);
insert into products (
product_name,
    department_name,
    price,
    stock_quantity)
values
    ("apple", "grocery", 1.4, 15),
    ("barbells", "health, beauty, & fitness", 25, 8),
    ("sticky notes", "electronics & office", 5, 10),
    ("stapler", "electronics & office", 13.49, 26),
    ("airpods", "electronics & office", 150, 20),
    ("coffee", "grocery", 11.99, 30),
    ("toothpaste", "pharmacy", 6.35, 30),
    ("Gain detergent", "household & cleaning", 27.99, 50),
    ("mouthwash", "health, beauty, & fitness", 6.50, 10),
    ("women's socks", "clothing", 12.99, 20),
    ("almond milk", "grocery", 3.99, 12),
    ("diapers", "baby", 24.55, 20),
    ("underbed storage", "home & patio", 23.99, 8),
    ("scented candle", "home & patio", 20.15, 100);

SET SQL_SAFE_UPDATES = 0;
drop table if exists departments;

create table departments (
    department_id int(5) not null auto_increment,
    department_name varchar(30) not null,
    overhead_costs decimal(10, 2) not null,
    primary key (department_id)
);

insert into departments (
department_name,
    overhead_costs)
values
("clothing", 2000),
    ("baby", 1500),
    ("grocery", 6000),
    ("health, beauty, & fitness", 3750),
    ("home & patio", 9000),
    ("electronics & office", 800),
    ("pharmacy", 1460),
    ("household & cleaning", 1100);