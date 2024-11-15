--
-- PostgreSQL database dump
--

-- Dumped from database version 16.3
-- Dumped by pg_dump version 16.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts (
    email character varying NOT NULL,
    username character varying(50) NOT NULL,
    name character varying(254),
    password character varying(64) NOT NULL,
    phone_id integer,
    address_id integer,
    google_id character varying
);


ALTER TABLE public.accounts OWNER TO postgres;

--
-- Name: accounts_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accounts_orders (
    account_email character varying,
    order_id integer
);


ALTER TABLE public.accounts_orders OWNER TO postgres;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.addresses (
    id integer NOT NULL,
    street_name character varying(75),
    street_number character varying(25),
    city_id integer
);


ALTER TABLE public.addresses OWNER TO postgres;

--
-- Name: addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.addresses_id_seq OWNER TO postgres;

--
-- Name: addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.addresses_id_seq OWNED BY public.addresses.id;


--
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    account_email character varying NOT NULL
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admins_id_seq OWNER TO postgres;

--
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- Name: attribute_values; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attribute_values (
    id integer NOT NULL,
    attribute_id integer,
    value character varying(100) NOT NULL
);


ALTER TABLE public.attribute_values OWNER TO postgres;

--
-- Name: attribute_values_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attribute_values_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attribute_values_id_seq OWNER TO postgres;

--
-- Name: attribute_values_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attribute_values_id_seq OWNED BY public.attribute_values.id;


--
-- Name: attributes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.attributes (
    id integer NOT NULL,
    attribute_name character varying(100) NOT NULL
);


ALTER TABLE public.attributes OWNER TO postgres;

--
-- Name: attributes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.attributes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.attributes_id_seq OWNER TO postgres;

--
-- Name: attributes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.attributes_id_seq OWNED BY public.attributes.id;


--
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    id integer NOT NULL,
    account_email character varying NOT NULL
);


ALTER TABLE public.carts OWNER TO postgres;

--
-- Name: carts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carts_id_seq OWNER TO postgres;

--
-- Name: carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carts_id_seq OWNED BY public.carts.id;


--
-- Name: carts_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts_products (
    product_id integer NOT NULL,
    cart_id integer NOT NULL,
    quantity integer NOT NULL,
    variant_attribute_value_id integer,
    id integer NOT NULL
);


ALTER TABLE public.carts_products OWNER TO postgres;

--
-- Name: carts_products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carts_products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carts_products_id_seq OWNER TO postgres;

--
-- Name: carts_products_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.carts_products_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.carts_products_id_seq1 OWNER TO postgres;

--
-- Name: carts_products_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.carts_products_id_seq1 OWNED BY public.carts_products.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name character varying(25),
    description character varying(150)
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: cities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cities (
    id integer NOT NULL,
    name character varying(150),
    state_id integer
);


ALTER TABLE public.cities OWNER TO postgres;

--
-- Name: cities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cities_id_seq OWNER TO postgres;

--
-- Name: cities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cities_id_seq OWNED BY public.cities.id;


--
-- Name: discounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.discounts (
    id integer NOT NULL,
    code character varying(16),
    percent_off numeric,
    expire_date date,
    quantity integer
);


ALTER TABLE public.discounts OWNER TO postgres;

--
-- Name: discounts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.discounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.discounts_id_seq OWNER TO postgres;

--
-- Name: discounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.discounts_id_seq OWNED BY public.discounts.id;


--
-- Name: heros; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.heros (
    id integer NOT NULL,
    category_id integer,
    product_id integer,
    layout integer,
    heading character varying,
    sub_title_1 character varying,
    sub_title_2 character varying,
    background_color character varying,
    text_color character varying
);


ALTER TABLE public.heros OWNER TO postgres;

--
-- Name: heros_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.heros_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.heros_id_seq OWNER TO postgres;

--
-- Name: heros_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.heros_id_seq OWNED BY public.heros.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    status character varying(25),
    discount_id integer,
    date date
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: orders_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders_products (
    product_id integer,
    order_id integer,
    quantity integer,
    price_at_order numeric(10,2)
);


ALTER TABLE public.orders_products OWNER TO postgres;

--
-- Name: payment_token; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment_token (
    id integer NOT NULL,
    email character varying,
    token character varying
);


ALTER TABLE public.payment_token OWNER TO postgres;

--
-- Name: payment_token_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_token_id_seq OWNER TO postgres;

--
-- Name: payment_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_token_id_seq OWNED BY public.payment_token.id;


--
-- Name: phones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.phones (
    id integer NOT NULL,
    number character varying(10)
);


ALTER TABLE public.phones OWNER TO postgres;

--
-- Name: phones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.phones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.phones_id_seq OWNER TO postgres;

--
-- Name: phones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.phones_id_seq OWNED BY public.phones.id;


--
-- Name: product_variants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variants (
    id integer NOT NULL,
    product_id integer,
    price money NOT NULL,
    stock_quantity integer NOT NULL
);


ALTER TABLE public.product_variants OWNER TO postgres;

--
-- Name: product_variants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_variants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_variants_id_seq OWNER TO postgres;

--
-- Name: product_variants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_variants_id_seq OWNED BY public.product_variants.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    barcode character varying(20),
    name character varying(100),
    description character varying(254),
    price money,
    stock_quantity integer,
    brand character varying(100),
    weight numeric,
    weight_units character varying(5)
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products_categories (
    product_id integer,
    category_id integer
);


ALTER TABLE public.products_categories OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: reset_password_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reset_password_codes (
    id integer NOT NULL,
    reset_code integer,
    expire_time date,
    email character varying
);


ALTER TABLE public.reset_password_codes OWNER TO postgres;

--
-- Name: reset_password_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reset_password_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reset_password_codes_id_seq OWNER TO postgres;

--
-- Name: reset_password_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reset_password_codes_id_seq OWNED BY public.reset_password_codes.id;


--
-- Name: states; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.states (
    id integer NOT NULL,
    name character varying(150)
);


ALTER TABLE public.states OWNER TO postgres;

--
-- Name: states_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.states_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.states_id_seq OWNER TO postgres;

--
-- Name: states_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.states_id_seq OWNED BY public.states.id;


--
-- Name: variant_attribute_values; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.variant_attribute_values (
    id integer NOT NULL,
    product_variant_id integer NOT NULL,
    attribute_value_1_id integer NOT NULL,
    attribute_value_2_id integer,
    attribute_value_3_id integer,
    attribute_value_4_id integer,
    attribute_value_5_id integer
);


ALTER TABLE public.variant_attribute_values OWNER TO postgres;

--
-- Name: variant_attribute_values_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.variant_attribute_values_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.variant_attribute_values_id_seq OWNER TO postgres;

--
-- Name: variant_attribute_values_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.variant_attribute_values_id_seq OWNED BY public.variant_attribute_values.id;


--
-- Name: addresses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses ALTER COLUMN id SET DEFAULT nextval('public.addresses_id_seq'::regclass);


--
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- Name: attribute_values id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attribute_values ALTER COLUMN id SET DEFAULT nextval('public.attribute_values_id_seq'::regclass);


--
-- Name: attributes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attributes ALTER COLUMN id SET DEFAULT nextval('public.attributes_id_seq'::regclass);


--
-- Name: carts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts ALTER COLUMN id SET DEFAULT nextval('public.carts_id_seq'::regclass);


--
-- Name: carts_products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts_products ALTER COLUMN id SET DEFAULT nextval('public.carts_products_id_seq1'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: cities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cities ALTER COLUMN id SET DEFAULT nextval('public.cities_id_seq'::regclass);


--
-- Name: discounts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discounts ALTER COLUMN id SET DEFAULT nextval('public.discounts_id_seq'::regclass);


--
-- Name: heros id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heros ALTER COLUMN id SET DEFAULT nextval('public.heros_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: payment_token id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_token ALTER COLUMN id SET DEFAULT nextval('public.payment_token_id_seq'::regclass);


--
-- Name: phones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phones ALTER COLUMN id SET DEFAULT nextval('public.phones_id_seq'::regclass);


--
-- Name: product_variants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants ALTER COLUMN id SET DEFAULT nextval('public.product_variants_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: reset_password_codes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reset_password_codes ALTER COLUMN id SET DEFAULT nextval('public.reset_password_codes_id_seq'::regclass);


--
-- Name: states id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.states ALTER COLUMN id SET DEFAULT nextval('public.states_id_seq'::regclass);


--
-- Name: variant_attribute_values id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variant_attribute_values ALTER COLUMN id SET DEFAULT nextval('public.variant_attribute_values_id_seq'::regclass);


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounts (email, username, name, password, phone_id, address_id, google_id) FROM stdin;
test@email.com	testName	\N	$2b$15$/vcPvjHFVQLWHXziAvowb.XQB3AKcNC5mCjaPZdRp6AbUKVL4OZ4O	\N	\N	\N
admin@email.com	adminTest	\N	$2b$15$1ZActIZDg3TJPuXoEb64Ku0Wyc0W9LH/6p9XOF.JzdkSA4Y.g/Sn6	\N	\N	\N
test2@email.com	testName2	\N	$2b$15$O9RiXvvMDEL1KFCifdO19OTJzPu2OzgUs7kZh8XaMlk/yUYT.r1PG	\N	\N	\N
\.


--
-- Data for Name: accounts_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.accounts_orders (account_email, order_id) FROM stdin;
\.


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.addresses (id, street_name, street_number, city_id) FROM stdin;
\.


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (id, account_email) FROM stdin;
1	admin@email.com
\.


--
-- Data for Name: attribute_values; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attribute_values (id, attribute_id, value) FROM stdin;
1	1	S
2	1	M
3	1	L
4	2	Red
5	2	White
6	2	Blue
\.


--
-- Data for Name: attributes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.attributes (id, attribute_name) FROM stdin;
1	Size
2	Color
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts (id, account_email) FROM stdin;
2	test@email.com
5	test2@email.com
\.


--
-- Data for Name: carts_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts_products (product_id, cart_id, quantity, variant_attribute_value_id, id) FROM stdin;
1	2	3	17	1
2	2	1	\N	2
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, description) FROM stdin;
1	Shirts	Shirts descriptions
2	Pants	Pants descriptions
3	Dresses	Dresses descriptions
4	Cooking	Cooking descriptions
5	Camping	Camping descriptions
6	Cars	Cars descriptions
7	Games	Games descriptions
8	Board Games	Board Games descriptions
\.


--
-- Data for Name: cities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cities (id, name, state_id) FROM stdin;
\.


--
-- Data for Name: discounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.discounts (id, code, percent_off, expire_date, quantity) FROM stdin;
\.


--
-- Data for Name: heros; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.heros (id, category_id, product_id, layout, heading, sub_title_1, sub_title_2, background_color, text_color) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, status, discount_id, date) FROM stdin;
\.


--
-- Data for Name: orders_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders_products (product_id, order_id, quantity, price_at_order) FROM stdin;
\.


--
-- Data for Name: payment_token; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payment_token (id, email, token) FROM stdin;
\.


--
-- Data for Name: phones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.phones (id, number) FROM stdin;
\.


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variants (id, product_id, price, stock_quantity) FROM stdin;
1	1	$19.99	2
2	1	$19.99	3
5	1	$21.99	80
7	1	$23.99	60
6	1	$21.99	13
8	1	$23.99	49
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, barcode, name, description, price, stock_quantity, brand, weight, weight_units) FROM stdin;
1	123456789123	Cotton T-shit	A loose fitting cotton t-shirt.	\N	\N	\N	\N	\N
2	52141525	Running Shoes	A pair of running shoes to make you feet feel great!	$45.99	30	\N	\N	\N
\.


--
-- Data for Name: products_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products_categories (product_id, category_id) FROM stdin;
\.


--
-- Data for Name: reset_password_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reset_password_codes (id, reset_code, expire_time, email) FROM stdin;
\.


--
-- Data for Name: states; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.states (id, name) FROM stdin;
1	AL
2	AK
3	AZ
4	AR
5	CA
6	CO
7	CT
8	DE
9	FL
10	GA
11	HI
12	ID
13	IL
14	IN
15	IA
16	KS
17	KY
18	LA
19	ME
20	MD
21	MA
22	MI
23	MN
24	MS
25	MO
26	MT
27	NE
28	NV
29	NH
30	NJ
31	NM
32	NY
33	NC
34	ND
35	OH
36	OK
37	OR
38	PA
39	RI
40	SC
41	SD
42	TN
43	TX
44	UT
45	VT
46	VA
47	WA
48	WV
49	WI
50	WY
\.


--
-- Data for Name: variant_attribute_values; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.variant_attribute_values (id, product_variant_id, attribute_value_1_id, attribute_value_2_id, attribute_value_3_id, attribute_value_4_id, attribute_value_5_id) FROM stdin;
17	1	1	4	\N	\N	\N
18	2	1	5	\N	\N	\N
20	5	2	4	\N	\N	\N
21	6	2	5	\N	\N	\N
22	7	3	4	\N	\N	\N
23	7	3	5	\N	\N	\N
\.


--
-- Name: addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.addresses_id_seq', 1, false);


--
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_id_seq', 1, true);


--
-- Name: attribute_values_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attribute_values_id_seq', 6, true);


--
-- Name: attributes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.attributes_id_seq', 6, true);


--
-- Name: carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carts_id_seq', 6, true);


--
-- Name: carts_products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carts_products_id_seq', 2, true);


--
-- Name: carts_products_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.carts_products_id_seq1', 3, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 24, true);


--
-- Name: cities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cities_id_seq', 1, false);


--
-- Name: discounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.discounts_id_seq', 1, false);


--
-- Name: heros_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.heros_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: payment_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_token_id_seq', 1, false);


--
-- Name: phones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.phones_id_seq', 1, false);


--
-- Name: product_variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_variants_id_seq', 8, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 2, true);


--
-- Name: reset_password_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reset_password_codes_id_seq', 1, false);


--
-- Name: states_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.states_id_seq', 50, true);


--
-- Name: variant_attribute_values_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.variant_attribute_values_id_seq', 23, true);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (email);


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: attribute_values attribute_values_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attribute_values
    ADD CONSTRAINT attribute_values_pkey PRIMARY KEY (id);


--
-- Name: attributes attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attributes
    ADD CONSTRAINT attributes_pkey PRIMARY KEY (id);


--
-- Name: carts carts_email_uq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_email_uq UNIQUE (account_email);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: carts_products carts_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts_products
    ADD CONSTRAINT carts_products_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: cities cities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_pkey PRIMARY KEY (id);


--
-- Name: discounts discounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discounts
    ADD CONSTRAINT discounts_pkey PRIMARY KEY (id);


--
-- Name: heros heros_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heros
    ADD CONSTRAINT heros_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payment_token payment_token_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_token
    ADD CONSTRAINT payment_token_pkey PRIMARY KEY (id);


--
-- Name: phones phones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.phones
    ADD CONSTRAINT phones_pkey PRIMARY KEY (id);


--
-- Name: product_variants product_variants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: reset_password_codes reset_password_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reset_password_codes
    ADD CONSTRAINT reset_password_codes_pkey PRIMARY KEY (id);


--
-- Name: states states_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.states
    ADD CONSTRAINT states_pkey PRIMARY KEY (id);


--
-- Name: variant_attribute_values variant_attribute_values_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variant_attribute_values
    ADD CONSTRAINT variant_attribute_values_pkey PRIMARY KEY (id);


--
-- Name: idx_accounts_orders; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_accounts_orders ON public.accounts_orders USING btree (account_email, order_id);


--
-- Name: idx_orders_products; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_orders_products ON public.orders_products USING btree (product_id, order_id);


--
-- Name: idx_products_categories; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_categories ON public.products_categories USING btree (product_id, category_id);


--
-- Name: accounts accounts_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_address_id_fkey FOREIGN KEY (address_id) REFERENCES public.addresses(id);


--
-- Name: accounts_orders accounts_orders_account_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts_orders
    ADD CONSTRAINT accounts_orders_account_email_fkey FOREIGN KEY (account_email) REFERENCES public.accounts(email);


--
-- Name: accounts_orders accounts_orders_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts_orders
    ADD CONSTRAINT accounts_orders_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: accounts accounts_phone_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_phone_id_fkey FOREIGN KEY (phone_id) REFERENCES public.phones(id);


--
-- Name: addresses addresses_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id);


--
-- Name: admins admins_account_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_account_email_fkey FOREIGN KEY (account_email) REFERENCES public.accounts(email);


--
-- Name: attribute_values attribute_values_attribute_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.attribute_values
    ADD CONSTRAINT attribute_values_attribute_id_fkey FOREIGN KEY (attribute_id) REFERENCES public.attributes(id) ON DELETE CASCADE;


--
-- Name: carts carts_account_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_account_email_fkey FOREIGN KEY (account_email) REFERENCES public.accounts(email);


--
-- Name: carts_products carts_products_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts_products
    ADD CONSTRAINT carts_products_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id);


--
-- Name: carts_products carts_products_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts_products
    ADD CONSTRAINT carts_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: carts_products carts_products_variant_attribute_value_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts_products
    ADD CONSTRAINT carts_products_variant_attribute_value_id_fk FOREIGN KEY (variant_attribute_value_id) REFERENCES public.variant_attribute_values(id);


--
-- Name: cities cities_state_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cities
    ADD CONSTRAINT cities_state_id_fkey FOREIGN KEY (state_id) REFERENCES public.states(id);


--
-- Name: heros heros_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heros
    ADD CONSTRAINT heros_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: heros heros_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.heros
    ADD CONSTRAINT heros_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders orders_discount_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_discount_id_fkey FOREIGN KEY (discount_id) REFERENCES public.discounts(id);


--
-- Name: orders_products orders_products_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders_products
    ADD CONSTRAINT orders_products_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: orders_products orders_products_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders_products
    ADD CONSTRAINT orders_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: payment_token payment_token_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment_token
    ADD CONSTRAINT payment_token_email_fkey FOREIGN KEY (email) REFERENCES public.accounts(email);


--
-- Name: product_variants product_variants_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variants
    ADD CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products_categories products_categories_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_categories
    ADD CONSTRAINT products_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: products_categories products_categories_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_categories
    ADD CONSTRAINT products_categories_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: reset_password_codes reset_password_codes_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reset_password_codes
    ADD CONSTRAINT reset_password_codes_email_fkey FOREIGN KEY (email) REFERENCES public.accounts(email);


--
-- Name: variant_attribute_values variant_attribute_values_attribute_value_1_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variant_attribute_values
    ADD CONSTRAINT variant_attribute_values_attribute_value_1_id_fk FOREIGN KEY (attribute_value_1_id) REFERENCES public.attribute_values(id);


--
-- Name: variant_attribute_values variant_attribute_values_attribute_value_2_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variant_attribute_values
    ADD CONSTRAINT variant_attribute_values_attribute_value_2_id_fk FOREIGN KEY (attribute_value_2_id) REFERENCES public.attribute_values(id);


--
-- Name: variant_attribute_values variant_attribute_values_attribute_value_3_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variant_attribute_values
    ADD CONSTRAINT variant_attribute_values_attribute_value_3_id_fk FOREIGN KEY (attribute_value_3_id) REFERENCES public.attribute_values(id);


--
-- Name: variant_attribute_values variant_attribute_values_attribute_value_4_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variant_attribute_values
    ADD CONSTRAINT variant_attribute_values_attribute_value_4_id_fk FOREIGN KEY (attribute_value_4_id) REFERENCES public.attribute_values(id);


--
-- Name: variant_attribute_values variant_attribute_values_attribute_value_5_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variant_attribute_values
    ADD CONSTRAINT variant_attribute_values_attribute_value_5_id_fk FOREIGN KEY (attribute_value_5_id) REFERENCES public.attribute_values(id);


--
-- Name: variant_attribute_values variant_attribute_values_product_variant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.variant_attribute_values
    ADD CONSTRAINT variant_attribute_values_product_variant_id_fkey FOREIGN KEY (product_variant_id) REFERENCES public.product_variants(id);


--
-- Name: TABLE accounts; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.accounts TO standard_user;
GRANT ALL ON TABLE public.accounts TO admin_user;


--
-- Name: TABLE accounts_orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.accounts_orders TO standard_user;
GRANT ALL ON TABLE public.accounts_orders TO admin_user;


--
-- Name: TABLE addresses; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.addresses TO standard_user;
GRANT ALL ON TABLE public.addresses TO admin_user;


--
-- Name: SEQUENCE addresses_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.addresses_id_seq TO admin_user;


--
-- Name: TABLE admins; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.admins TO standard_user;
GRANT ALL ON TABLE public.admins TO admin_user;


--
-- Name: SEQUENCE admins_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.admins_id_seq TO admin_user;


--
-- Name: TABLE attribute_values; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.attribute_values TO standard_user;
GRANT ALL ON TABLE public.attribute_values TO admin_user;


--
-- Name: SEQUENCE attribute_values_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.attribute_values_id_seq TO admin_user;


--
-- Name: TABLE attributes; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.attributes TO standard_user;
GRANT ALL ON TABLE public.attributes TO admin_user;


--
-- Name: SEQUENCE attributes_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.attributes_id_seq TO admin_user;


--
-- Name: TABLE carts; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.carts TO standard_user;
GRANT ALL ON TABLE public.carts TO admin_user;


--
-- Name: SEQUENCE carts_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.carts_id_seq TO admin_user;


--
-- Name: TABLE carts_products; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.carts_products TO standard_user;
GRANT ALL ON TABLE public.carts_products TO admin_user;


--
-- Name: SEQUENCE carts_products_id_seq1; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.carts_products_id_seq1 TO admin_user;


--
-- Name: TABLE categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.categories TO standard_user;
GRANT ALL ON TABLE public.categories TO admin_user;


--
-- Name: SEQUENCE categories_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.categories_id_seq TO admin_user;


--
-- Name: TABLE cities; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.cities TO standard_user;
GRANT ALL ON TABLE public.cities TO admin_user;


--
-- Name: SEQUENCE cities_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.cities_id_seq TO admin_user;


--
-- Name: TABLE discounts; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.discounts TO standard_user;
GRANT ALL ON TABLE public.discounts TO admin_user;


--
-- Name: SEQUENCE discounts_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.discounts_id_seq TO admin_user;


--
-- Name: TABLE heros; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.heros TO standard_user;
GRANT ALL ON TABLE public.heros TO admin_user;


--
-- Name: SEQUENCE heros_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.heros_id_seq TO admin_user;


--
-- Name: TABLE orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.orders TO standard_user;
GRANT ALL ON TABLE public.orders TO admin_user;


--
-- Name: SEQUENCE orders_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.orders_id_seq TO admin_user;


--
-- Name: TABLE orders_products; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.orders_products TO standard_user;
GRANT ALL ON TABLE public.orders_products TO admin_user;


--
-- Name: TABLE payment_token; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.payment_token TO standard_user;
GRANT ALL ON TABLE public.payment_token TO admin_user;


--
-- Name: SEQUENCE payment_token_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.payment_token_id_seq TO admin_user;


--
-- Name: TABLE phones; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.phones TO standard_user;
GRANT ALL ON TABLE public.phones TO admin_user;


--
-- Name: SEQUENCE phones_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.phones_id_seq TO admin_user;


--
-- Name: TABLE product_variants; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.product_variants TO standard_user;
GRANT ALL ON TABLE public.product_variants TO admin_user;


--
-- Name: SEQUENCE product_variants_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.product_variants_id_seq TO admin_user;


--
-- Name: TABLE products; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.products TO standard_user;
GRANT ALL ON TABLE public.products TO admin_user;


--
-- Name: TABLE products_categories; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.products_categories TO standard_user;
GRANT ALL ON TABLE public.products_categories TO admin_user;


--
-- Name: SEQUENCE products_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.products_id_seq TO admin_user;


--
-- Name: TABLE reset_password_codes; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.reset_password_codes TO standard_user;
GRANT ALL ON TABLE public.reset_password_codes TO admin_user;


--
-- Name: SEQUENCE reset_password_codes_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.reset_password_codes_id_seq TO admin_user;


--
-- Name: TABLE states; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.states TO standard_user;
GRANT ALL ON TABLE public.states TO admin_user;


--
-- Name: SEQUENCE states_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.states_id_seq TO admin_user;


--
-- Name: TABLE variant_attribute_values; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT ON TABLE public.variant_attribute_values TO standard_user;
GRANT ALL ON TABLE public.variant_attribute_values TO admin_user;


--
-- Name: SEQUENCE variant_attribute_values_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.variant_attribute_values_id_seq TO admin_user;


--
-- PostgreSQL database dump complete
--

