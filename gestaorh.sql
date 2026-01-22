create table client (
id VARCHAR(100) PRIMARY KEY,
tenantId VARCHAR(100),
code INT NOT NULL AUTO_INCREMENT,
nickname VARCHAR(100),
companyName VARCHAR(300),
cnpj VARCHAR(100),
UNIQUE KEY uk_code_tenantId (code, tenantId)
);

create table service (
id VARCHAR(100) PRIMARY KEY,
tenant_id VARCHAR(100),
name VARCHAR(100),
code VARCHAR(100),
default_price DECIMAL(10, 2),
UNIQUE KEY uk_service_code_tenant (code, tenant_id)
);

CREATE TABLE `user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(300) NOT NULL,
  `role` ENUM('ADMIN', 'EMPLOYEE', 'FINANCE') DEFAULT 'EMPLOYEE',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_email` (`email`)
);
create table contract (
id VARCHAR(100) PRIMARY KEY,
tenant_id VARCHAR(100),
contract_code VARCHAR(100),
client_id VARCHAR(100),
service_id VARCHAR(100),
quantity INT,
unit_price DECIMAL(10, 2),
start_date DATE,
end_date DATE,
status ENUM('ACTIVE', 'INACTIVE', 'PENDING'),
observation	TEXT,
FOREIGN KEY (client_id) REFERENCES client(id),
FOREIGN KEY (service_id) REFERENCES service(id),
UNIQUE KEY uk_contract_code_tenant (contract_code, tenant_id)
);