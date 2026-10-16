--
-- PostgreSQL database dump
--

\restrict Xwa0DfkefsjHzNEGsWfLND2AwOXTnUCjhW7k0hlV2Nl0qgBdhefIj6qX7H3ndKD

-- Dumped from database version 18.6 (Ubuntu 18.6-0ubuntu0.26.04.1)
-- Dumped by pg_dump version 18.6 (Ubuntu 18.6-0ubuntu0.26.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: division; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.division VALUES (1, 'Barishal');
INSERT INTO public.division VALUES (2, 'Chittagong');
INSERT INTO public.division VALUES (3, 'Dhaka');
INSERT INTO public.division VALUES (4, 'Khulna');
INSERT INTO public.division VALUES (5, 'Mymensingh');
INSERT INTO public.division VALUES (6, 'Rajshahi');
INSERT INTO public.division VALUES (7, 'Rangpur');
INSERT INTO public.division VALUES (8, 'Sylhet');


--
-- Data for Name: district; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.district VALUES (1, 'Barguna', 1);
INSERT INTO public.district VALUES (2, 'Barishal', 1);
INSERT INTO public.district VALUES (3, 'Bhola', 1);
INSERT INTO public.district VALUES (4, 'Jhalokathi', 1);
INSERT INTO public.district VALUES (5, 'Patuakhali', 1);
INSERT INTO public.district VALUES (6, 'Pirojpur', 1);
INSERT INTO public.district VALUES (7, 'B.baria', 2);
INSERT INTO public.district VALUES (8, 'Bandarban', 2);
INSERT INTO public.district VALUES (9, 'Chandpur', 2);
INSERT INTO public.district VALUES (10, 'Chittagong', 2);
INSERT INTO public.district VALUES (11, 'Cox''s Bazar', 2);
INSERT INTO public.district VALUES (12, 'Cumilla', 2);
INSERT INTO public.district VALUES (13, 'Feni', 2);
INSERT INTO public.district VALUES (14, 'Khagrachari', 2);
INSERT INTO public.district VALUES (15, 'Laxmipur', 2);
INSERT INTO public.district VALUES (16, 'Noakhali', 2);
INSERT INTO public.district VALUES (17, 'Rangamati', 2);
INSERT INTO public.district VALUES (18, 'Dhaka', 3);
INSERT INTO public.district VALUES (19, 'Faridpur', 3);
INSERT INTO public.district VALUES (20, 'Gazipur', 3);
INSERT INTO public.district VALUES (21, 'Gopalganj', 3);
INSERT INTO public.district VALUES (22, 'Kishoreganj', 3);
INSERT INTO public.district VALUES (23, 'Madaripur', 3);
INSERT INTO public.district VALUES (24, 'Manikganj', 3);
INSERT INTO public.district VALUES (25, 'Munshiganj', 3);
INSERT INTO public.district VALUES (26, 'Narayanganj', 3);
INSERT INTO public.district VALUES (27, 'Narshingdi', 3);
INSERT INTO public.district VALUES (28, 'Rajbari', 3);
INSERT INTO public.district VALUES (29, 'Shariatpur', 3);
INSERT INTO public.district VALUES (30, 'Tangail', 3);
INSERT INTO public.district VALUES (31, 'Bagerhat', 4);
INSERT INTO public.district VALUES (32, 'Chuadanga', 4);
INSERT INTO public.district VALUES (33, 'Jashore', 4);
INSERT INTO public.district VALUES (34, 'Jhenaidah', 4);
INSERT INTO public.district VALUES (35, 'Khulna', 4);
INSERT INTO public.district VALUES (36, 'Kushtia', 4);
INSERT INTO public.district VALUES (37, 'Magura', 4);
INSERT INTO public.district VALUES (38, 'Meherpur', 4);
INSERT INTO public.district VALUES (39, 'Narail', 4);
INSERT INTO public.district VALUES (40, 'Satkhira', 4);
INSERT INTO public.district VALUES (41, 'Jamalpur', 5);
INSERT INTO public.district VALUES (42, 'Mymensingh', 5);
INSERT INTO public.district VALUES (43, 'Netrokona', 5);
INSERT INTO public.district VALUES (44, 'Sherpur', 5);
INSERT INTO public.district VALUES (45, 'Bogura', 6);
INSERT INTO public.district VALUES (46, 'C. nawabganj', 6);
INSERT INTO public.district VALUES (47, 'Joypurhat', 6);
INSERT INTO public.district VALUES (48, 'Naogaon', 6);
INSERT INTO public.district VALUES (49, 'Natore', 6);
INSERT INTO public.district VALUES (50, 'Pabna', 6);
INSERT INTO public.district VALUES (51, 'Rajshahi', 6);
INSERT INTO public.district VALUES (52, 'Sirajganj', 6);
INSERT INTO public.district VALUES (53, 'Dinajpur', 7);
INSERT INTO public.district VALUES (54, 'Gaibandha', 7);
INSERT INTO public.district VALUES (55, 'Kurigram', 7);
INSERT INTO public.district VALUES (56, 'Lalmonirhat', 7);
INSERT INTO public.district VALUES (57, 'Nilphamari', 7);
INSERT INTO public.district VALUES (58, 'Panchagarh', 7);
INSERT INTO public.district VALUES (59, 'Rangpur', 7);
INSERT INTO public.district VALUES (60, 'Thakurgaon', 7);
INSERT INTO public.district VALUES (61, 'Habiganj', 8);
INSERT INTO public.district VALUES (62, 'Moulvibazar', 8);
INSERT INTO public.district VALUES (63, 'Sunamganj', 8);
INSERT INTO public.district VALUES (64, 'Sylhet', 8);


--
-- Data for Name: location; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.location VALUES (343, 'Nawabganj-S', 46);
INSERT INTO public.location VALUES (344, 'Shibganj', 46);
INSERT INTO public.location VALUES (345, 'Akkelpur', 47);
INSERT INTO public.location VALUES (346, 'Joypurhat-S', 47);
INSERT INTO public.location VALUES (347, 'Kalai', 47);
INSERT INTO public.location VALUES (348, 'Khetlal', 47);
INSERT INTO public.location VALUES (349, 'Panchbibi', 47);
INSERT INTO public.location VALUES (350, 'Atrai', 48);
INSERT INTO public.location VALUES (351, 'Badalgachi', 48);
INSERT INTO public.location VALUES (352, 'Dhamoirhat', 48);
INSERT INTO public.location VALUES (353, 'Manda', 48);
INSERT INTO public.location VALUES (354, 'Mohadevpur', 48);
INSERT INTO public.location VALUES (355, 'Naogaon-S', 48);
INSERT INTO public.location VALUES (356, 'Niamatpur', 48);
INSERT INTO public.location VALUES (357, 'Patnitala', 48);
INSERT INTO public.location VALUES (358, 'Porsha', 48);
INSERT INTO public.location VALUES (359, 'Raninagar', 48);
INSERT INTO public.location VALUES (360, 'Shapahar', 48);
INSERT INTO public.location VALUES (361, 'Bagatipara', 49);
INSERT INTO public.location VALUES (362, 'Baraigram', 49);
INSERT INTO public.location VALUES (363, 'Gurudaspur', 49);
INSERT INTO public.location VALUES (364, 'Lalpur', 49);
INSERT INTO public.location VALUES (365, 'Naldanga', 49);
INSERT INTO public.location VALUES (366, 'Natore-S', 49);
INSERT INTO public.location VALUES (367, 'Singra', 49);
INSERT INTO public.location VALUES (368, 'Atghoria', 50);
INSERT INTO public.location VALUES (369, 'Bera', 50);
INSERT INTO public.location VALUES (370, 'Bhangura', 50);
INSERT INTO public.location VALUES (371, 'Chatmohar', 50);
INSERT INTO public.location VALUES (372, 'Faridpur', 50);
INSERT INTO public.location VALUES (373, 'Ishwardi', 50);
INSERT INTO public.location VALUES (374, 'Pabna-S', 50);
INSERT INTO public.location VALUES (375, 'Santhia', 50);
INSERT INTO public.location VALUES (376, 'Sujanagar', 50);
INSERT INTO public.location VALUES (377, 'Bagha', 51);
INSERT INTO public.location VALUES (378, 'Bagmara', 51);
INSERT INTO public.location VALUES (379, 'Charghat', 51);
INSERT INTO public.location VALUES (380, 'Durgapur', 51);
INSERT INTO public.location VALUES (381, 'Godagari', 51);
INSERT INTO public.location VALUES (382, 'Mohanpur', 51);
INSERT INTO public.location VALUES (383, 'Paba', 51);
INSERT INTO public.location VALUES (384, 'Puthia', 51);
INSERT INTO public.location VALUES (385, 'Tanore', 51);
INSERT INTO public.location VALUES (386, 'Belkuchi', 52);
INSERT INTO public.location VALUES (387, 'Chowhali', 52);
INSERT INTO public.location VALUES (388, 'Kamarkhand', 52);
INSERT INTO public.location VALUES (389, 'Kazipur', 52);
INSERT INTO public.location VALUES (390, 'Raiganj', 52);
INSERT INTO public.location VALUES (391, 'Shahzadpur', 52);
INSERT INTO public.location VALUES (392, 'Sirajganj-S', 52);
INSERT INTO public.location VALUES (393, 'Tarash', 52);
INSERT INTO public.location VALUES (394, 'Ullapara', 52);
INSERT INTO public.location VALUES (395, 'Birampur', 53);
INSERT INTO public.location VALUES (396, 'Birganj', 53);
INSERT INTO public.location VALUES (397, 'Birol', 53);
INSERT INTO public.location VALUES (398, 'Bochaganj', 53);
INSERT INTO public.location VALUES (399, 'Chirirbandar', 53);
INSERT INTO public.location VALUES (400, 'Dinajpur-S', 53);
INSERT INTO public.location VALUES (401, 'Fulbari', 53);
INSERT INTO public.location VALUES (402, 'Ghoraghat', 53);
INSERT INTO public.location VALUES (403, 'Hakimpur', 53);
INSERT INTO public.location VALUES (404, 'Kaharol', 53);
INSERT INTO public.location VALUES (405, 'Khanshama', 53);
INSERT INTO public.location VALUES (406, 'Nawabganj', 53);
INSERT INTO public.location VALUES (407, 'Parbatipur', 53);
INSERT INTO public.location VALUES (408, 'Fulchari', 54);
INSERT INTO public.location VALUES (409, 'Gaibandha-S', 54);
INSERT INTO public.location VALUES (410, 'Gobindaganj', 54);
INSERT INTO public.location VALUES (411, 'Palashbari', 54);
INSERT INTO public.location VALUES (412, 'Sadullapur', 54);
INSERT INTO public.location VALUES (413, 'Saghata', 54);
INSERT INTO public.location VALUES (414, 'Sundarganj', 54);
INSERT INTO public.location VALUES (415, 'Bhurungamari', 55);
INSERT INTO public.location VALUES (416, 'Chilmari', 55);
INSERT INTO public.location VALUES (417, 'Fulbari', 55);
INSERT INTO public.location VALUES (418, 'Kurigram-S', 55);
INSERT INTO public.location VALUES (419, 'Nageswari', 55);
INSERT INTO public.location VALUES (420, 'Rajarhat', 55);
INSERT INTO public.location VALUES (421, 'Rajibpur', 55);
INSERT INTO public.location VALUES (422, 'Rowmari', 55);
INSERT INTO public.location VALUES (423, 'Ulipur', 55);
INSERT INTO public.location VALUES (424, 'Aditmari', 56);
INSERT INTO public.location VALUES (425, 'Hatibandha', 56);
INSERT INTO public.location VALUES (426, 'Kaliganj', 56);
INSERT INTO public.location VALUES (427, 'Lalmonirhat-S', 56);
INSERT INTO public.location VALUES (428, 'Patgram', 56);
INSERT INTO public.location VALUES (429, 'Dimla', 57);
INSERT INTO public.location VALUES (430, 'Domar', 57);
INSERT INTO public.location VALUES (431, 'Jaldhaka', 57);
INSERT INTO public.location VALUES (432, 'Kishoreganj', 57);
INSERT INTO public.location VALUES (433, 'Nilphamari-S', 57);
INSERT INTO public.location VALUES (434, 'Sayedpur', 57);
INSERT INTO public.location VALUES (435, 'Atwari', 58);
INSERT INTO public.location VALUES (436, 'Boda', 58);
INSERT INTO public.location VALUES (437, 'Debiganj', 58);
INSERT INTO public.location VALUES (438, 'Panchagarh-S', 58);
INSERT INTO public.location VALUES (439, 'Tetulia', 58);
INSERT INTO public.location VALUES (440, 'Badarganj', 59);
INSERT INTO public.location VALUES (441, 'Gangachara', 59);
INSERT INTO public.location VALUES (442, 'Kaunia', 59);
INSERT INTO public.location VALUES (443, 'Mithapukur', 59);
INSERT INTO public.location VALUES (444, 'Pirgacha', 59);
INSERT INTO public.location VALUES (445, 'Pirganj', 59);
INSERT INTO public.location VALUES (446, 'Rangpur-S', 59);
INSERT INTO public.location VALUES (447, 'Taraganj', 59);
INSERT INTO public.location VALUES (448, 'Baliadangi', 60);
INSERT INTO public.location VALUES (449, 'Haripur', 60);
INSERT INTO public.location VALUES (450, 'Pirganj', 60);
INSERT INTO public.location VALUES (451, 'Ranisankail', 60);
INSERT INTO public.location VALUES (452, 'Thakurgaon-S', 60);
INSERT INTO public.location VALUES (453, 'Azmiriganj', 61);
INSERT INTO public.location VALUES (454, 'Bahubal', 61);
INSERT INTO public.location VALUES (455, 'Baniachong', 61);
INSERT INTO public.location VALUES (456, 'Chunarughat', 61);
INSERT INTO public.location VALUES (457, 'Habiganj-S', 61);
INSERT INTO public.location VALUES (458, 'Lakhai', 61);
INSERT INTO public.location VALUES (459, 'Madhabpur', 61);
INSERT INTO public.location VALUES (460, 'Nabiganj', 61);
INSERT INTO public.location VALUES (461, 'Sayestaganj', 61);
INSERT INTO public.location VALUES (462, 'Barlekha', 62);
INSERT INTO public.location VALUES (463, 'Juri', 62);
INSERT INTO public.location VALUES (464, 'Kamalganj', 62);
INSERT INTO public.location VALUES (465, 'Kulaura', 62);
INSERT INTO public.location VALUES (466, 'Moulvibazar-S', 62);
INSERT INTO public.location VALUES (467, 'Rajnagar', 62);
INSERT INTO public.location VALUES (468, 'Sreemangal', 62);
INSERT INTO public.location VALUES (469, 'Biswamvarpur', 63);
INSERT INTO public.location VALUES (470, 'Chatak', 63);
INSERT INTO public.location VALUES (471, 'Dakhin Sunamganj', 63);
INSERT INTO public.location VALUES (472, 'Derai', 63);
INSERT INTO public.location VALUES (473, 'Dharmapasha', 63);
INSERT INTO public.location VALUES (474, 'Doarabazar', 63);
INSERT INTO public.location VALUES (475, 'Jagannathpur', 63);
INSERT INTO public.location VALUES (476, 'Jamalganj', 63);
INSERT INTO public.location VALUES (477, 'Sulla', 63);
INSERT INTO public.location VALUES (478, 'Sunamganj-S', 63);
INSERT INTO public.location VALUES (479, 'Tahirpur', 63);
INSERT INTO public.location VALUES (480, 'Balaganj', 64);
INSERT INTO public.location VALUES (481, 'Beanibazar', 64);
INSERT INTO public.location VALUES (482, 'Biswanath', 64);
INSERT INTO public.location VALUES (483, 'Companiganj', 64);
INSERT INTO public.location VALUES (484, 'Dakshin Surma', 64);
INSERT INTO public.location VALUES (485, 'Fenchuganj', 64);
INSERT INTO public.location VALUES (486, 'Golapganj', 64);
INSERT INTO public.location VALUES (487, 'Gowainghat', 64);
INSERT INTO public.location VALUES (488, 'Jointiapur', 64);
INSERT INTO public.location VALUES (489, 'Kanaighat', 64);
INSERT INTO public.location VALUES (490, 'Osmaninagar', 64);
INSERT INTO public.location VALUES (491, 'Sylhet-S', 64);
INSERT INTO public.location VALUES (492, 'Zakiganj', 64);
INSERT INTO public.location VALUES (501, 'Barishal City Corporation', 2);
INSERT INTO public.location VALUES (502, 'Chittagong City Corporation', 10);
INSERT INTO public.location VALUES (503, 'Cumilla City Corporation', 12);
INSERT INTO public.location VALUES (504, 'Dhaka North City Corporation', 18);
INSERT INTO public.location VALUES (505, 'Dhaka South City Corporation', 18);
INSERT INTO public.location VALUES (506, 'Gazipur Ciry Corporation', 20);
INSERT INTO public.location VALUES (507, 'Narayanganj City Corporation', 26);
INSERT INTO public.location VALUES (508, 'Khulna City Corporation', 35);
INSERT INTO public.location VALUES (509, 'Mymensingh City Corporation', 42);
INSERT INTO public.location VALUES (510, 'Rajshahi City Corporation', 51);
INSERT INTO public.location VALUES (511, 'Rangpur City Corporation', 59);
INSERT INTO public.location VALUES (512, 'Sylhet City Corporation', 64);
INSERT INTO public.location VALUES (1, 'Amtali', 1);
INSERT INTO public.location VALUES (2, 'Bamna', 1);
INSERT INTO public.location VALUES (3, 'Barguna-S', 1);
INSERT INTO public.location VALUES (4, 'Betagi', 1);
INSERT INTO public.location VALUES (5, 'Patharghata', 1);
INSERT INTO public.location VALUES (6, 'Taltali', 1);
INSERT INTO public.location VALUES (7, 'Agailjhara', 2);
INSERT INTO public.location VALUES (8, 'Babuganj', 2);
INSERT INTO public.location VALUES (9, 'Bakerganj', 2);
INSERT INTO public.location VALUES (10, 'Banaripara', 2);
INSERT INTO public.location VALUES (11, 'Barishal-S', 2);
INSERT INTO public.location VALUES (12, 'Gouranadi', 2);
INSERT INTO public.location VALUES (13, 'Hizla', 2);
INSERT INTO public.location VALUES (14, 'Mehendiganj', 2);
INSERT INTO public.location VALUES (15, 'Muladi', 2);
INSERT INTO public.location VALUES (16, 'Uzirpur', 2);
INSERT INTO public.location VALUES (17, 'Bhola-S', 3);
INSERT INTO public.location VALUES (18, 'Borhanuddin', 3);
INSERT INTO public.location VALUES (19, 'Charfassion', 3);
INSERT INTO public.location VALUES (20, 'Daulatkhan', 3);
INSERT INTO public.location VALUES (21, 'Lalmohan', 3);
INSERT INTO public.location VALUES (22, 'Monpura', 3);
INSERT INTO public.location VALUES (23, 'Tazumuddin', 3);
INSERT INTO public.location VALUES (24, 'Jhalokathi-S', 4);
INSERT INTO public.location VALUES (25, 'Kathalia', 4);
INSERT INTO public.location VALUES (26, 'Nalchity', 4);
INSERT INTO public.location VALUES (27, 'Rajapur', 4);
INSERT INTO public.location VALUES (28, 'Bauphal', 5);
INSERT INTO public.location VALUES (29, 'Dashmina', 5);
INSERT INTO public.location VALUES (30, 'Dumki', 5);
INSERT INTO public.location VALUES (31, 'Galachipa', 5);
INSERT INTO public.location VALUES (32, 'Kalapara', 5);
INSERT INTO public.location VALUES (33, 'Mirjaganj', 5);
INSERT INTO public.location VALUES (34, 'Patuakhali-S', 5);
INSERT INTO public.location VALUES (35, 'Rangabali', 5);
INSERT INTO public.location VALUES (36, 'Bhandaria', 6);
INSERT INTO public.location VALUES (37, 'Kawkhali', 6);
INSERT INTO public.location VALUES (38, 'Mothbaria', 6);
INSERT INTO public.location VALUES (39, 'Nazirpur', 6);
INSERT INTO public.location VALUES (40, 'Nesarabad', 6);
INSERT INTO public.location VALUES (41, 'Pirojpur-S', 6);
INSERT INTO public.location VALUES (42, 'Zianagar', 6);
INSERT INTO public.location VALUES (43, 'Akhaura', 7);
INSERT INTO public.location VALUES (44, 'Ashuganj', 7);
INSERT INTO public.location VALUES (45, 'B.Baria-S', 7);
INSERT INTO public.location VALUES (46, 'Bancharampur', 7);
INSERT INTO public.location VALUES (47, 'Bijoynagar', 7);
INSERT INTO public.location VALUES (48, 'Kasba', 7);
INSERT INTO public.location VALUES (49, 'Nabinagar', 7);
INSERT INTO public.location VALUES (50, 'Nasirnagar', 7);
INSERT INTO public.location VALUES (51, 'Sarail', 7);
INSERT INTO public.location VALUES (52, 'Alikadam', 8);
INSERT INTO public.location VALUES (53, 'Bandarban-S', 8);
INSERT INTO public.location VALUES (54, 'Lama', 8);
INSERT INTO public.location VALUES (55, 'Naikhyongchari', 8);
INSERT INTO public.location VALUES (56, 'Rowangchari', 8);
INSERT INTO public.location VALUES (57, 'Ruma', 8);
INSERT INTO public.location VALUES (58, 'Thanchi', 8);
INSERT INTO public.location VALUES (59, 'Chandpur-S', 9);
INSERT INTO public.location VALUES (60, 'Faridganj', 9);
INSERT INTO public.location VALUES (61, 'Haimchar', 9);
INSERT INTO public.location VALUES (62, 'Haziganj', 9);
INSERT INTO public.location VALUES (63, 'Kachua', 9);
INSERT INTO public.location VALUES (64, 'Matlab (Dakshin)', 9);
INSERT INTO public.location VALUES (65, 'Matlab (Uttar)', 9);
INSERT INTO public.location VALUES (66, 'Shahrasti', 9);
INSERT INTO public.location VALUES (67, 'Anwara', 10);
INSERT INTO public.location VALUES (68, 'Banskhali', 10);
INSERT INTO public.location VALUES (69, 'Boalkhali', 10);
INSERT INTO public.location VALUES (70, 'Chandanish', 10);
INSERT INTO public.location VALUES (71, 'Fatikchari', 10);
INSERT INTO public.location VALUES (72, 'Hathazari', 10);
INSERT INTO public.location VALUES (73, 'Karnaphuli', 10);
INSERT INTO public.location VALUES (74, 'Lohagara', 10);
INSERT INTO public.location VALUES (75, 'Mirsharai', 10);
INSERT INTO public.location VALUES (76, 'Patiya', 10);
INSERT INTO public.location VALUES (77, 'Rangunia', 10);
INSERT INTO public.location VALUES (78, 'Raojan', 10);
INSERT INTO public.location VALUES (79, 'Sandwip', 10);
INSERT INTO public.location VALUES (80, 'Satkania', 10);
INSERT INTO public.location VALUES (81, 'Sitakunda', 10);
INSERT INTO public.location VALUES (82, 'Chakoria', 11);
INSERT INTO public.location VALUES (83, 'Cox''s Bazar-S', 11);
INSERT INTO public.location VALUES (84, 'Kutubdia', 11);
INSERT INTO public.location VALUES (85, 'Moheskhali', 11);
INSERT INTO public.location VALUES (86, 'Pekua', 11);
INSERT INTO public.location VALUES (87, 'Ramu', 11);
INSERT INTO public.location VALUES (88, 'Teknaf', 11);
INSERT INTO public.location VALUES (89, 'Ukhiya', 11);
INSERT INTO public.location VALUES (90, 'Barura', 12);
INSERT INTO public.location VALUES (91, 'Brahmanpara', 12);
INSERT INTO public.location VALUES (92, 'Burichong', 12);
INSERT INTO public.location VALUES (93, 'Chandina', 12);
INSERT INTO public.location VALUES (94, 'Chouddagram', 12);
INSERT INTO public.location VALUES (95, 'Cumilla-S', 12);
INSERT INTO public.location VALUES (96, 'Cumilla-S Daksin', 12);
INSERT INTO public.location VALUES (97, 'Daudkandi', 12);
INSERT INTO public.location VALUES (98, 'Debidwar', 12);
INSERT INTO public.location VALUES (99, 'Homna', 12);
INSERT INTO public.location VALUES (100, 'Laksham', 12);
INSERT INTO public.location VALUES (101, 'Lalmai', 12);
INSERT INTO public.location VALUES (102, 'Meghna', 12);
INSERT INTO public.location VALUES (103, 'Monohorganj', 12);
INSERT INTO public.location VALUES (104, 'Muradnagar', 12);
INSERT INTO public.location VALUES (105, 'Nangalkot', 12);
INSERT INTO public.location VALUES (106, 'Titas', 12);
INSERT INTO public.location VALUES (107, 'Chhagalniya', 13);
INSERT INTO public.location VALUES (108, 'Daganbhuiyan', 13);
INSERT INTO public.location VALUES (109, 'Feni-S', 13);
INSERT INTO public.location VALUES (110, 'Fulgazi', 13);
INSERT INTO public.location VALUES (111, 'Porshuram', 13);
INSERT INTO public.location VALUES (112, 'Sonagazi', 13);
INSERT INTO public.location VALUES (113, 'Dighinala', 14);
INSERT INTO public.location VALUES (114, 'Guimara', 14);
INSERT INTO public.location VALUES (115, 'Khagrachari-S', 14);
INSERT INTO public.location VALUES (116, 'Laxmichari', 14);
INSERT INTO public.location VALUES (117, 'Mahalchari', 14);
INSERT INTO public.location VALUES (118, 'Manikchari', 14);
INSERT INTO public.location VALUES (119, 'Matiranga', 14);
INSERT INTO public.location VALUES (120, 'Panchari', 14);
INSERT INTO public.location VALUES (121, 'Ramgarh', 14);
INSERT INTO public.location VALUES (122, 'Komol Nagar', 15);
INSERT INTO public.location VALUES (123, 'Laxmipur-S', 15);
INSERT INTO public.location VALUES (124, 'Raipur', 15);
INSERT INTO public.location VALUES (125, 'Ramganj', 15);
INSERT INTO public.location VALUES (126, 'Ramgati', 15);
INSERT INTO public.location VALUES (127, 'Begumganj', 16);
INSERT INTO public.location VALUES (128, 'Chatkhil', 16);
INSERT INTO public.location VALUES (129, 'Companiganj', 16);
INSERT INTO public.location VALUES (130, 'Hatiya', 16);
INSERT INTO public.location VALUES (131, 'Kabir Hat', 16);
INSERT INTO public.location VALUES (132, 'Noakhali-S', 16);
INSERT INTO public.location VALUES (133, 'Senbag', 16);
INSERT INTO public.location VALUES (134, 'Sonaimuri', 16);
INSERT INTO public.location VALUES (135, 'Subarna Char', 16);
INSERT INTO public.location VALUES (136, 'Baghaichari', 17);
INSERT INTO public.location VALUES (137, 'Barkal', 17);
INSERT INTO public.location VALUES (138, 'Belaichari', 17);
INSERT INTO public.location VALUES (139, 'Juraichari', 17);
INSERT INTO public.location VALUES (140, 'Kaptai', 17);
INSERT INTO public.location VALUES (141, 'Kaukhali', 17);
INSERT INTO public.location VALUES (142, 'Langadu', 17);
INSERT INTO public.location VALUES (143, 'Nanniarchar', 17);
INSERT INTO public.location VALUES (144, 'Rajosthali', 17);
INSERT INTO public.location VALUES (145, 'Rangamati-S', 17);
INSERT INTO public.location VALUES (146, 'Dhamrai', 18);
INSERT INTO public.location VALUES (147, 'Dohar', 18);
INSERT INTO public.location VALUES (148, 'Keraniganj', 18);
INSERT INTO public.location VALUES (149, 'Nawabganj', 18);
INSERT INTO public.location VALUES (150, 'Savar', 18);
INSERT INTO public.location VALUES (151, 'Alfadanga', 19);
INSERT INTO public.location VALUES (152, 'Bhanga', 19);
INSERT INTO public.location VALUES (153, 'Boalmari', 19);
INSERT INTO public.location VALUES (154, 'Charbhadrasan', 19);
INSERT INTO public.location VALUES (155, 'Faridpur-S', 19);
INSERT INTO public.location VALUES (156, 'Madhukhali', 19);
INSERT INTO public.location VALUES (157, 'Nagarkanda', 19);
INSERT INTO public.location VALUES (158, 'Sadarpur', 19);
INSERT INTO public.location VALUES (159, 'Saltha', 19);
INSERT INTO public.location VALUES (160, 'Gazipur-S', 20);
INSERT INTO public.location VALUES (161, 'Kaliakoir', 20);
INSERT INTO public.location VALUES (162, 'Kaliganj', 20);
INSERT INTO public.location VALUES (163, 'Kapasia', 20);
INSERT INTO public.location VALUES (164, 'Sreepur', 20);
INSERT INTO public.location VALUES (165, 'Gopalganj-S', 21);
INSERT INTO public.location VALUES (166, 'Kasiani', 21);
INSERT INTO public.location VALUES (167, 'Kotwalipara', 21);
INSERT INTO public.location VALUES (168, 'Muksudpur', 21);
INSERT INTO public.location VALUES (169, 'Tungipara', 21);
INSERT INTO public.location VALUES (170, 'Austagram', 22);
INSERT INTO public.location VALUES (171, 'Bajitpur', 22);
INSERT INTO public.location VALUES (172, 'Bhairab', 22);
INSERT INTO public.location VALUES (173, 'Hossainpur', 22);
INSERT INTO public.location VALUES (174, 'Itna', 22);
INSERT INTO public.location VALUES (175, 'Karimganj', 22);
INSERT INTO public.location VALUES (176, 'Katiadi', 22);
INSERT INTO public.location VALUES (177, 'Kishoreganj-S', 22);
INSERT INTO public.location VALUES (178, 'Kuliarchar', 22);
INSERT INTO public.location VALUES (179, 'Mithamoin', 22);
INSERT INTO public.location VALUES (180, 'Nikli', 22);
INSERT INTO public.location VALUES (181, 'Pakundia', 22);
INSERT INTO public.location VALUES (182, 'Tarail', 22);
INSERT INTO public.location VALUES (183, 'Kalkini', 23);
INSERT INTO public.location VALUES (184, 'Madaripur-S', 23);
INSERT INTO public.location VALUES (185, 'Rajoir', 23);
INSERT INTO public.location VALUES (186, 'Shibchar', 23);
INSERT INTO public.location VALUES (187, 'Daulatpur', 24);
INSERT INTO public.location VALUES (188, 'Ghior', 24);
INSERT INTO public.location VALUES (189, 'Harirampur', 24);
INSERT INTO public.location VALUES (190, 'Manikganj-S', 24);
INSERT INTO public.location VALUES (191, 'Saturia', 24);
INSERT INTO public.location VALUES (192, 'Shivalaya', 24);
INSERT INTO public.location VALUES (193, 'Singair', 24);
INSERT INTO public.location VALUES (194, 'Gazaria', 25);
INSERT INTO public.location VALUES (195, 'Lauhajong', 25);
INSERT INTO public.location VALUES (196, 'Munshiganj-S', 25);
INSERT INTO public.location VALUES (197, 'Sirajdikhan', 25);
INSERT INTO public.location VALUES (198, 'Sreenagar', 25);
INSERT INTO public.location VALUES (199, 'Tongibari', 25);
INSERT INTO public.location VALUES (200, 'Araihazar', 26);
INSERT INTO public.location VALUES (201, 'Bandar', 26);
INSERT INTO public.location VALUES (202, 'Narayanganj-S', 26);
INSERT INTO public.location VALUES (203, 'Rupganj', 26);
INSERT INTO public.location VALUES (204, 'Sonargaon', 26);
INSERT INTO public.location VALUES (205, 'Belabo', 27);
INSERT INTO public.location VALUES (206, 'Monohardi', 27);
INSERT INTO public.location VALUES (207, 'Narshingdi-S', 27);
INSERT INTO public.location VALUES (208, 'Palash', 27);
INSERT INTO public.location VALUES (209, 'Raipura', 27);
INSERT INTO public.location VALUES (210, 'Shibpur', 27);
INSERT INTO public.location VALUES (211, 'Baliakandi', 28);
INSERT INTO public.location VALUES (212, 'Goalanda', 28);
INSERT INTO public.location VALUES (213, 'Kalukhali', 28);
INSERT INTO public.location VALUES (214, 'Pangsha', 28);
INSERT INTO public.location VALUES (215, 'Rajbari-S', 28);
INSERT INTO public.location VALUES (216, 'Bhedarganj', 29);
INSERT INTO public.location VALUES (217, 'Damuddya', 29);
INSERT INTO public.location VALUES (218, 'Goshairhat', 29);
INSERT INTO public.location VALUES (219, 'Janjira', 29);
INSERT INTO public.location VALUES (220, 'Naria', 29);
INSERT INTO public.location VALUES (221, 'Shariatpur-S', 29);
INSERT INTO public.location VALUES (222, 'Basail', 30);
INSERT INTO public.location VALUES (223, 'Bhuapur', 30);
INSERT INTO public.location VALUES (224, 'Delduar', 30);
INSERT INTO public.location VALUES (225, 'Dhanbari', 30);
INSERT INTO public.location VALUES (226, 'Ghatail', 30);
INSERT INTO public.location VALUES (227, 'Gopalpur', 30);
INSERT INTO public.location VALUES (228, 'Kalihati', 30);
INSERT INTO public.location VALUES (229, 'Madhupur', 30);
INSERT INTO public.location VALUES (230, 'Mirzapur', 30);
INSERT INTO public.location VALUES (231, 'Nagarpur', 30);
INSERT INTO public.location VALUES (232, 'Shakhipur', 30);
INSERT INTO public.location VALUES (233, 'Tangail-S', 30);
INSERT INTO public.location VALUES (234, 'Bagerhat-S', 31);
INSERT INTO public.location VALUES (235, 'Chitalmari', 31);
INSERT INTO public.location VALUES (236, 'Fakirhat', 31);
INSERT INTO public.location VALUES (237, 'Kachua', 31);
INSERT INTO public.location VALUES (238, 'Mollahat', 31);
INSERT INTO public.location VALUES (239, 'Mongla', 31);
INSERT INTO public.location VALUES (240, 'Morrelganj', 31);
INSERT INTO public.location VALUES (241, 'Rampal', 31);
INSERT INTO public.location VALUES (242, 'Sharankhola', 31);
INSERT INTO public.location VALUES (243, 'Alamdanga', 32);
INSERT INTO public.location VALUES (244, 'Chuadanga-S', 32);
INSERT INTO public.location VALUES (245, 'Damurhuda', 32);
INSERT INTO public.location VALUES (246, 'Jibannagar', 32);
INSERT INTO public.location VALUES (247, 'Abhoynagar', 33);
INSERT INTO public.location VALUES (248, 'Bagherpara', 33);
INSERT INTO public.location VALUES (249, 'Chowgacha', 33);
INSERT INTO public.location VALUES (250, 'Jashore-S', 33);
INSERT INTO public.location VALUES (251, 'Jhikargacha', 33);
INSERT INTO public.location VALUES (252, 'Keshabpur', 33);
INSERT INTO public.location VALUES (253, 'Monirampur', 33);
INSERT INTO public.location VALUES (254, 'Sarsha', 33);
INSERT INTO public.location VALUES (255, 'Harinakunda', 34);
INSERT INTO public.location VALUES (256, 'Jhenaidah-S', 34);
INSERT INTO public.location VALUES (257, 'Kaliganj', 34);
INSERT INTO public.location VALUES (258, 'Kotchandpur', 34);
INSERT INTO public.location VALUES (259, 'Moheshpur', 34);
INSERT INTO public.location VALUES (260, 'Shailkupa', 34);
INSERT INTO public.location VALUES (261, 'Batiaghata', 35);
INSERT INTO public.location VALUES (262, 'Dacope', 35);
INSERT INTO public.location VALUES (263, 'Dighalia', 35);
INSERT INTO public.location VALUES (264, 'Dumuria', 35);
INSERT INTO public.location VALUES (265, 'Koira', 35);
INSERT INTO public.location VALUES (266, 'Paikgacha', 35);
INSERT INTO public.location VALUES (267, 'Phultala', 35);
INSERT INTO public.location VALUES (268, 'Rupsa', 35);
INSERT INTO public.location VALUES (269, 'Terokhada', 35);
INSERT INTO public.location VALUES (270, 'Bheramara', 36);
INSERT INTO public.location VALUES (271, 'Daulatpur', 36);
INSERT INTO public.location VALUES (272, 'Khoksha', 36);
INSERT INTO public.location VALUES (273, 'Kumarkhali', 36);
INSERT INTO public.location VALUES (274, 'Kushtia-S', 36);
INSERT INTO public.location VALUES (275, 'Mirpur', 36);
INSERT INTO public.location VALUES (276, 'Magura-S', 37);
INSERT INTO public.location VALUES (277, 'Mohammadpur', 37);
INSERT INTO public.location VALUES (278, 'Salikha', 37);
INSERT INTO public.location VALUES (279, 'Sreepur', 37);
INSERT INTO public.location VALUES (280, 'Gangni', 38);
INSERT INTO public.location VALUES (281, 'Meherpur-S', 38);
INSERT INTO public.location VALUES (282, 'Mujib Nagar', 38);
INSERT INTO public.location VALUES (283, 'Kalia', 39);
INSERT INTO public.location VALUES (284, 'Lohagara', 39);
INSERT INTO public.location VALUES (285, 'Narail-S', 39);
INSERT INTO public.location VALUES (286, 'Assasuni', 40);
INSERT INTO public.location VALUES (287, 'Debhata', 40);
INSERT INTO public.location VALUES (288, 'Kalaroa', 40);
INSERT INTO public.location VALUES (289, 'Kaliganj', 40);
INSERT INTO public.location VALUES (290, 'Satkhira-S', 40);
INSERT INTO public.location VALUES (291, 'Shyamnagar', 40);
INSERT INTO public.location VALUES (292, 'Tala', 40);
INSERT INTO public.location VALUES (293, 'Bakshiganj', 41);
INSERT INTO public.location VALUES (294, 'Dewanganj', 41);
INSERT INTO public.location VALUES (295, 'Islampur', 41);
INSERT INTO public.location VALUES (296, 'Jamalpur-S', 41);
INSERT INTO public.location VALUES (297, 'Madarganj', 41);
INSERT INTO public.location VALUES (298, 'Melendah', 41);
INSERT INTO public.location VALUES (299, 'Sarishabari', 41);
INSERT INTO public.location VALUES (300, 'Bhaluka', 42);
INSERT INTO public.location VALUES (301, 'Dhobaura', 42);
INSERT INTO public.location VALUES (302, 'Fulbaria', 42);
INSERT INTO public.location VALUES (303, 'Gaffargaon', 42);
INSERT INTO public.location VALUES (304, 'Gouripur', 42);
INSERT INTO public.location VALUES (305, 'Haluaghat', 42);
INSERT INTO public.location VALUES (306, 'Ishwarganj', 42);
INSERT INTO public.location VALUES (307, 'Muktagacha', 42);
INSERT INTO public.location VALUES (308, 'Mymensingh-S', 42);
INSERT INTO public.location VALUES (309, 'Nandail', 42);
INSERT INTO public.location VALUES (310, 'Phulpur', 42);
INSERT INTO public.location VALUES (311, 'Tarakanda', 42);
INSERT INTO public.location VALUES (312, 'Trishal', 42);
INSERT INTO public.location VALUES (313, 'Atpara', 43);
INSERT INTO public.location VALUES (314, 'Barhatta', 43);
INSERT INTO public.location VALUES (315, 'Durgapur', 43);
INSERT INTO public.location VALUES (316, 'Kalmakanda', 43);
INSERT INTO public.location VALUES (317, 'Kendua', 43);
INSERT INTO public.location VALUES (318, 'Khaliajuri', 43);
INSERT INTO public.location VALUES (319, 'Madan', 43);
INSERT INTO public.location VALUES (320, 'Mohanganj', 43);
INSERT INTO public.location VALUES (321, 'Netrakona-S', 43);
INSERT INTO public.location VALUES (322, 'Purbadhala', 43);
INSERT INTO public.location VALUES (323, 'Jhenaigati', 44);
INSERT INTO public.location VALUES (324, 'Nakla', 44);
INSERT INTO public.location VALUES (325, 'Nalitabari', 44);
INSERT INTO public.location VALUES (326, 'Sherpur-S', 44);
INSERT INTO public.location VALUES (327, 'Sreebordi', 44);
INSERT INTO public.location VALUES (328, 'Adamdighi', 45);
INSERT INTO public.location VALUES (329, 'Bogura-S', 45);
INSERT INTO public.location VALUES (330, 'Dhunot', 45);
INSERT INTO public.location VALUES (331, 'Dhupchancia', 45);
INSERT INTO public.location VALUES (332, 'Gabtali', 45);
INSERT INTO public.location VALUES (333, 'Kahaloo', 45);
INSERT INTO public.location VALUES (334, 'Nandigram', 45);
INSERT INTO public.location VALUES (335, 'Sariakandi', 45);
INSERT INTO public.location VALUES (336, 'Shajahanpur', 45);
INSERT INTO public.location VALUES (337, 'Sherpur', 45);
INSERT INTO public.location VALUES (338, 'Shibganj', 45);
INSERT INTO public.location VALUES (339, 'Sonatala', 45);
INSERT INTO public.location VALUES (340, 'Bholahat', 46);
INSERT INTO public.location VALUES (341, 'Gomostapur', 46);
INSERT INTO public.location VALUES (342, 'Nachol', 46);


--
-- Data for Name: accommodation; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.accommodation VALUES (3, 'Best Western Heritage', 4.5, 2, 5700, 'Hotel', 89, 5, 'Modern', 'Y', 'Y', 'Y', 'Y', 'Y', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3714.3633277524623!2d91.98088547343757!3d21.41495952321485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc87e2df2dbf5%3A0xd179d3257ac5106!2sBest%20Western%20Heritage!5e0!3m2!1sen!2sbd!4v1708521892711!5m2!1sen!2sbd', 'https://cf.bstatic.com/xdata/images/hotel/max1280x900/481845535.jpg?k=1009d7762face113cfbbf4d488a39618ba6af5f3227b189de5906e6ae59627ca&o=&hp=1', 'https://cf.bstatic.com/xdata/images/hotel/max1280x900/481847780.jpg?k=ce9382e02858589ceb54e37302a0944687b8ffc2ed33ab8f6d266396684a4d32&o=&hp=1', 'https://cf.bstatic.com/xdata/images/hotel/max1280x900/481849130.jpg?k=7c03cd6bdaf63e035409469f5d8d69c4ddbdcaa0cc2e82299f3632ec16374654&o=&hp=1', 'https://cf.bstatic.com/xdata/images/hotel/max1280x900/481849979.jpg?k=385c8071586e7470dc6f64ada8d28f857b5078f6ba10fb6c10c2e4496971b2cb&o=&hp=1', 'Heritage Hotel, 173-01 Bypass, Road Kolatoli Rd, 4700', 'A 5-minute walk from Kolatoli Beach, this modern hotel in a contemporary building on leafy grounds is 5 km from Cox''s Bazar Airport and 8 km from the Himchori Waterfall.
Straightforward rooms with floor-to-ceiling windows offer flat-screen TVs and balconies; some have bay views. Upgraded rooms add sitting areas, while suites provide minibars and separate living rooms. Room service is available 24/7. Wi-Fi is available.
Breakfast and welcome drinks are complimentary. There are also 4 eateries, including an airy lobby cafe and a polished BBQ restaurant. Other amenities consist of a rooftop pool and gardens.', '01777744004', 'https://www.facebook.com/BestWesternHeritage', 'https://www.bwheritagehotel.com/', 'reservation@bwheritagehotel.com');
INSERT INTO public.accommodation VALUES (1, 'Hotel Sea Uttara', 3.9, 4, 3533, 'Hotel', 89, 3, 'Modern', 'Y', 'Y', 'Y', 'N', 'N', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29713.252122220198!2d91.96278005641615!3d21.423092175477947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc88735155555%3A0x62b4952cd3f7551d!2sHotel%20Sea%20Uttara%2C%20Coxs%20Bazar!5e0!3m2!1sen!2sbd!4v1708385617766!5m2!1sen!2sbd', 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/118799836.jpg?k=4f37f0127557f5a164fd4b941c3ccc3f220b5609fa34b99d23d8f8acbd37a64d&o=&hp=1', 'https://cf.bstatic.com/xdata/images/hotel/max1280x900/118799842.jpg?k=670bb600138805d1b3912ac9295da13e877b5300f0ab06ce9a50a40edd6e22dc&o=&hp=1', 'https://cf.bstatic.com/xdata/images/hotel/max1280x900/118799807.jpg?k=8c9c0fae5673a7b33138734f1bea961053970c5df03d65649c1801fa29360a3a&o=&hp=1', 'https://cf.bstatic.com/xdata/images/hotel/max1280x900/118799804.jpg?k=d7453a2dab278fffeb6398069e37a9ae90fd27c9b9a30477c3cc627a079e2b61&o=&hp=1', 'Kolatoli Shark Point, Dolphin Circle Beach Road, New Beach Rd, Cox''s Bazar 4700', 'In a bustling area with multiple eateries, this casual hotel is a 4-minute walk from Kolatoli Beach along the Bay of Bengal. It''s 5 km from Cox''s Bazar Airport and 10 km from Himchari National Park.
The unassuming rooms have Wi-Fi, flat-screen TVs and minibars, as well as balconies. Upgraded rooms offer bay views. Suites add separate living rooms. Room service is available 24/7.
An airy, unpretentious restaurant features floor-to-ceiling windows. Breakfast and an airport shuttle are available.', '01875000020', 'https://www.facebook.com/hotelseauttara', 'https://www.seauttara.com/', 'seauttara@gmail.com');
INSERT INTO public.accommodation VALUES (2, 'Hotel Sea Crown', 5.0, 2, 3075, 'Hotel', 89, 4, 'Modern', 'Y', 'Y', 'Y', 'Y', 'N', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29714.909576074566!2d91.94741111083982!3d21.414945000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc880b3631a61%3A0x2006f2e9cab8e8cc!2sHotel%20Sea%20Crown!5e0!3m2!1sen!2sbd!4v1708386311854!5m2!1sen!2sbd', 'https://cf.bstatic.com/xdata/images/hotel/max1280x900/120397144.jpg?k=ca74ce65d75e5c0abe4a14b79923353a5920164cefb9160580b06868c236c4cc&o=&hp=1', 'https://cf.bstatic.com/xdata/images/hotel/max1280x900/120396616.jpg?k=c53be2484544448a07240b56428e32db9bed56458109baf3eacd8f9ca1a2d91e&o=&hp=1', 'https://cf.bstatic.com/xdata/images/hotel/max1280x900/120398415.jpg?k=808f1d269f44e6e0a5c928608fe0cbfe8129e4b817b61b5f9fa7b07baba2a9ea&o=&hp=1', 'https://cf.bstatic.com/xdata/images/hotel/max1280x900/120397688.jpg?k=5ae8df59c38bc3ff4e844038588ca17ab4bc2eec4c181fd3a30cfc120bb0f86f&o=&hp=1', 'CX7M+WCR Marine Drive, New Beach Rd, Cox''s Bazar 4700', 'Across the street from Kolatoli Beach on the Bay of Bengal, this relaxed hotel is 8 km from the Himchori Waterfall.
Basic rooms feature TVs and Wi-Fi. Upgraded rooms add balconies and flat-screens, and many have bay views. Suites add living areas, with upgraded rooms offering kitchenettes and dining areas. Room service is available 24/7.
A breakfast buffet is offered and served in an unfussy restaurant. Other amenities include a pool table and BBQ facilities. A generator is on-site. Secured parking is available.', '01833331705', 'https://www.facebook.com/hotelseacrown', 'https://hotelseacrownbd.com/', '
reservation@hotelseacrownbd.com');


--
-- Data for Name: trip; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: booking; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: accommodation_booking; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: accommodation_wishlist; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: airport; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.airport VALUES (1, 'Hazrat Shahjalal International Airport', 'DAC', 504);
INSERT INTO public.airport VALUES (2, 'Shah Amanat International Airport', 'CGP', 502);
INSERT INTO public.airport VALUES (3, 'Osmani International Airport', 'ZYL', 491);
INSERT INTO public.airport VALUES (4, 'Shah Makhdum Airport', 'RJH', 510);
INSERT INTO public.airport VALUES (5, 'Cox''s Bazar International Airport', 'CXB', 83);
INSERT INTO public.airport VALUES (6, 'Jashore Airport', 'JSR', 250);
INSERT INTO public.airport VALUES (7, 'Saidpur Airport', 'SPD', 434);
INSERT INTO public.airport VALUES (8, 'Barishal Airport', 'BZL', 501);


--
-- Data for Name: place_type; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.place_type VALUES (1, 'Mountains');
INSERT INTO public.place_type VALUES (2, 'Lakes');
INSERT INTO public.place_type VALUES (3, 'Beaches');
INSERT INTO public.place_type VALUES (4, 'Forests');
INSERT INTO public.place_type VALUES (5, 'Hill Tracks');
INSERT INTO public.place_type VALUES (6, 'Tea Gardens');
INSERT INTO public.place_type VALUES (7, 'Historical Places');


--
-- Data for Name: destination; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.destination VALUES (1, 'Ahsan Manzil Museum', 'It was formerly the residence and seat of the Nawab of Dhaka and has been designated an Old Dhaka Heritage Site', 'Historical Architectures', 'Excellent', 'Dress Modestly, Stay Hydrated', 'https://tse3.mm.bing.net/th?id=OIP.j1qLoFJBCf0ddHHLYmHxcgHaE8&pid=Api&P=0&h=220', 4.0, 505, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3653.088000385254!2d90.40345787389097!3d23.70855129038441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b9047a855555%3A0xdb6be1e307885b57!2sAhsan%20Manzil%20Museum!5e0!3m2!1sen!2sbd!4v1709981158831!5m2!1sen!2sbd', 'https://tse1.explicit.bing.net/th?id=OIP.zGK7RwTQa3Z9RxpRA2a76AHaEH&pid=Api&P=0&h=220', 'https://www.discoverwalks.com/blog/wp-content/uploads/2022/07/640px-__01.jpg', 'https://photos1.blogger.com/x/blogger/7702/1941/1600/478865/ahsan%20manzil%2012.jpg');
INSERT INTO public.destination VALUES (2, 'Cox''s Bazar', 'Cox''s Bazar is a famous beach town in southeastern Bangladesh.', 'Inani Beach, Himchari National Park', 'Tropical climate with monsoon season from June to October.', 'Pack sunscreen and light clothing.', 'https://tbbd-flight.s3.ap-southeast-1.amazonaws.com/blogiJR0K1sWVNFzinGC_l4r3IdsVLyxZfkr.jpg', 4.0, 89, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29712.144669114798!2d91.94958618026531!3d21.428534190081102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc868716d4925%3A0xcd3ada60adda3a3b!2sCox''s%20Bazar%20Beach!5e0!3m2!1sen!2sbd!4v1708381120811!5m2!1sen!2sbd', 'https://awalkintheworld.com/wp-content/uploads/2022/05/coxs-bazar-sunset-1024x461.jpg', 'https://cdn.getyourguide.com/img/tour/64620bb85e0d4.png/145.jpg', 'https://awalkintheworld.com/wp-content/uploads/2020/10/sunset-coxs-bazar-1024x548.jpg');
INSERT INTO public.destination VALUES (3, 'Sundarbans', 'The Sundarbans is the largest mangrove forest in the world.', 'Royal Bengal Tigers, diverse wildlife', 'Subtropical climate with high humidity.', 'Wear mosquito repellent and explore with a guide.', 'https://i.natgeofe.com/n/a50f7239-ff6d-4874-9448-25d94d8d1c80/sundarbans-bangladesh_16x9.jpg?w=1200', 4.4, 239, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d946892.3538366939!2d88.62742687620992!3d22.019039702266472!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a004caac2c7b315%3A0x4716abcfbb16c93c!2sSundarbans!5e0!3m2!1sen!2sbd!4v1706355188038!5m2!1sen!2sbd', 'https://upload.wikimedia.org/wikipedia/commons/2/23/Sundarban_Tiger.jpg', 'https://i2.wp.com/discoverholidaysbd.com/wp-content/uploads/2019/07/Largest-Mangrove-Forest-in-the-World.jpg?fit=820%2C500&ssl=1', 'https://www.bdstall.com/asset/magazine-image/922_giant.jpg');
INSERT INTO public.destination VALUES (4, 'Srimangal', 'Known as the "Tea Capital of Bangladesh," Srimangal is famous for its tea gardens.', 'Lawachara National Park, Seven Layer Tea', 'Subtropical climate with moderate rainfall.', 'Visit tea estates and taste different teas.', 'https://cosmosgroup.sgp1.digitaloceanspaces.com/news/9782559_best%20tea%20gardens%20Bangladesh.jpg', 4.8, 468, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29087.567079525645!2d91.70444708692563!3d24.313522620218137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37517a7a9ac91745%3A0x50f827893a88c955!2sSreemangal!5e0!3m2!1sen!2sbd!4v1706355312902!5m2!1sen!2sbd', 'https://steemitimages.com/DQmPA3JoBh8TFcEAZwuPrbAM2WR8UBExKdP7jNzUcZAPBBV/srimongol.jpg', 'https://media.licdn.com/dms/image/C4E12AQHz6QcbqNdcbg/article-cover_image-shrink_720_1280/0/1520141734157?e=2147483647&v=beta&t=BG4R0opMUEA6TALsLx8MLB7MW2BDLNvs_bttyzUTWow', 'https://dailyasianage.com/library/2017/04/24/1493013021_5.jpg');
INSERT INTO public.destination VALUES (6, 'Saint Martin''s Island', 'Saint Martin''s Island is the only coral island in Bangladesh.', 'Chera Dwip, Marine Life', 'Tropical climate with monsoon season from June to October.', 'Enjoy fresh seafood and plan for boat rides.', 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Sunset_at_Saint_Martin.jpg', 4.5, 88, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7626813.915550053!2d92.34037452832547!3d21.031476303641305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30ae233bf4f99bcb%3A0x600777e96eb96b57!2sSaint%20Martin''s%20Island%20West%20Beach,%20Bangladesh!5e0!3m2!1sen!2sbd!4v1708383561206!5m2!1sen!2sbd', 'https://awalkintheworld.com/wp-content/uploads/2020/08/saint-martins-island-bangladesh-1024x576.jpg', 'https://www.tbsnews.net/sites/default/files/styles/amp_metadata_content_image_min_696px_wide/public/images/2021/10/29/saint_martin_rashed_kabir.jpg', 'https://www.shutterstock.com/image-photo/tropical-st-martin-beach-sand-600nw-1751509040.jpg');
INSERT INTO public.destination VALUES (7, 'Kuakata', 'Known as the "Daughter of the Sea," Kuakata is a unique beach with both sunrise and sunset views.', 'Gangamati Reserved Forest, Kuakata Sea Beach', 'Tropical climate with monsoon season from June to October.', 'Experience the panoramic views of both sunrise and sunset.', 'https://www.kuakatatours.com/wp-content/uploads/2012/04/kuakata-sea-beach.jpg', 3.9, 32, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118514.30566015706!2d90.09303476817682!3d21.835459698003994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30aa62836f83b573%3A0x31e7fec84916471!2sKuakata%20Sea%20Beach!5e0!3m2!1sen!2sbd!4v1708362362427!5m2!1sen!2sbd', 'https://upload.wikimedia.org/wikipedia/commons/9/99/Kuakata_SeaBeach.jpg', 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Kuakata_sea_beach_evening.jpg', 'https://cosmosgroup.sgp1.digitaloceanspaces.com/news/6230816_Kuakata_beach_Bangladesh.jpg');
INSERT INTO public.destination VALUES (8, 'Bandarban', 'Bandarban is a hill district known for its scenic beauty and indigenous communities.', 'Nilgiri Hills, Boga Lake', 'Subtropical climate with cool temperatures.', 'Trekking opportunities and experience indigenous cultures.', 'https://cosmosgroup.sgp1.digitaloceanspaces.com/news/y8eC0WBzPEEVyKIGGjcM3zKIgirEYLTLvioF3GaP.jpeg', 4.0, 53, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59103.12218997553!2d92.17536645727786!3d22.20419118561907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30ad6a188414e62b%3A0xa4c3198f81ba90d0!2sBandarban!5e0!3m2!1sen!2sbd!4v1708380895066!5m2!1sen!2sbd', 'https://i.natgeofe.com/n/5d9042f9-60cf-426f-8a47-499adfd1d674/46130.jpg?w=1084.125&h=813.75', 'https://www.bangladeshtravelandtours.com/wp-content/uploads/2023/04/30.jpg', 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Amiakhum_falls%2C_bandarban_%2C_Bangladesh.jpg');
INSERT INTO public.destination VALUES (9, 'Lalbagh', 'Lalbagh is a neighbourhood of the Dhaka District in the division of Dhaka, Bangladesh', 'Tomb of Bibi Pari', 'Good', 'Dress Modestly, Stay Hydrated', 'https://tse4.mm.bing.net/th?id=OIP._-m5djx8LS0Mz-v0qAD5ygHaEK&pid=Api&P=0&h=220', 3.9, 505, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58443.78105097272!2d90.31583841418473!3d23.721108622233583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8dea7c18969%3A0xc4c2a51658e86152!2sLalbagh%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1709979337237!5m2!1sen!2sbd', 'https://2.bp.blogspot.com/-Y-NZC5WbozE/WIb7_w7mj_I/AAAAAAAAAmg/yPlTXmchBawSephrAu5eGCjzuBKldWOCACLcB/s1600/Lalbagh%2BFort.jpg', 'https://tse2.mm.bing.net/th?id=OIP.rf7p2jJMrPN1gIpVYN_k3gHaE7&pid=Api&P=0&h=220', 'https://tse3.mm.bing.net/th?id=OIP.MvgyKkpbPmy4NtTJdwoZ1AHaE9&pid=Api&P=0&h=220');
INSERT INTO public.destination VALUES (5, 'Rangamati', 'Rangamati is a picturesque hill district with stunning landscapes and water bodies.', 'Kaptai Lake, Hanging Bridge', 'Subtropical climate with moderate temperatures.', 'Take a boat ride on Kaptai Lake.', 'https://upload.wikimedia.org/wikipedia/commons/9/95/Kaptai_Lake_%2819833365911%29.jpg', 4.0, 145, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58916.71138165585!2d92.13193476127317!3d22.642807304571523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3752b5a7b4c418f9%3A0xa63c343bd4a12112!2sRangamati!5e0!3m2!1sen!2sbd!4v1706355406725!5m2!1sen!2sbd', 'https://www.thegolfhousebd.com/wp-content/uploads/2021/12/222222.png', 'https://media-cdn.tripadvisor.com/media/photo-s/19/48/d7/a9/star-land.jpg', 'https://media.istockphoto.com/id/477090986/photo/shuvolong-waterfalls.jpg?s=612x612&w=0&k=20&c=TmG7CEd1tWRk_zSLy80AukoRfQ3YJFH-Y40co-7rBBc=');


--
-- Data for Name: destination_type; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.destination_type VALUES (2, 2, 1);
INSERT INTO public.destination_type VALUES (5, 4, 5);
INSERT INTO public.destination_type VALUES (1, 1, 7);
INSERT INTO public.destination_type VALUES (3, 2, 3);
INSERT INTO public.destination_type VALUES (4, 3, 4);
INSERT INTO public.destination_type VALUES (6, 4, 6);
INSERT INTO public.destination_type VALUES (7, 5, 1);
INSERT INTO public.destination_type VALUES (8, 6, 3);
INSERT INTO public.destination_type VALUES (9, 7, 3);
INSERT INTO public.destination_type VALUES (10, 8, 1);
INSERT INTO public.destination_type VALUES (11, 9, 7);


--
-- Data for Name: destination_wishlist; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: flight; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.flight VALUES (41, 'US-Bangla', 6, 5, '1970-01-01 07:30:00', '1970-01-01 08:35:00', 'https://tds-images.thedailystar.net/sites/default/files/feature/images/us-bangla_airlines_1.jpg', 'Round Trip', '1970-01-01 16:30:00', '1970-01-01 17:35:00', 14000, 20000, 32000);
INSERT INTO public.flight VALUES (42, 'Air Astra', 7, 6, '1970-01-01 16:30:00', '1970-01-01 17:35:00', 'https://tds-images.thedailystar.net/sites/default/files/images/2022/11/16/air-astra.jpg', 'Round Trip', '1970-01-01 16:30:00', '1970-01-01 17:35:00', 16000, 22000, 34000);
INSERT INTO public.flight VALUES (43, 'Novo Air', 8, 7, '1970-01-01 07:30:00', '1970-01-01 08:35:00', 'https://images.prothomalo.com/prothomalo-english/import/media/2017/08/13/559637ec8bcd77fa8fd6ad3377b37649-novoair.jpg?w=1200&h=675', 'Round Trip', '1970-01-01 16:30:00', '1970-01-01 17:35:00', 18000, 24000, 36000);
INSERT INTO public.flight VALUES (44, 'Air Astra', 1, 2, '1970-01-01 14:30:00', '1970-01-01 15:25:00', 'https://tds-images.thedailystar.net/sites/default/files/images/2022/11/16/air-astra.jpg', 'One Way', NULL, NULL, 6000, 9000, 15000);
INSERT INTO public.flight VALUES (45, 'Air Astra', 1, 2, '1970-01-01 07:40:00', '1970-01-01 08:45:00', 'https://tds-images.thedailystar.net/sites/default/files/images/2022/11/16/air-astra.jpg', 'One Way', NULL, NULL, 6000, 9000, 15000);
INSERT INTO public.flight VALUES (46, 'US-Bangla', 1, 2, '1970-01-01 07:30:00', '1970-01-01 08:35:00', 'https://tds-images.thedailystar.net/sites/default/files/feature/images/us-bangla_airlines_1.jpg', 'One Way', NULL, NULL, 8000, 11000, 17000);
INSERT INTO public.flight VALUES (47, 'Air Astra', 1, 2, '1970-01-01 16:30:00', '1970-01-01 17:35:00', 'https://tds-images.thedailystar.net/sites/default/files/images/2022/11/16/air-astra.jpg', 'Round Trip', '1970-01-01 16:30:00', '1970-01-01 17:35:00', 6000, 9000, 15000);
INSERT INTO public.flight VALUES (48, 'Novo Air', 1, 2, '1970-01-01 07:30:00', '1970-01-01 08:35:00', 'https://images.prothomalo.com/prothomalo-english/import/media/2017/08/13/559637ec8bcd77fa8fd6ad3377b37649-novoair.jpg?w=1200&h=675', 'One Way', NULL, NULL, 7000, 10000, 16000);
INSERT INTO public.flight VALUES (49, 'US-Bangla', 1, 2, '1970-01-01 09:00:00', '1970-01-01 10:05:00', 'https://tds-images.thedailystar.net/sites/default/files/feature/images/us-bangla_airlines_1.jpg', 'One Way', NULL, NULL, 8000, 11000, 17000);
INSERT INTO public.flight VALUES (50, 'Biman Bangladesh', 1, 2, '1970-01-01 15:30:00', '1970-01-01 16:35:00', 'https://logowik.com/content/uploads/images/biman-bangladesh-airlines2895.jpg', 'One Way', NULL, NULL, 9000, 12000, 18000);
INSERT INTO public.flight VALUES (51, 'Air Astra', 1, 5, '1970-01-01 07:40:00', '1970-01-01 08:35:00', 'https://tds-images.thedailystar.net/sites/default/files/images/2022/11/16/air-astra.jpg', 'One Way', NULL, NULL, 6000, 9000, 15000);
INSERT INTO public.flight VALUES (52, 'US-Bangla', 1, 5, '2024-03-10 18:00:00', '2024-03-12 20:08:00', 'https://tds-images.thedailystar.net/sites/default/files/feature/images/us-bangla_airlines_1.jpg', 'One Way', NULL, NULL, 8000, 10000, 16000);
INSERT INTO public.flight VALUES (53, 'Air Astra', 2, 1, '1970-01-01 14:30:00', '1970-01-01 15:25:00', 'https://tds-images.thedailystar.net/sites/default/files/images/2022/11/16/air-astra.jpg', 'One Way', NULL, NULL, 6000, 9000, 15000);
INSERT INTO public.flight VALUES (54, 'Air Astra', 3, 2, '1970-01-01 07:40:00', '1970-01-01 08:45:00', 'https://tds-images.thedailystar.net/sites/default/files/images/2022/11/16/air-astra.jpg', 'One Way', NULL, NULL, 6000, 9000, 15000);
INSERT INTO public.flight VALUES (55, 'US-Bangla', 8, 3, '1970-01-01 07:30:00', '1970-01-01 08:35:00', 'https://tds-images.thedailystar.net/sites/default/files/feature/images/us-bangla_airlines_1.jpg', 'One Way', NULL, NULL, 8000, 11000, 17000);
INSERT INTO public.flight VALUES (56, 'Air Astra', 5, 8, '1970-01-01 16:30:00', '1970-01-01 17:35:00', 'https://tds-images.thedailystar.net/sites/default/files/images/2022/11/16/air-astra.jpg', 'One Way', NULL, NULL, 6000, 9000, 15000);
INSERT INTO public.flight VALUES (57, 'Novo Air', 2, 3, '1970-01-01 07:30:00', '1970-01-01 08:35:00', 'https://images.prothomalo.com/prothomalo-english/import/media/2017/08/13/559637ec8bcd77fa8fd6ad3377b37649-novoair.jpg?w=1200&h=675', 'One Way', NULL, NULL, 7000, 10000, 16000);
INSERT INTO public.flight VALUES (58, 'US-Bangla', 2, 8, '1970-01-01 09:00:00', '1970-01-01 10:05:00', 'https://tds-images.thedailystar.net/sites/default/files/feature/images/us-bangla_airlines_1.jpg', 'One Way', NULL, NULL, 8000, 11000, 17000);
INSERT INTO public.flight VALUES (59, 'Biman Bangladesh', 2, 5, '1970-01-01 15:30:00', '1970-01-01 16:35:00', 'https://logowik.com/content/uploads/images/biman-bangladesh-airlines2895.jpg', 'One Way', NULL, NULL, 9000, 12000, 18000);
INSERT INTO public.flight VALUES (60, 'Air Astra', 3, 5, '1970-01-01 07:40:00', '1970-01-01 08:35:00', 'https://tds-images.thedailystar.net/sites/default/files/images/2022/11/16/air-astra.jpg', 'One Way', NULL, NULL, 6000, 9000, 15000);
INSERT INTO public.flight VALUES (61, 'Biman Bangladesh', 3, 5, '1970-01-01 15:30:00', '1970-01-01 16:35:00', 'https://logowik.com/content/uploads/images/biman-bangladesh-airlines2895.jpg', 'One Way', NULL, NULL, 9000, 12000, 18000);


--
-- Data for Name: flight_booking; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: gifts_and_coupons; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: restaurant; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.restaurant VALUES (1, 'Mermaid Cafe', 'Seafood', 4.7, 89, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29713.624727556853!2d91.94227941083983!3d21.421260900000018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc87ce9c0fb4d%3A0x83536e3b5f20191b!2sMermaid%20Cafe!5e0!3m2!1sen!2sbd!4v1708931328639!5m2!1sen!2sbd', 4, 'https://scontent.fdac149-1.fna.fbcdn.net/v/t39.30808-6/330794646_149991414606758_778967282755106023_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=9534ce&_nc_eui2=AeFGuc8AGfoj5rAAvL0LF3AM7_AoN6STrUrv8Cg3pJOtSlJR-1H4VONH5H10L3IoCyGHC_IcjzI3o_lzpZSCjb5F&_nc_ohc=6TTPn_ufSd0AX-TMoJ9&_nc_ht=scontent.fdac149-1.fna&oh=00_AfABODHfxJdfV2znvjMj6Y2UaBPfGZxX1KSVYG3PCqxXTQ&oe=65E0D5A2', 'https://i.ytimg.com/vi/PsMMk2gQWo4/maxresdefault.jpg', 'https://media-cdn.tripadvisor.com/media/photo-s/0e/ae/6e/8b/inside-mermaid-cafe.jpg', 'https://live.staticflickr.com/6187/6059784851_4e57be4a0d_b.jpg', '01841416461', 'Near Dragon Mart, Kolatoli Road, Sugandha Beach Sea In point, Hotel Motel, Cox''s Bazar 4700', 'https://www.facebook.com/mermaidcafe/?ref=page_internal', 'https://mermaidcafechillng.wixsite.com/mermaidcafe?fbclid=IwAR2mU_EN3K6Ay9feM-y0rt4jBvbrTTM-XPaojPi7Z-3wemzkyIVlncmIQeo', '
mermaidcafechillngrill@gmail.com', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', '$$', 1000);
INSERT INTO public.restaurant VALUES (2, 'Salt Bistro & Cafe', 'Seafood', 4.3, 89, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29712.37197875065!2d91.94158761083985!3d21.427417300000013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc8655a31efcb%3A0x5da86c8f26b26ec3!2sSalt%20Bistro%20%26%20Cafe!5e0!3m2!1sen!2sbd!4v1708940507424!5m2!1sen!2sbd', 5, 'https://scontent.fdac149-1.fna.fbcdn.net/v/t39.30808-6/293115725_1475127639600956_8645499406583607509_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=3635dc&_nc_eui2=AeGGRe7jX1SX66RKxRJSJdSvjPJSaA9sCtiM8lJoD2wK2D4iu0jFl54330gH2K10sn17T4B5Fxze59MevrXO-A15&_nc_ohc=4mOaP0UCCbUAX-OLndY&_nc_ht=scontent.fdac149-1.fna&oh=00_AfCxLJWF4buCQ7pEXS2gdReHaUxSeUk5mVHrzEAa8iSc2g&oe=65E0DFB2', 'https://media-cdn.tripadvisor.com/media/photo-p/17/b2/97/e5/linguine-tossed-in-beautiful.jpg', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/21/8a/67/44/it-is-almost-impossible.jpg?w=1200&h=-1&s=1', 'https://theprestige.global/wp-content/uploads/2023/05/DSC04395.jpg', '01816155651', '10, Kalatoli, Hotel-Motel Zone, Cox''s Bazar 4700', 'https://www.facebook.com/SaltCoxsBazar/', 'https://saltbistroandcafe.wordpress.com/', '
saltbistroandcafe@gmail.com', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', '$$$', 800);
INSERT INTO public.restaurant VALUES (3, 'Handi', 'Indian', 3.9, 89, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3714.0441321382445!2d91.97171617381042!3d21.42751027396639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc865f13d8687%3A0xf97cee3a853b3a07!2sHandi%20(Cox''s%20Bazar%20Branch)!5e0!3m2!1sen!2sbd!4v1709597503316!5m2!1sen!2sbd', 3, 'https://scontent.fdac149-1.fna.fbcdn.net/v/t39.30808-6/351304036_280780334294620_7297180796651993526_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=3635dc&_nc_eui2=AeHeYB1409M09JcsOxDMVNmZdn1eHKN1_RV2fV4co3X9Fa3P8IaZsW1gRO3mQebKa2gN9nQEamEjqK8kHy3JaM2B&_nc_ohc=zblDvYtqzp4AX8CHJqU&_nc_ht=scontent.fdac149-1.fna&oh=00_AfAyi99IM-D3AvXK-ScjH7rcNzddyRI0L1V1ljDPdXzZsg&oe=65E11803', 'https://i.ytimg.com/vi/PsMMk2gQWo4/maxresdefault.jpg', 'https://www.mawbiz.com.bd/application/views/module/product_image/handi-restaurant-cox-s-bazar_1689435473_1.jpg', 'https://pbs.twimg.com/media/C3AJFuAWIAAWGNz.jpg', '01886342628', 'Hotel Ovishar, Sea Laboni Point, Laboni Beach Rd, Cox''s Bazar 4700', 'https://www.facebook.com/profile.php?id=100064343521589', 'https://handi.com/', 'handi.gulshan9900@gmail.com', 'Y', 'N', 'N', 'Y', 'Y', 'Y', '$$', 500);


--
-- Data for Name: restaurant_booking; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: restaurant_wishlist; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: trip_destination; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Name: accommodation_accommodation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.accommodation_accommodation_id_seq', 1, false);


--
-- Name: accommodation_booking_accommodation_booking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.accommodation_booking_accommodation_booking_id_seq', 1, false);


--
-- Name: accommodation_wishlist_wishlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.accommodation_wishlist_wishlist_id_seq', 1, false);


--
-- Name: agent_agent_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.agent_agent_id_seq', 1, false);


--
-- Name: airport_airport_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.airport_airport_id_seq', 1, false);


--
-- Name: booking_booking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.booking_booking_id_seq', 1, true);


--
-- Name: customer_customer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.customer_customer_id_seq', 1, false);


--
-- Name: customer_preference_customer_preference_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.customer_preference_customer_preference_id_seq', 1, false);


--
-- Name: destination_destination_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.destination_destination_id_seq', 1, false);


--
-- Name: destination_type_destination_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.destination_type_destination_type_id_seq', 1, false);


--
-- Name: destination_wishlist_wishlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.destination_wishlist_wishlist_id_seq', 1, false);


--
-- Name: district_district_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.district_district_id_seq', 1, false);


--
-- Name: division_division_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.division_division_id_seq', 1, false);


--
-- Name: flight_booking_flight_booking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.flight_booking_flight_booking_id_seq', 1, false);


--
-- Name: flight_flight_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.flight_flight_id_seq', 1, false);


--
-- Name: gifts_and_coupons_coupon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.gifts_and_coupons_coupon_id_seq', 1, false);


--
-- Name: location_location_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.location_location_id_seq', 1, false);


--
-- Name: notification_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notification_notification_id_seq', 1, false);


--
-- Name: payment_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payment_payment_id_seq', 1, false);


--
-- Name: place_type_place_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.place_type_place_type_id_seq', 1, false);


--
-- Name: rating_rating_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rating_rating_id_seq', 1, false);


--
-- Name: restaurant_booking_restaurant_booking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.restaurant_booking_restaurant_booking_id_seq', 1, false);


--
-- Name: restaurant_restaurant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.restaurant_restaurant_id_seq', 1, false);


--
-- Name: restaurant_wishlist_wishlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.restaurant_wishlist_wishlist_id_seq', 1, false);


--
-- Name: review_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.review_review_id_seq', 1, false);


--
-- Name: trip_destination_trip_destination_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.trip_destination_trip_destination_id_seq', 1, false);


--
-- Name: trip_trip_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.trip_trip_id_seq', 1, false);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, false);


--
-- PostgreSQL database dump complete
--

\unrestrict Xwa0DfkefsjHzNEGsWfLND2AwOXTnUCjhW7k0hlV2Nl0qgBdhefIj6qX7H3ndKD

