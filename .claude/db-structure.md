# 사용자/인증

CREATE TABLE user (
id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
email VARCHAR(255) UNIQUE,
nickname VARCHAR(60),
phone_number VARCHAR(20) UNIQUE, -- +821012345678
profile_image_url VARCHAR(255), -- S3 URL
is_phone_verified TINYINT(1) NOT NULL DEFAULT 0,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 소셜 계정(구글만 먼저)
CREATE TABLE auth_provider (
id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
user_id BIGINT UNSIGNED NOT NULL,
provider ENUM('google','kakao','naver') NOT NULL,
provider_user_id VARCHAR(191) NOT NULL, -- sub/subject
email VARCHAR(255),
raw_profile_json JSON,
linked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
UNIQUE KEY uq_provider_user (provider, provider_user_id),
KEY idx_auth_user (user_id),
CONSTRAINT fk_auth_user FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 문자 인증(최근 요청 하나만 검증해도 됨)
CREATE TABLE phone_verification (
id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
phone_e164 VARCHAR(20) NOT NULL,
code6 CHAR(6) NOT NULL,
expires_at DATETIME NOT NULL,
verified_at DATETIME NULL,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
KEY idx_phone (phone_e164),
KEY idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 배송지
CREATE TABLE address (
id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
user_id BIGINT UNSIGNED NOT NULL,
recipient_name VARCHAR(60) NOT NULL,
phone_e164 VARCHAR(20) NOT NULL,
postcode VARCHAR(10),
address1 VARCHAR(255) NOT NULL,
address2 VARCHAR(255),
is_default TINYINT(1) NOT NULL DEFAULT 0,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
KEY idx_addr_user (user_id),
CONSTRAINT fk_addr_user FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 결제수단(토큰/키는 PG에 있고 우리는 식별자만 저장)
CREATE TABLE payment_method (
id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
user_id BIGINT UNSIGNED NOT NULL,
provider ENUM('tosspay','card','naverpay','kakaopay','virtual') NOT NULL,
external_key VARCHAR(191) NOT NULL, -- PG에서 발급한 customer/payment key
masked_info VARCHAR(191), -- \***\*-\*\***-1234 등
is_default TINYINT(1) NOT NULL DEFAULT 0,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
UNIQUE KEY uq_user_external (user_id, provider, external_key),
KEY idx_pm_user (user_id),
CONSTRAINT fk_pm_user FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

# 팝업스토어/상품/분류

CREATE TABLE popup_store (
id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(120) NOT NULL,
description TEXT,
banner_image_url TEXT,
starts_at DATETIME,
ends_at DATETIME,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE tag (
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(60) NOT NULL UNIQUE -- 예: 텀블러, 원두 ...
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE product (
id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
popup_store_id BIGINT UNSIGNED NOT NULL,
category VARCHAR(50) NOT NULL,
name VARCHAR(200) NOT NULL,
summary VARCHAR(500),
description MEDIUMTEXT, -- 상세설명(배송안내/교환반품 포함 가능)
material VARCHAR(120), -- 재질
place_of_use VARCHAR(120), -- 사용위치
width_cm DECIMAL(6,2), -- 50.00
height_cm DECIMAL(6,2), -- 100.00
tolerance_cm DECIMAL(5,2), -- 1.00
edition_info VARCHAR(120), -- 에디션 정보
condition_note VARCHAR(255), -- 상품 상태 요약
price DECIMAL(12,2) NOT NULL, -- 즉시 구매용 정가(경매와 별개로 표시 가능)
stock INT NOT NULL DEFAULT 0,
shipping_base_fee INT NOT NULL DEFAULT 2500,
shipping_free_threshold INT DEFAULT 30000,
shipping_extra_note TEXT, -- 제주/도서산간 등 추가비용 설명
courier_name VARCHAR(60) DEFAULT 'CJ대한통운',
is_active TINYINT(1) NOT NULL DEFAULT 1,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
KEY idx_prod_store (popup_store_id),
FULLTEXT KEY ft_prod_name_desc (name, summary, description),
CONSTRAINT fk_prod_store FOREIGN KEY (popup_store_id) REFERENCES popup_store(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE product_image (
id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
product_id BIGINT UNSIGNED NOT NULL,
image_url TEXT NOT NULL,
sort_order INT NOT NULL DEFAULT 0,
CONSTRAINT fk_pimg_prod FOREIGN KEY (product_id) REFERENCES product(id),
KEY idx_pimg_prod (product_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE product_tag (
product_id BIGINT UNSIGNED NOT NULL,
tag_id INT UNSIGNED NOT NULL,
PRIMARY KEY (product_id, tag_id),
CONSTRAINT fk_ptag_prod FOREIGN KEY (product_id) REFERENCES product(id),
CONSTRAINT fk_ptag_tag FOREIGN KEY (tag_id) REFERENCES tag(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

# 경매

-- 상품당 1개의 경매(MVP). 필요 시 UNIQUE(product_id)로 강제.
CREATE TABLE auction (
id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
product_id BIGINT UNSIGNED NOT NULL UNIQUE,
start_price DECIMAL(12,2) NOT NULL, -- 시작가
min_bid_price DECIMAL(12,2) NOT NULL, -- 최초 입찰 최소 금액(또는 최소 인상폭 개념으로 변형 가능)
buy_now_price DECIMAL(12,2) NULL, -- 즉시 구매가(없으면 NULL)
deposit_amount DECIMAL(12,2) NOT NULL DEFAULT 0, -- 예약금
starts_at DATETIME NOT NULL,
ends_at DATETIME NOT NULL,
status ENUM('scheduled','running','ended','cancelled') NOT NULL DEFAULT 'scheduled',
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT fk_auc_prod FOREIGN KEY (product_id) REFERENCES product(id),
KEY idx_auc_time (starts_at, ends_at),
KEY idx_auc_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 예약금 결제 기록(입찰 전 필수)
CREATE TABLE auction_deposit (
id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
auction_id BIGINT UNSIGNED NOT NULL,
user_id BIGINT UNSIGNED NOT NULL,
payment_id BIGINT UNSIGNED NULL, -- 실제 payment 레코드 참조(성공시)
amount DECIMAL(12,2) NOT NULL,
status ENUM('PENDING','PAID','REFUNDED','FAILED') NOT NULL DEFAULT 'PENDING',
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
UNIQUE KEY uq_deposit_user_auction (auction_id, user_id),
KEY idx_ad_auction (auction_id),
KEY idx_ad_user (user_id),
CONSTRAINT fk_ad_auction FOREIGN KEY (auction_id) REFERENCES auction(id),
CONSTRAINT fk_ad_user FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 입찰 로그
CREATE TABLE bid (
id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
auction_id BIGINT UNSIGNED NOT NULL,
user_id BIGINT UNSIGNED NOT NULL,
bid_order INT NOT NULL COMMENT '입찰 순서',
amount DECIMAL(12,2) NOT NULL,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
KEY idx_bid_auc_time (auction_id, created_at),
KEY idx_bid_auc_amount (auction_id, amount DESC),
KEY idx_bid_user (user_id),
CONSTRAINT fk_bid_auction FOREIGN KEY (auction_id) REFERENCES auction(id),
CONSTRAINT fk_bid_user FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

# Auction Offer 테이블

CREATE TABLE auction_offer (
id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
auction_id BIGINT UNSIGNED NOT NULL,
bid_id BIGINT UNSIGNED NOT NULL,
user_id BIGINT UNSIGNED NOT NULL,
rank_order INT NOT NULL, -- 1등, 2등 …
status VARCHAR(30) NOT NULL, -- 'offered, pending, cancel',
offered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
expires_at DATETIME NOT NULL, -- 24시간 제한
order_id BIGINT UNSIGNED NULL, -- 주문 성공시 연결
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
UNIQUE KEY uq_auc_rank (auction_id, rank_order), -- 한 순위에 오퍼는 하나
KEY idx_offer_active (auction_id, status, expires_at),
CONSTRAINT fk_ao_auction FOREIGN KEY (auction_id) REFERENCES auction(id),
CONSTRAINT fk_ao_bid FOREIGN KEY (bid_id) REFERENCES bid(id),
CONSTRAINT fk_ao_user FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

# 주문/결제/배송

-- 주문 (멀티 아이템 지원)
CREATE TABLE `order` (
id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
user_id BIGINT UNSIGNED NOT NULL,
address_id BIGINT UNSIGNED NULL, -- 당시 배송지 스냅샷 별도 컬럼으로 보관 권장(여긴 참조만)
status ENUM('pending','paid','cancelled','shipped','delivered','refunded') NOT NULL DEFAULT 'pending',
total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
shipping_fee DECIMAL(12,2) NOT NULL DEFAULT 0,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
KEY idx_order_user (user_id),
KEY idx_order_status (status),
CONSTRAINT fk_order_user FOREIGN KEY (user_id) REFERENCES user(id),
CONSTRAINT fk_order_addr FOREIGN KEY (address_id) REFERENCES address(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 주문 품목
CREATE TABLE order_item (
id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
order_id BIGINT UNSIGNED NOT NULL,
product_id BIGINT UNSIGNED NOT NULL,
quantity INT NOT NULL DEFAULT 1,
unit_price DECIMAL(12,2) NOT NULL, -- 주문 시점 스냅샷 가격
subtotal_amount DECIMAL(12,2) NOT NULL, -- unit_price \* quantity
KEY idx_oi_order (order_id),
CONSTRAINT fk_oi_order FOREIGN KEY (order_id) REFERENCES `order`(id),
CONSTRAINT fk_oi_product FOREIGN KEY (product_id) REFERENCES product(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 결제
CREATE TABLE payment (
id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
order_id BIGINT UNSIGNED NULL, -- 경매 예약금 같은 단독결제는 NULL 가능
user_id BIGINT UNSIGNED NOT NULL,
provider VARCHAR(30) NOT NULL, -- 'tosspay','kakaopay','naverpay','card','virtual'
external_tid VARCHAR(191), -- PG 거래키
amount DECIMAL(12,2) NOT NULL,
status ENUM('PENDING','PAID','FAILED','REFUNDED','PARTIAL_REFUNDED') NOT NULL DEFAULT 'PENDING',
requested_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
paid_at DATETIME NULL,
fail_reason VARCHAR(255),
KEY idx_pay_order (order_id),
KEY idx_pay_user (user_id),
KEY idx_pay_status (status),
CONSTRAINT fk_pay_order FOREIGN KEY (order_id) REFERENCES `order`(id),
CONSTRAINT fk_pay_user FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 환불(부분 환불 지원)
CREATE TABLE payment_refund (
id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
payment_id BIGINT UNSIGNED NOT NULL,
amount DECIMAL(12,2) NOT NULL,
reason VARCHAR(255),
refunded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
CONSTRAINT fk_pref_payment FOREIGN KEY (payment_id) REFERENCES payment(id),
KEY idx_pref_payment (payment_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 배송
CREATE TABLE shipment (
id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
order_id BIGINT UNSIGNED NOT NULL,
courier_name VARCHAR(60) NOT NULL,
tracking_number VARCHAR(100) NOT NULL,
status ENUM('PREPARING','IN_TRANSIT','DELIVERED','RETURNED') NOT NULL DEFAULT 'PREPARING',
shipped_at DATETIME NULL,
delivered_at DATETIME NULL,
KEY idx_ship_order (order_id),
CONSTRAINT fk_ship_order FOREIGN KEY (order_id) REFERENCES `order`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

# 스토리 : 후기/일지

CREATE TABLE story (
id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
user_id BIGINT UNSIGNED NOT NULL, -- 작성자(구매자)
product_id BIGINT UNSIGNED NOT NULL,
title VARCHAR(200) NOT NULL,
content MEDIUMTEXT NOT NULL,
created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
KEY idx_story_user (user_id),
KEY idx_story_product (product_id),
CONSTRAINT fk_story_user FOREIGN KEY (user_id) REFERENCES user(id),
CONSTRAINT fk_story_product FOREIGN KEY (product_id) REFERENCES product(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE story_image (
id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
story_id BIGINT UNSIGNED NOT NULL,
image_url TEXT NOT NULL,
sort_order INT NOT NULL DEFAULT 0,
CONSTRAINT fk_simg_story FOREIGN KEY (story_id) REFERENCES story(id),
KEY idx_simg_story (story_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE notification (
id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
user_id BIGINT UNSIGNED NULL, -- 일부 시스템 발송은 NULL 가능
channel ENUM('EMAIL','SMS','PUSH') NOT NULL,
template_code VARCHAR(80) NULL,
title VARCHAR(200) NULL,
body TEXT,
metadata_json JSON,
sent_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
status ENUM('QUEUED','SENT','FAILED') NOT NULL DEFAULT 'SENT',
KEY idx_notif_user (user_id, sent_at),
CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
