-- 모든 데이타베이스 조회
show databases;

-- 유저생성
CREATE USER 'kds'@'%' identified by 'kds';
GRANT ALL PRIVILEGES ON report.* TO 'kds'@'%';

-- DB 선택
use report;

-- User 테이블 생성
CREATE TABLE USER
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    branch_name VARCHAR(255) NOT NULL,
    login_id VARCHAR(255) NOT NULL,
    login_pwd VARCHAR(255) NOT NULL
);

-- Menu 테이블 생성
CREATE TABLE Menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    menu_name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    FOREIGN KEY (user_id)
    REFERENCES USER(id) ON UPDATE CASCADE
);

-- Image 테이블 생성
CREATE TABLE Image (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    file_path VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    orig_file_name VARCHAR(255) NOT NULL
);


-- DataSales 테이블 생성
CREATE TABLE DateSales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    date DATE,
    count INT,
    total_revenue Int,
    FOREIGN KEY (user_id)
    REFERENCES USER(id) ON UPDATE CASCADE
);

-- Weight(가중치) 테이블 생성
CREATE TABLE Weight (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    date DATE NOT NULL,
    next_weight DECIMAL(5,2) NOT NULL,
    predict_revenue BIGINT NOT NULL,
    FOREIGN KEY (user_id)
    REFERENCES USER(id) ON UPDATE CASCADE
);


-- MenuSales 테이블 생성
CREATE TABLE MenuSales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    menu_id INT,
    date DATE,
    count INT,
    FOREIGN KEY (user_id)
    REFERENCES USER(id) ON UPDATE CASCADE,
    FOREIGN KEY (menu_id)
    REFERENCES Menu(id) ON UPDATE CASCADE
);

commit;