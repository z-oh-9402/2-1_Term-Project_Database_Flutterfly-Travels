--
-- PostgreSQL database dump
--

\restrict BCN5WbeWPOoPuwLK3k0iW3qyyeaZpMbkWb7arHgaM7nenNB7RQ2x2arAPgU7Omg

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

INSERT INTO public.accommodation VALUES (3, 'Best Western Heritage', 0.0, 2, 5700, 'Hotel', 89, 5, 'Modern', 'Y', 'Y', 'Y', 'Y', 'Y', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3714.3633277524623!2d91.98088547343757!3d21.41495952321485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc87e2df2dbf5%3A0xd179d3257ac5106!2sBest%20Western%20Heritage!5e0!3m2!1sen!2sbd!4v1708521892711!5m2!1sen!2sbd', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/3-best-western-heritage/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/3-best-western-heritage/image1.jpg', NULL, NULL, 'Heritage Hotel, 173-01 Bypass, Road Kolatoli Rd, 4700', 'A 5-minute walk from Kolatoli Beach, this modern hotel in a contemporary building on leafy grounds is 5 km from Cox''s Bazar Airport and 8 km from the Himchori Waterfall.
Straightforward rooms with floor-to-ceiling windows offer flat-screen TVs and balconies; some have bay views. Upgraded rooms add sitting areas, while suites provide minibars and separate living rooms. Room service is available 24/7. Wi-Fi is available.
Breakfast and welcome drinks are complimentary. There are also 4 eateries, including an airy lobby cafe and a polished BBQ restaurant. Other amenities consist of a rooftop pool and gardens.', '01777744004', 'https://www.facebook.com/BestWesternHeritage', 'https://www.bwheritagehotel.com/', 'reservation@bwheritagehotel.com', 0);
INSERT INTO public.accommodation VALUES (1, 'Hotel Sea Uttara', 0.0, 4, 3533, 'Hotel', 89, 3, 'Modern', 'Y', 'Y', 'Y', 'N', 'N', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29713.252122220198!2d91.96278005641615!3d21.423092175477947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc88735155555%3A0x62b4952cd3f7551d!2sHotel%20Sea%20Uttara%2C%20Coxs%20Bazar!5e0!3m2!1sen!2sbd!4v1708385617766!5m2!1sen!2sbd', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/1-hotel-sea-uttara/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/1-hotel-sea-uttara/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/1-hotel-sea-uttara/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/1-hotel-sea-uttara/image3.jpg', 'Kolatoli Shark Point, Dolphin Circle Beach Road, New Beach Rd, Cox''s Bazar 4700', 'In a bustling area with multiple eateries, this casual hotel is a 4-minute walk from Kolatoli Beach along the Bay of Bengal. It''s 5 km from Cox''s Bazar Airport and 10 km from Himchari National Park.
The unassuming rooms have Wi-Fi, flat-screen TVs and minibars, as well as balconies. Upgraded rooms offer bay views. Suites add separate living rooms. Room service is available 24/7.
An airy, unpretentious restaurant features floor-to-ceiling windows. Breakfast and an airport shuttle are available.', '01875000020', 'https://www.facebook.com/hotelseauttara', 'https://www.seauttara.com/', 'seauttara@gmail.com', 0);
INSERT INTO public.accommodation VALUES (2, 'Hotel Sea Crown', 0.0, 2, 3075, 'Hotel', 89, 4, 'Modern', 'Y', 'Y', 'Y', 'Y', 'N', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29714.909576074566!2d91.94741111083982!3d21.414945000000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc880b3631a61%3A0x2006f2e9cab8e8cc!2sHotel%20Sea%20Crown!5e0!3m2!1sen!2sbd!4v1708386311854!5m2!1sen!2sbd', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/2-hotel-sea-crown/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/2-hotel-sea-crown/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/2-hotel-sea-crown/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/2-hotel-sea-crown/image3.jpg', 'CX7M+WCR Marine Drive, New Beach Rd, Cox''s Bazar 4700', 'Across the street from Kolatoli Beach on the Bay of Bengal, this relaxed hotel is 8 km from the Himchori Waterfall.
Basic rooms feature TVs and Wi-Fi. Upgraded rooms add balconies and flat-screens, and many have bay views. Suites add living areas, with upgraded rooms offering kitchenettes and dining areas. Room service is available 24/7.
A breakfast buffet is offered and served in an unfussy restaurant. Other amenities include a pool table and BBQ facilities. A generator is on-site. Secured parking is available.', '01833331705', 'https://www.facebook.com/hotelseacrown', 'https://hotelseacrownbd.com/', '
reservation@hotelseacrownbd.com', 0);
INSERT INTO public.accommodation VALUES (4, 'InterContinental Dhaka', 0.0, 2, 12000, 'Hotel', 505, 5, 'Modern', 'Y', 'Y', 'N', 'Y', 'Y', 'https://maps.google.com/maps?q=InterContinental%20Dhaka%2C%201%20Minto%20Road%2C%20Ramna%2C%20Dhaka&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/4-intercontinental-dhaka/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/4-intercontinental-dhaka/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/4-intercontinental-dhaka/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/4-intercontinental-dhaka/image3.jpg', '1 Minto Road, Ramna (near Shahbag), Dhaka 1000', 'Five-star IHG hotel on Minto Road next to Ramna Park, about 3 km from Old Dhaka''s Ahsan Manzil and Lalbagh Fort. The building first opened in 1966 as the Hotel Inter-Continental Dacca, was later run as the Sheraton and then Ruposhi Bangla, and reopened as InterContinental Dhaka in December 2018 after a full renovation. It has around 226 rooms and suites, several restaurants, a temperature-controlled outdoor pool, a spa and a fitness centre. Parking and Wi-Fi are free for guests, while the buffet breakfast is charged separately on room-only rates.', NULL, NULL, 'https://www.ihg.com/intercontinental/hotels/us/en/dhaka/dachb/hoteldetail', 'dhaka@intercontinental-dhaka.com', 0);
INSERT INTO public.accommodation VALUES (5, 'Hotel 71', 0.0, 2, 4200, 'Hotel', 505, 3, 'Modern', 'Y', 'Y', 'Y', 'N', 'N', 'https://maps.google.com/maps?q=Hotel%2071%2C%20Bijoy%20Nagar%2C%20Dhaka&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/5-hotel-71/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/5-hotel-71/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/5-hotel-71/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/5-hotel-71/image3.jpg', '176 Shaheed Syed Nazrul Islam Sarani (Old 47 Bijoy Nagar), Dhaka 1000', 'Three-star business hotel in Bijoy Nagar between Paltan and Kakrail, a short walk from Baitul Mukarram mosque and around 3 km from Old Dhaka. It opened in 2010 and was renovated in 2022, with 56 air-conditioned rooms ranging from single rooms to suites. The hotel has two restaurants, a coffee shop, a gym, sauna and massage room, conference halls and 24-hour room service. Its own website lists the Deluxe Twin from about Tk 4,200 a night including VAT and service charge.', '01750076933', 'https://www.facebook.com/hotel71bd/', 'https://hotel71.com.bd/', 'info@hotel71.com.bd', 0);
INSERT INTO public.accommodation VALUES (6, 'Asia Hotel & Resorts', 0.0, 2, 6000, 'Hotel', 505, 3, 'Modern', 'Y', 'Y', 'Y', 'N', 'Y', 'https://maps.google.com/maps?q=Asia%20Hotel%20%26%20Resorts%2C%2034%2F1%20Topkhana%20Road%2C%20Segunbagicha%2C%20Dhaka&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/6-asia-hotel-resorts/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/6-asia-hotel-resorts/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/6-asia-hotel-resorts/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/6-asia-hotel-resorts/image3.jpg', '34/1 Topkhana Road, Segunbagicha, Dhaka 1000', 'Three-star hotel on Topkhana Road in Segunbagicha, within walking distance of Baitul Mukarram and the National Stadium and a short ride from Old Dhaka. Opened in 2016 and refreshed in 2023, it offers deluxe single, twin and double rooms plus executive suites. Facilities include the Manipura restaurant, a cafe, a spa with sauna, a health club, banquet and conference halls, and 24-hour room service. The hotel says its breakfast buffet is complimentary for room guests.', '01844152844', 'https://www.facebook.com/AHRDhaka341/', 'https://asiahotel.com.bd/', 'info@asiahotel.com.bd', 0);
INSERT INTO public.accommodation VALUES (7, 'Grand Palace Hotel & Resorts Dhaka', 0.0, 2, 8500, 'Hotel', 505, 5, 'Modern', 'Y', 'Y', 'Y', 'Y', 'Y', 'https://maps.google.com/maps?q=Grand%20Palace%20Hotel%20%26%20Resorts%20Dhaka%2C%20Kakrail%2C%20Dhaka&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/7-grand-palace-hotel-resorts-dhaka/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/7-grand-palace-hotel-resorts-dhaka/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/7-grand-palace-hotel-resorts-dhaka/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/7-grand-palace-hotel-resorts-dhaka/image3.jpg', '22 S.A. Point, Kakrail, Ramna, Dhaka 1000', 'New upscale hotel in Kakrail that opened in January 2025, close to Ramna Park and Baily Road and a short drive from Old Dhaka. It has 103 rooms across standard deluxe, premium deluxe, super deluxe and executive suite categories. Guests have a rooftop swimming pool with city views, a gym and spa, an all-day dining restaurant, a fine-dining venue and a 24-hour coffee shop. Booking listings say a buffet breakfast is included, and reported room rates start at about USD 70.', '01713558911', NULL, NULL, 'front.dhk@grandpalacebd.com', 0);
INSERT INTO public.accommodation VALUES (8, 'Birishiri Agro Village', 0.0, 2, 8000, 'Resort', 315, 3, 'Eco', 'Y', 'Y', 'Y', 'N', 'N', 'https://maps.google.com/maps?q=Birishiri%20Agro%20Village%2C%20Durgapur%2C%20Netrokona&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/8-birishiri-agro-village/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/8-birishiri-agro-village/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/8-birishiri-agro-village/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/8-birishiri-agro-village/image3.jpg', 'Boligoan (Bhuligaon), Birishiri, Durgapur, Netrokona', 'Birishiri Agro Village is a small agri-tourism resort set on a working farm at Boligoan, a few kilometres from Birishiri in Durgapur upazila. Guests stay in air-conditioned couple and twin rooms and are served meals made largely from the farm''s own vegetables, fish, poultry and dairy. The resort also arranges fishing, farming activities, bonfire evenings and local day trips, and asks for advance booking because rooms are limited.', '01717374904', 'https://www.facebook.com/birishiritour/', NULL, NULL, 0);
INSERT INTO public.accommodation VALUES (9, 'Holy Haven Guest House', 0.0, 2, 1500, 'Guest House', 315, 2, 'Traditional', 'Y', 'Y', 'Y', 'N', 'N', 'https://maps.google.com/maps?q=Holy%20Haven%20Resort%2C%20Utrail%20Bazar%2C%20Birisiri%2C%20Durgapur&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/9-holy-haven-guest-house/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/9-holy-haven-guest-house/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/9-holy-haven-guest-house/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/9-holy-haven-guest-house/image3.jpg', 'Utrail Bazar, Birisiri, Durgapur 2420, Netrokona', 'Holy Haven Guest House is a small, recently opened guest house at Utrail Bazar in Birishiri, with guest rooms on the ground floor of a building whose upper floor holds an old church. Rooms are air-conditioned with attached bathrooms, and guests describe it as clean, secure and budget friendly. Parking and BBQ can be arranged, and the hosts provide breakfast and local fruit.', '01879220571', NULL, NULL, NULL, 0);
INSERT INTO public.accommodation VALUES (10, 'YMCA Guest House Birisiri', 0.0, 2, 1000, 'Guest House', 315, 1, 'Traditional', 'N', 'Y', 'N', 'N', 'N', 'https://maps.google.com/maps?q=YMCA%20Guest%20House%2C%20Birisiri%2C%20Durgapur%2C%20Netrokona&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/10-ymca-guest-house-birisiri/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/10-ymca-guest-house-birisiri/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/10-ymca-guest-house-birisiri/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/10-ymca-guest-house-birisiri/image3.jpg', 'YMCA Birisiri, Birisiri-Bhuligaon Road, Durgapur 2420, Netrokona', 'The YMCA Guest House is a long-running rest house run by the Young Men''s Christian Association on the Birisiri-Bhuligaon road, a few minutes'' walk from the local market. It offers simple AC, non-AC and dormitory rooms with hot showers, plus a front garden and a basketball court. There is no regular food service, so guests eat at nearby restaurants or arrange their own cooking or BBQ.', '01966980087', NULL, NULL, NULL, 0);
INSERT INTO public.accommodation VALUES (11, 'Bojra - The House Boat', 0.0, 3, 15000, 'Houseboat', 479, 3, 'Traditional', 'N', 'N', 'Y', 'N', 'N', 'https://maps.google.com/maps?q=Bojra%20-%20The%20House%20Boat%2C%20Sunamganj&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/11-bojra-the-house-boat/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/11-bojra-the-house-boat/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/11-bojra-the-house-boat/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/11-bojra-the-house-boat/image3.jpg', 'Boards in Sunamganj town for Tanguar Haor trips; booking office: House 42, Road 05, Block E, Banasree, Dhaka', 'Bojra - The House Boat runs a fleet of traditional-style wooden houseboats on two-day, one-night trips to Tanguar Haor, starting and ending in Sunamganj town. Its boats have six to eleven cabins and carry roughly 18 to 40 guests, and packages include the overnight stay plus two breakfasts, two lunches, a dinner, tea and seasonal fruit. Trips usually cover the watchtower area, Niladri Lake and other spots near the Meghalaya border.', '01610563902', 'https://www.facebook.com/bojra21/', 'https://www.bojrahouseboat.com/', 'bojra21@gmail.com', 0);
INSERT INTO public.accommodation VALUES (12, 'Nabab - The Haor Villa (Houseboat)', 0.0, 2, 13000, 'Houseboat', 479, 3, 'Traditional', 'N', 'N', 'Y', 'N', 'N', 'https://maps.google.com/maps?q=Nabab%20-%20The%20Haor%20Villa%20houseboat%2C%20Riverview%20Ghat%2C%20Sunamganj&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/12-nabab-the-haor-villa-houseboat/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/12-nabab-the-haor-villa-houseboat/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/12-nabab-the-haor-villa-houseboat/image2.jpg', NULL, 'Riverview Ghat, opposite road of Officers Club, Sunamganj 3000 (boarding point)', 'Nabab - The Haor Villa is a tourist houseboat that runs overnight trips on Tanguar Haor, boarding at Riverview Ghat in Sunamganj town. The boat has six cabins for two to three guests each, a rooftop deck and an on-board kitchen whose cooking is often praised by guests. Itineraries usually include Tanguar Haor, Niladri Lake, Barikka Tila and Shimul Bagan near the Indian border.', '01741283677', 'https://www.facebook.com/nababhouseboat/', NULL, NULL, 0);
INSERT INTO public.accommodation VALUES (13, 'The Peace Palace Luxury Hotel & Restaurant', 0.0, 1, 4150, 'Hotel', 478, 3, 'Modern', 'Y', 'Y', 'Y', 'N', 'N', 'https://maps.google.com/maps?q=The%20Peace%20Palace%20Luxury%20Hotel%20%26%20Restaurant%2C%20Old%20Bus%20Stand%20Road%2C%20Sunamganj&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/13-the-peace-palace-luxury-hotel-restaurant/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/13-the-peace-palace-luxury-hotel-restaurant/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/13-the-peace-palace-luxury-hotel-restaurant/image2.jpg', NULL, 'Old Bus Stand Road, Sunamganj 3000', 'The Peace Palace Luxury Hotel & Restaurant is one of the newer upmarket hotels in Sunamganj town, on Old Bus Stand Road. It offers single, twin and family rooms and suites with air conditioning, free Wi-Fi and breakfast included, along with free parking and an in-house restaurant. It is a convenient base before or after a Tanguar Haor houseboat trip.', '01334926868', 'https://www.facebook.com/thepeacepalacehotel', 'https://peacepalacehotel.com/', 'contact@peacepalacehotel.com', 0);
INSERT INTO public.accommodation VALUES (14, 'Nazimgarh Lalakhal (Wilderness Resort)', 0.0, 2, 12385, 'Resort', 488, 4, 'Modern', 'Y', 'Y', 'Y', 'Y', 'N', 'https://maps.google.com/maps?q=Nazimgarh%20Lalakhal%2C%20Lalakhal%2C%20Jaintiapur%2C%20Sylhet&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/14-nazimgarh-lalakhal-wilderness-resort/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/14-nazimgarh-lalakhal-wilderness-resort/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/14-nazimgarh-lalakhal-wilderness-resort/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/14-nazimgarh-lalakhal-wilderness-resort/image3.jpg', 'Lalakhal Road, Lalakhal, Jaintiapur, Sylhet 3156', 'Nazimgarh Lalakhal, also called Nazimgarh Wilderness, is a hillside resort beside the Sari River at Lalakhal in Jaintiapur, close to the Meghalaya border. Its buildings are grouped around an infinity-edge pool and offer deluxe rooms, panorama rooms and a treetop suite. Guests can take boat rides on the turquoise river, kayak, or try ATV riding and zorbing, and the property has several restaurants including River Queen and a riverside cafe.', '01841001200', 'https://www.facebook.com/resort.wilderness/', 'https://www.nazimgarh.com/nazimgarh-lalakhal/', NULL, 0);
INSERT INTO public.accommodation VALUES (15, 'Jaintia Hill Resort', 0.0, 2, 2500, 'Resort', 488, 3, 'Modern', 'N', 'Y', 'N', 'N', 'N', 'https://maps.google.com/maps?q=Jaintia%20Hill%20Resort%2C%20Alubagan%2C%20Sylhet-Tamabil%20Highway%2C%20Jaintapur&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/15-jaintia-hill-resort/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/15-jaintia-hill-resort/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/15-jaintia-hill-resort/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/15-jaintia-hill-resort/image3.jpg', 'Alubagan, Sylhet-Tamabil Highway, Jaintapur, Sylhet 3156', 'Jaintia Hill Resort sits on a hillside at Alubagan beside the Sylhet-Tamabil highway, about 5-6 km before Jaflong. It has AC and non-AC rooms, large family halls and wooden hill cottages, many with balconies facing the Meghalaya hills and their monsoon waterfalls. The resort has its own restaurant and BBQ and free parking; reviewers praise the views but describe the rooms as dated.', '01711324173', 'https://www.facebook.com/jaintiahillresort', 'https://jaintahill.com/', NULL, 0);
INSERT INTO public.accommodation VALUES (16, 'Rangauti Resort', 0.0, 2, 4556, 'Resort', 466, 4, 'Modern', 'Y', 'Y', 'Y', 'Y', 'N', 'https://maps.google.com/maps?q=Rangauti%20Resort%2C%20Taltola%20Bazar%2C%20Moulvibazar&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/16-rangauti-resort/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/16-rangauti-resort/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/16-rangauti-resort/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/16-rangauti-resort/image3.jpg', 'Taltola Bazar, Moulvibazar-Kulaura Road, Moulvibazar 3200', 'Rangauti Resort is a large lakeside resort at Taltola Bazar on the Moulvibazar-Kulaura road, a short drive from Moulvibazar town. Its grounds include a lake with boat rides, palm-lined walkways, an outdoor pool and a restaurant. It is roughly two hours by road from Madhabkunda Waterfall and is popular for family and group stays.', '01780203350', NULL, 'https://www.rangautiresort.com/', NULL, 0);
INSERT INTO public.accommodation VALUES (17, 'Rest Inn Hotel', 0.0, 1, 1500, 'Hotel', 466, 3, 'Modern', 'Y', 'Y', 'Y', 'N', 'N', 'https://maps.google.com/maps?q=Rest%20Inn%20Hotel%2C%20M.%20Saifur%20Rahman%20Road%2C%20Moulvibazar&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/17-rest-inn-hotel/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/17-rest-inn-hotel/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/17-rest-inn-hotel/image2.jpg', NULL, '1151/3 M. Saifur Rahman Road, Moulvibazar 3200', 'Rest Inn Hotel is a central mid-range hotel on M. Saifur Rahman Road in Moulvibazar town. It offers non-AC and AC single and deluxe rooms as well as river-view and executive suites, with free Wi-Fi, a lift and an in-house restaurant. It is a practical overnight stop for travellers heading to Madhabkunda Waterfall or nearby tea gardens.', '01719333555', 'https://www.facebook.com/RestInnHotel.mb/', 'https://www.restinnhotelbd.com/', 'restinnhotel.mb@gmail.com', 0);
INSERT INTO public.accommodation VALUES (18, 'Hotel Taj Metro', 0.0, 2, 2100, 'Hotel', 466, 3, 'Modern', 'Y', 'N', 'Y', 'N', 'Y', 'https://maps.google.com/maps?q=Hotel%20Taj%20Metro%2C%20Shera%20Town%20Plaza%2C%20Moulvibazar&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/18-hotel-taj-metro/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/18-hotel-taj-metro/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/18-hotel-taj-metro/image2.jpg', NULL, 'Shera Town Plaza (2nd floor), 69 M. Saifur Rahman Road, Moulvibazar 3200', 'Hotel Taj Metro is a small boutique hotel on the second floor of Shera Town Plaza on M. Saifur Rahman Road in central Moulvibazar. It has standard deluxe, executive couple and twin rooms and a suite, all air-conditioned with free Wi-Fi and breakfast included. Guests frequently mention clean rooms and helpful staff.', '01326405237', NULL, 'https://hoteltajmetro.com/', 'hoteltajmetro@gmail.com', 0);
INSERT INTO public.accommodation VALUES (19, 'Jaflong Green Resort', 0.0, 2, 3500, 'Resort', 487, 2, 'Eco', 'Y', 'Y', 'N', 'N', 'N', 'https://maps.google.com/maps?q=Jaflong%20Green%20Resort%2C%20Jaflong%2C%20Gowainghat%2C%20Sylhet&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/19-jaflong-green-resort/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/19-jaflong-green-resort/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/19-jaflong-green-resort/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/19-jaflong-green-resort/image3.jpg', 'BGB Camp, Guccho Gram, Jaflong View, Jaflong 3151, Gowainghat, Sylhet', 'A small two-star resort that opened around 2020 next to the BGB camp, roughly 500 m from Jaflong Zero Point, making it one of the few places to stay right at Jaflong. It has about 20 rooms, from non-AC couple rooms to AC doubles and family rooms, some with hill views, plus a restaurant and garden. Guest feedback on booking sites is sparse and mostly negative, so it suits travellers who value the location over comfort.', '01756162000', 'https://www.facebook.com/jaflongresort/', 'https://jaflonggreenresort.reservehotel.net/', 'reservation1@jaflonggreen.com', 0);
INSERT INTO public.accommodation VALUES (20, 'Rose View Hotel', 0.0, 2, 5980, 'Hotel', 512, 5, 'Modern', 'Y', 'Y', 'N', 'Y', 'Y', 'https://maps.google.com/maps?q=Rose%20View%20Hotel%2C%20Shahjalal%20Upashahar%2C%20Sylhet&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/20-rose-view-hotel/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/20-rose-view-hotel/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/20-rose-view-hotel/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/20-rose-view-hotel/image3.jpg', 'Rose View Complex, Plot 2, Block D, Shahjalal Upashahar (Bishwa Road), Sylhet 3100', 'Five-star hotel in the Shahjalal Upashahar area of Sylhet with about 140 deluxe rooms and suites. Facilities include a heated rooftop swimming pool, a Thai spa with sauna and steam rooms, a fitness centre, several restaurants and a licensed bar, and meeting and banquet space for large events. Osmani International Airport is roughly 8 km away, and the hotel is a common base for day trips to Jaflong and Ratargul.', '01972787878', 'https://www.facebook.com/RoseViewHotel', 'https://www.roseviewhotel.com/', 'info@roseviewhotel.com', 0);
INSERT INTO public.accommodation VALUES (21, 'Nirvana Inn', 0.0, 2, 3420, 'Hotel', 512, 4, 'Modern', 'Y', 'Y', 'Y', 'Y', 'Y', 'https://maps.google.com/maps?q=Nirvana%20Inn%2C%20Mirzajangal%2C%20Sylhet&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/21-nirvana-inn/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/21-nirvana-inn/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/21-nirvana-inn/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/21-nirvana-inn/image3.jpg', 'Mirzajangal, Sylhet 3100', 'Four-star city hotel on Mirzajangal Road, a short ride from Zindabazar, Keane Bridge and the Hazrat Shah Jalal shrine. Opened in 2008 and renovated in 2013, it offers rooms from single and twin deluxe up to family and royal suites. Facilities include indoor and outdoor pools, a gym and sauna, a rooftop dining area, a restaurant and a banquet hall.', '01971336761', 'https://www.facebook.com/HotelNirvanaInn', 'https://www.nirvanainn.com/', NULL, 0);
INSERT INTO public.accommodation VALUES (22, 'Hotel Noorjahan Grand', 0.0, 2, 2700, 'Hotel', 512, 4, 'Modern', 'Y', 'Y', 'N', 'Y', 'N', 'https://maps.google.com/maps?q=Hotel%20Noorjahan%20Grand%2C%20Dargah%20Gate%2C%20Sylhet&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/22-hotel-noorjahan-grand/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/22-hotel-noorjahan-grand/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/22-hotel-noorjahan-grand/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/22-hotel-noorjahan-grand/image3.jpg', 'Waves 1, Ritz Tower, Dargah Gate, Sylhet 3100', 'Mid-range hotel opened in 2016 at Dargah Gate, a few minutes'' walk from the shrine of Hazrat Shah Jalal. It has around 50 rooms, a rooftop outdoor pool, a gym and a rooftop restaurant. It is one of the most reviewed hotels in Sylhet and is popular with families and groups because of its central location and moderate prices.', '01927555999', NULL, NULL, 'noorjahangrand@gmail.com', 0);
INSERT INTO public.accommodation VALUES (23, 'Hotel Star Pacific', 0.0, 2, 4150, 'Hotel', 512, 4, 'Modern', 'Y', 'Y', 'N', 'Y', 'N', 'https://maps.google.com/maps?q=Hotel%20Star%20Pacific%2C%20East%20Dargah%20Gate%2C%20Sylhet&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/23-hotel-star-pacific/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/23-hotel-star-pacific/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/23-hotel-star-pacific/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/23-hotel-star-pacific/image3.jpg', 'East Dargah Gate, Sylhet 3100', 'Four-star hotel at East Dargah Gate, very close to the Hazrat Shah Jalal shrine, with 83 rooms ranging from standard rooms to executive and presidential suites. It has an outdoor pool, a rooftop terrace, a fitness centre, a spa, a restaurant and coffee shop, and large banquet and conference halls. Reviews praise the location and breakfast but are mixed on front-desk service.', NULL, NULL, NULL, NULL, 0);
INSERT INTO public.accommodation VALUES (24, 'Grand Sultan Tea Resort & Golf', 0.0, 2, 17300, 'Resort', 468, 5, 'Modern', 'Y', 'Y', 'N', 'Y', 'Y', 'https://maps.google.com/maps?q=Grand%20Sultan%20Tea%20Resort%20%26%20Golf%2C%20Radhanagar%2C%20Sreemangal&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/24-grand-sultan-tea-resort-golf/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/24-grand-sultan-tea-resort-golf/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/24-grand-sultan-tea-resort-golf/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/24-grand-sultan-tea-resort-golf/image3.jpg', 'Radhanagar, Bhanugach Road, Sreemangal 3210, Moulvibazar', 'Five-star resort opened in 2013 on the Bhanugach road at Radhanagar, surrounded by tea gardens and a few minutes from Lawachara National Park and the Tea Museum. It has about 134 rooms and suites in eight categories, a 9-hole golf course, a temperature-controlled pool plus outdoor pools, a spa, gym, tennis and indoor games. Several restaurants and cafes are on site, and it is the most upmarket stay in the Srimangal area.', '01730793555', NULL, 'https://www.grandsultanresort.com/', NULL, 0);
INSERT INTO public.accommodation VALUES (25, 'Balishira Resort', 0.0, 2, 4900, 'Resort', 468, 3, 'Modern', 'Y', 'Y', 'N', 'Y', 'Y', 'https://maps.google.com/maps?q=Balishira%20Resort%2C%20Zerin%20Road%2C%20Radhanagar%2C%20Sreemangal&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/25-balishira-resort/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/25-balishira-resort/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/25-balishira-resort/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/25-balishira-resort/image3.jpg', 'Zerin Road, Radhanagar, Sreemangal 3210', 'Three-star resort opened in 2020 at Radhanagar, about 2 km from Lawachara National Park and close to Champa Lake and the Tea Museum. It is a small property with under 20 rooms, an outdoor and an indoor pool, a garden, a restaurant with 24-hour room service and a conference room overlooking the forest.', '01766557760', NULL, NULL, 'balishiraresort@gmail.com', 0);
INSERT INTO public.accommodation VALUES (26, 'Nishorgo Nirob Eco Resort', 0.0, 2, 3800, 'Cottage', 468, 2, 'Eco', 'N', 'Y', 'Y', 'N', 'N', 'https://maps.google.com/maps?q=Nishorgo%20Nirob%20Eco%20Resort%2C%20Radhanagar%2C%20Sreemangal&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/26-nishorgo-nirob-eco-resort/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/26-nishorgo-nirob-eco-resort/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/26-nishorgo-nirob-eco-resort/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/26-nishorgo-nirob-eco-resort/image3.jpg', 'Zerin Road, Radhanagar, Sreemangal 3210', 'Simple eco cottages in the Radhanagar resort area, about 1.7 km from Lawachara National Park and close to Champa Lake. Accommodation ranges from garden-view family rooms to deluxe, family and honeymoon cottages with fans and private bathrooms, and a continental breakfast is included. The Chamung Restaurant & Eco Cafe is directly across the road.', '01735238409', NULL, NULL, NULL, 0);
INSERT INTO public.accommodation VALUES (27, 'Sayeman Beach Resort', 0.0, 2, 15500, 'Resort', 83, 5, 'Modern', 'Y', 'Y', 'Y', 'Y', 'Y', 'https://maps.google.com/maps?q=Sayeman%20Beach%20Resort%2C%20Marine%20Drive%2C%20Kolatoli%2C%20Cox''s%20Bazar&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/27-sayeman-beach-resort/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/27-sayeman-beach-resort/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/27-sayeman-beach-resort/image2.jpg', NULL, 'Marine Drive Road, Kolatoli, Cox''s Bazar 4700', 'Beachfront resort on Marine Drive at Kolatoli whose history goes back to the original Hotel Sayeman of 1964; the current tower opened in 2015 with more than 200 rooms and suites. It is best known for its rooftop infinity pool overlooking the Bay of Bengal. On site are the Casablanca restaurant, Surf Side Cafe, YuMe pool cafe and Sunset Bar & Grill, plus a Thai spa, gym, kids zone and banquet halls. Standard room rates include breakfast for two adults and airport transfers.', '01401777888', 'https://www.facebook.com/SayemanBeachResort', 'https://sayemanresort.com/', 'reservation.beachresort@sayeman.com', 0);
INSERT INTO public.accommodation VALUES (28, 'Long Beach Hotel', 0.0, 2, 10752, 'Hotel', 83, 5, 'Modern', 'Y', 'Y', 'Y', 'Y', 'Y', 'https://maps.google.com/maps?q=Long%20Beach%20Hotel%2C%20Kolatoli%2C%20Cox''s%20Bazar&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/28-long-beach-hotel/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/28-long-beach-hotel/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/28-long-beach-hotel/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/28-long-beach-hotel/image3.jpg', '14 Kolatoli, Hotel-Motel Zone, Cox''s Bazar 4700', 'Upscale high-rise hotel in the Kolatoli hotel-motel zone, a short walk from the beach, with rooms ranging from Premier and Superior Deluxe up to a Presidential Suite on the top floor. Facilities include a swimming pool with jacuzzi, sauna and steam bath, gym and billiards. Guests can eat at Cozy Restaurant, Cafe 14 or the poolside barbecue. Room rates include buffet breakfast, airport pick-up and Wi-Fi.', '01755660051', NULL, 'https://longbeachhotelbd.com/', 'reservation@longbeachhotelbd.com', 0);
INSERT INTO public.accommodation VALUES (29, 'Ocean Paradise Hotel & Resort', 0.0, 2, 12000, 'Hotel', 83, 4, 'Modern', 'Y', 'Y', 'Y', 'Y', 'Y', 'https://maps.google.com/maps?q=Ocean%20Paradise%20Hotel%20%26%20Resort%2C%20Kolatoli%20Road%2C%20Cox''s%20Bazar&z=15&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/29-ocean-paradise-hotel-resort/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/29-ocean-paradise-hotel-resort/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/29-ocean-paradise-hotel-resort/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/accomodations/29-ocean-paradise-hotel-resort/image3.jpg', 'Kolatoli Road, Hotel-Motel Zone, Cox''s Bazar 4700', 'Large beachfront hotel on Kolatoli Road with around 250 rooms and suites, many facing the Bay of Bengal. It has two outdoor pools, a spa, fitness centre, event venues, the Curry Leaf restaurant and a rooftop barbecue restaurant. Room rates include a buffet breakfast for two adults and airport transfers. It was named Leading Beach Hotel at the Bangladesh Travel, Tourism and Hospitality Awards 2025.', NULL, NULL, NULL, NULL, 0);


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

INSERT INTO public.destination VALUES (1, 'Ahsan Manzil Museum', 'It was formerly the residence and seat of the Nawab of Dhaka and has been designated an Old Dhaka Heritage Site', 'Historical Architectures', 'Excellent', 'Dress Modestly, Stay Hydrated', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/1-ahsan-manzil-museum/image.jpg', 0.0, 505, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3653.088000385254!2d90.40345787389097!3d23.70855129038441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b9047a855555%3A0xdb6be1e307885b57!2sAhsan%20Manzil%20Museum!5e0!3m2!1sen!2sbd!4v1709981158831!5m2!1sen!2sbd', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/1-ahsan-manzil-museum/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/1-ahsan-manzil-museum/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/1-ahsan-manzil-museum/image3.jpg', 0);
INSERT INTO public.destination VALUES (2, 'Cox''s Bazar', 'Cox''s Bazar is a famous beach town in southeastern Bangladesh.', 'Inani Beach, Himchari National Park', 'Tropical climate with monsoon season from June to October.', 'Pack sunscreen and light clothing.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/2-coxs-bazar/image.jpg', 0.0, 89, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29712.144669114798!2d91.94958618026531!3d21.428534190081102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc868716d4925%3A0xcd3ada60adda3a3b!2sCox''s%20Bazar%20Beach!5e0!3m2!1sen!2sbd!4v1708381120811!5m2!1sen!2sbd', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/2-coxs-bazar/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/2-coxs-bazar/image2.png', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/2-coxs-bazar/image3.jpg', 0);
INSERT INTO public.destination VALUES (3, 'Sundarbans', 'The Sundarbans is the largest mangrove forest in the world.', 'Royal Bengal Tigers, diverse wildlife', 'Subtropical climate with high humidity.', 'Wear mosquito repellent and explore with a guide.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/3-sundarbans/image.jpg', 0.0, 239, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d946892.3538366939!2d88.62742687620992!3d22.019039702266472!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a004caac2c7b315%3A0x4716abcfbb16c93c!2sSundarbans!5e0!3m2!1sen!2sbd!4v1706355188038!5m2!1sen!2sbd', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/3-sundarbans/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/3-sundarbans/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/3-sundarbans/image3.jpg', 0);
INSERT INTO public.destination VALUES (4, 'Srimangal', 'Known as the "Tea Capital of Bangladesh," Srimangal is famous for its tea gardens.', 'Lawachara National Park, Seven Layer Tea', 'Subtropical climate with moderate rainfall.', 'Visit tea estates and taste different teas.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/4-srimangal/image.jpg', 0.0, 468, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29087.567079525645!2d91.70444708692563!3d24.313522620218137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x37517a7a9ac91745%3A0x50f827893a88c955!2sSreemangal!5e0!3m2!1sen!2sbd!4v1706355312902!5m2!1sen!2sbd', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/4-srimangal/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/4-srimangal/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/4-srimangal/image3.jpg', 0);
INSERT INTO public.destination VALUES (6, 'Saint Martin''s Island', 'Saint Martin''s Island is the only coral island in Bangladesh.', 'Chera Dwip, Marine Life', 'Tropical climate with monsoon season from June to October.', 'Enjoy fresh seafood and plan for boat rides.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/6-saint-martins-island/image.jpg', 0.0, 88, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7626813.915550053!2d92.34037452832547!3d21.031476303641305!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30ae233bf4f99bcb%3A0x600777e96eb96b57!2sSaint%20Martin''s%20Island%20West%20Beach,%20Bangladesh!5e0!3m2!1sen!2sbd!4v1708383561206!5m2!1sen!2sbd', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/6-saint-martins-island/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/6-saint-martins-island/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/6-saint-martins-island/image3.jpg', 0);
INSERT INTO public.destination VALUES (7, 'Kuakata', 'Known as the "Daughter of the Sea," Kuakata is a unique beach with both sunrise and sunset views.', 'Gangamati Reserved Forest, Kuakata Sea Beach', 'Tropical climate with monsoon season from June to October.', 'Experience the panoramic views of both sunrise and sunset.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/7-kuakata/image.jpg', 0.0, 32, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118514.30566015706!2d90.09303476817682!3d21.835459698003994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30aa62836f83b573%3A0x31e7fec84916471!2sKuakata%20Sea%20Beach!5e0!3m2!1sen!2sbd!4v1708362362427!5m2!1sen!2sbd', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/7-kuakata/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/7-kuakata/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/7-kuakata/image3.jpg', 0);
INSERT INTO public.destination VALUES (8, 'Bandarban', 'Bandarban is a hill district known for its scenic beauty and indigenous communities.', 'Nilgiri Hills, Boga Lake', 'Subtropical climate with cool temperatures.', 'Trekking opportunities and experience indigenous cultures.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/8-bandarban/image.jpg', 0.0, 53, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59103.12218997553!2d92.17536645727786!3d22.20419118561907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30ad6a188414e62b%3A0xa4c3198f81ba90d0!2sBandarban!5e0!3m2!1sen!2sbd!4v1708380895066!5m2!1sen!2sbd', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/8-bandarban/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/8-bandarban/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/8-bandarban/image3.jpg', 0);
INSERT INTO public.destination VALUES (9, 'Lalbagh', 'Lalbagh is a neighbourhood of the Dhaka District in the division of Dhaka, Bangladesh', 'Tomb of Bibi Pari', 'Good', 'Dress Modestly, Stay Hydrated', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/9-lalbagh/image.jpg', 0.0, 505, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58443.78105097272!2d90.31583841418473!3d23.721108622233583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8dea7c18969%3A0xc4c2a51658e86152!2sLalbagh%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1709979337237!5m2!1sen!2sbd', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/9-lalbagh/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/9-lalbagh/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/9-lalbagh/image3.jpg', 0);
INSERT INTO public.destination VALUES (5, 'Rangamati', 'Rangamati is a picturesque hill district with stunning landscapes and water bodies.', 'Kaptai Lake, Hanging Bridge', 'Subtropical climate with moderate temperatures.', 'Take a boat ride on Kaptai Lake.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/5-rangamati/image.jpg', 0.0, 145, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58916.71138165585!2d92.13193476127317!3d22.642807304571523!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3752b5a7b4c418f9%3A0xa63c343bd4a12112!2sRangamati!5e0!3m2!1sen!2sbd!4v1706355406725!5m2!1sen!2sbd', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/5-rangamati/image1.png', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/5-rangamati/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/5-rangamati/image3.jpg', 0);
INSERT INTO public.destination VALUES (10, 'Sonargaon', 'Sonargaon, south-east of Dhaka, was one of the old capitals of Bengal under the Sultanate and a centre of the muslin trade, later becoming the seat of Isa Khan. Its Panam Nagar street is lined with crumbling 19th-century merchant houses, and the Folk Art and Crafts Museum is set in the Bara Sardar Bari mansion.', 'Panam Nagar, Folk Art and Crafts Museum (Bara Sardar Bari), Goaldi Mosque, Tomb of Sultan Ghiyasuddin Azam Shah', 'Tropical monsoon climate: hot, humid summers, heavy rain from June to September and mild, dry winters.', 'An easy half-day trip from Dhaka. Go on a weekday morning to avoid crowds, and don''t climb on Panam Nagar''s fragile buildings.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/10-sonargaon/image.jpg', 0.0, 204, 'https://maps.google.com/maps?q=Panam%20City%2C%20Sonargaon&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/10-sonargaon/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/10-sonargaon/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/10-sonargaon/image3.jpg', 0);
INSERT INTO public.destination VALUES (11, 'Bhawal National Park', 'Bhawal National Park is a protected sal forest in Gazipur, about 40 km north of Dhaka. Its woodland, lakes and picnic spots make it one of the most popular nature escapes near the capital.', 'Sal forest trails, lakes and picnic spots, watchtowers, birdwatching', 'Hot and humid in summer with heavy monsoon rain; winters are mild and dry.', 'Winter (November to February) is the most pleasant time. Weekends and holidays get crowded with picnic groups, so go on a weekday.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/11-bhawal-national-park/image.jpg', 0.0, 160, 'https://maps.google.com/maps?q=Bhawal%20National%20Park%2C%20Gazipur&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/11-bhawal-national-park/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/11-bhawal-national-park/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/11-bhawal-national-park/image3.jpg', 0);
INSERT INTO public.destination VALUES (12, 'Birishiri', 'Birishiri, in Durgapur upazila of Netrokona near the Indian border, is known for the white china-clay hills at Bijoypur and the blue-green lake left in the old clay quarries. The Someshwari River and the culture of the Garo and Hajong communities add to its charm.', 'Bijoypur china clay hills and lake, Someshwari River, Rani Khong Mission, Garo and Hajong villages', 'Hot, humid summers and heavy monsoon rain; winters are cool and dry.', 'Winter is the best season. Hire a local auto-rickshaw or motorbike to reach Bijoypur, and follow the rules near the border.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/12-birishiri/image.jpg', 0.0, 315, 'https://maps.google.com/maps?q=Bijoypur%20China%20Clay%20Hill%2C%20Durgapur%2C%20Netrokona&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/12-birishiri/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/12-birishiri/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/12-birishiri/image3.jpg', 0);
INSERT INTO public.destination VALUES (13, 'Ratargul Swamp Forest', 'Ratargul in Gowainghat, north of Sylhet city, is one of the few freshwater swamp forests in the world and the best known in Bangladesh. In the monsoon its trees stand in several feet of water, and visitors glide between them in small wooden boats.', 'Boat rides through the flooded forest, watchtower, birds and wildlife', 'The forest is flooded from about June to October; in the dry season the water recedes.', 'Visit in the monsoon to see the forest under water. Take a boat with a local boatman, keep noise down, and wear a hat and insect repellent.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/13-ratargul-swamp-forest/image.jpg', 0.0, 487, 'https://maps.google.com/maps?q=Ratargul%20Swamp%20Forest&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/13-ratargul-swamp-forest/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/13-ratargul-swamp-forest/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/13-ratargul-swamp-forest/image3.jpg', 0);
INSERT INTO public.destination VALUES (14, 'Jaflong', 'Jaflong lies on the Piyain River in Gowainghat, at the foot of India''s Meghalaya hills. It is known for its clear river water, stone-collecting boats, Khasi villages and the view of the Dawki suspension bridge across the border.', 'Piyain River, Zero Point and the Dawki bridge view, Khasi villages, tea gardens', 'Sylhet is one of the wettest regions of Bangladesh; the river is clearest in the dry winter months.', 'Go between October and March for the clearest water. Currents are strong in the monsoon, so only wade where locals say it is safe.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/14-jaflong/image.jpg', 0.0, 487, 'https://maps.google.com/maps?q=Jaflong%20Zero%20Point%2C%20Sylhet&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/14-jaflong/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/14-jaflong/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/14-jaflong/image3.jpg', 0);
INSERT INTO public.destination VALUES (15, 'Bichanakandi', 'Bichanakandi is a stony riverbed at the Indian border in Gowainghat, Sylhet, where streams from the Meghalaya hills spill over boulders into clear pools. With waterfalls on the green hills behind, it is one of the most photographed spots in Sylhet.', 'Clear river pools among boulders, views of the Meghalaya hills and waterfalls, boat ride from Hadarpar', 'Best water from June to October; in the dry season the riverbed is mostly rock.', 'Take a boat from Hadarpar bazar. Stay in the shallow parts, as the current can be strong after rain.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/15-bichanakandi/image.jpg', 0.0, 487, 'https://maps.google.com/maps?q=Bichanakandi%2C%20Sylhet&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/15-bichanakandi/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/15-bichanakandi/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/15-bichanakandi/image3.jpg', 0);
INSERT INTO public.destination VALUES (16, 'Lalakhal', 'Lalakhal is a stretch of the Sari River in Jaintiapur, Sylhet, famous for its striking blue-green water flowing down from the Meghalaya hills. Boat trips pass tea gardens and forested hills on the way towards the border.', 'Sari River boat rides, Lalakhal tea estate, hill views', 'Heavy rain in the monsoon; the water is at its bluest in the dry months.', 'Visit between November and March for the bluest water, and agree the boat fare before starting.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/16-lalakhal/image.jpg', 0.0, 488, 'https://maps.google.com/maps?q=Lalakhal%2C%20Jaintiapur%2C%20Sylhet&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/16-lalakhal/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/16-lalakhal/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/16-lalakhal/image3.jpg', 0);
INSERT INTO public.destination VALUES (17, 'Tanguar Haor', 'Tanguar Haor is a vast wetland in Sunamganj and a Ramsar site, fed by streams from the Meghalaya hills. In the monsoon it turns into an inland sea dotted with swamp trees and village islands, and in winter it hosts huge flocks of migratory birds.', 'Houseboat stays, watchtower and swamp forest, Niladri Lake (Tekerghat), Shimul garden and the Jadukata River', 'Flooded from June to October; winter (December to February) is the bird-watching season.', 'Book a houseboat early for the monsoon, wear a life jacket on boats, and take all plastic waste back with you: this is a protected wetland.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/17-tanguar-haor/image.jpg', 0.0, 479, 'https://maps.google.com/maps?q=Tanguar%20Haor%2C%20Sunamganj&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/17-tanguar-haor/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/17-tanguar-haor/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/17-tanguar-haor/image3.jpg', 0);
INSERT INTO public.destination VALUES (18, 'Madhabkunda Waterfall', 'Madhabkunda in Barlekha, Moulvibazar, is one of the highest waterfalls in Bangladesh, falling from the Patharia hills into a forest-ringed pool. An eco-park surrounds the falls, and the smaller Parikunda waterfall is close by.', 'Madhabkunda waterfall and eco-park, Parikunda waterfall, nearby tea gardens', 'The falls are strongest in the monsoon; in winter the flow is lower but the trails are easier.', 'The rocks near the falls are slippery: wear shoes with grip and don''t swim under the falling water.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/18-madhabkunda-waterfall/image.jpg', 0.0, 462, 'https://maps.google.com/maps?q=Madhabkunda%20Waterfall&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/18-madhabkunda-waterfall/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/18-madhabkunda-waterfall/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/18-madhabkunda-waterfall/image3.jpg', 0);
INSERT INTO public.destination VALUES (19, 'Sajek Valley', 'Sajek Valley sits on a ridge about 1,800 ft above sea level in Baghaichari, Rangamati, near the Mizoram border. It is famous for sunrises over seas of cloud, its Lushai and Tripura villages, and colourful cottages built along the ridge.', 'Ruilui and Konglak villages, Konglak hill, helipad viewpoint, sunrise over the clouds', 'Nights are cool all year; clouds drift through the valley in the monsoon and autumn.', 'Sajek is reached through Khagrachari. Vehicles travel in escorted convoys at set times, so plan your trip around them and book a cottage in advance.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/19-sajek-valley/image.jpg', 0.0, 136, 'https://maps.google.com/maps?q=Sajek%20Valley&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/19-sajek-valley/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/19-sajek-valley/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/19-sajek-valley/image3.jpg', 0);
INSERT INTO public.destination VALUES (20, 'Nilgiri', 'Nilgiri is a hilltop about 2,200 ft high on the Bandarban-Thanchi road, around 47 km from Bandarban town. Visitors come to stand above the clouds and look out over the ridges of the Chittagong Hill Tracts and the nearby Mro villages.', 'Nilgiri viewpoint, walking above the clouds, Mro villages, Chimbuk hill on the way', 'Much cooler than the plains; the hilltop is often wrapped in cloud during the monsoon.', 'Arrive early for clear views, and book the hilltop accommodation well in advance.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/20-nilgiri/image.jpg', 0.0, 58, 'https://maps.google.com/maps?q=Nilgiri%20Hill%20Resort%2C%20Bandarban&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/20-nilgiri/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/20-nilgiri/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/20-nilgiri/image3.jpg', 0);
INSERT INTO public.destination VALUES (21, 'Nafakhum Waterfall', 'Nafakhum is one of the largest waterfalls in Bangladesh by volume, on the Remakri River in Thanchi, deep in the Bandarban hills. Getting there means a boat ride up the Sangu River from Thanchi to Remakri, then a few hours of trekking along the river.', 'Nafakhum waterfall, Sangu River boat ride, Remakri falls, the longer trek to Amiakhum', 'The falls are fullest after the monsoon (September to November); the river can be dangerous in heavy rain.', 'A registered local guide is required from Thanchi. Carry copies of your ID, waterproof bags and sturdy shoes.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/21-nafakhum-waterfall/image.jpg', 0.0, 58, 'https://maps.google.com/maps?q=Nafakhum%20Waterfall%2C%20Thanchi&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/21-nafakhum-waterfall/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/21-nafakhum-waterfall/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/21-nafakhum-waterfall/image3.jpg', 0);
INSERT INTO public.destination VALUES (22, 'Boga Lake', 'Boga Lake is a natural lake on a hilltop about 380 m above sea level in Ruma, Bandarban. The deep, almost round lake is surrounded by Bawm villages and is the usual base for treks to Keokradong.', 'Boga Lake, Bawm village, trek to Keokradong, Chingri waterfall on the way', 'Nights are cool; the steep road and trails are hard going in the monsoon.', 'Register with the authorities and hire a guide in Ruma. Facilities at the lake are basic cottages, so carry what you need.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/22-boga-lake/image.jpg', 0.0, 57, 'https://maps.google.com/maps?q=Boga%20Lake%2C%20Ruma%2C%20Bandarban&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/22-boga-lake/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/22-boga-lake/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/22-boga-lake/image3.jpg', 0);
INSERT INTO public.destination VALUES (23, 'Khagrachari', 'Khagrachari, one of the three Chittagong Hill Tracts districts, is a hilly town home to Chakma, Marma and Tripura communities. Its sights include the pitch-dark Alutila cave, the Risang waterfall and the hanging bridge by the town, and it is the gateway to Sajek Valley.', 'Alutila cave, Risang waterfall, hanging bridge at the Zilla Parishad park, Debota pukur', 'Hot summers, heavy monsoon rain and pleasant winters.', 'Take a torch (or buy a fire torch at the entrance) for Alutila cave; the cave floor is wet and slippery.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/23-khagrachari/image.jpg', 0.0, 115, 'https://maps.google.com/maps?q=Alutila%20Cave%2C%20Khagrachari&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/23-khagrachari/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/23-khagrachari/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/23-khagrachari/image3.jpg', 0);
INSERT INTO public.destination VALUES (24, 'Patenga Beach', 'Patenga is a beach at the mouth of the Karnaphuli River, about 14 km from central Chattogram and close to the airport. It is a popular evening spot for watching ships at anchor and planes coming in, with food stalls along the promenade.', 'Sunset over the Bay of Bengal, ships at the Karnaphuli estuary, the promenade and food stalls', 'Tropical climate; cyclones can strike in April-May and October-November.', 'Swimming is unsafe because of strong currents and shipping. Go in the late afternoon to catch the sunset.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/24-patenga-beach/image.jpg', 0.0, 502, 'https://maps.google.com/maps?q=Patenga%20Sea%20Beach%2C%20Chattogram&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/24-patenga-beach/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/24-patenga-beach/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/24-patenga-beach/image3.jpg', 0);
INSERT INTO public.destination VALUES (25, 'Foy''s Lake', 'Foy''s Lake is a man-made lake built in 1924 by the Assam Bengal Railway among the hills of Chattogram. Today it is part of an amusement and resort complex with boating, rides and lakeside walks.', 'Boating on the lake, amusement park rides, water park, lakeside walking trails', 'Tropical monsoon climate: hot summers, heavy rain from June to September and mild winters.', 'Entry and rides are ticketed. Weekdays are much quieter than weekends.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/25-foys-lake/image.jpg', 0.0, 502, 'https://maps.google.com/maps?q=Foy''s%20Lake%2C%20Chattogram&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/25-foys-lake/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/25-foys-lake/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/25-foys-lake/image3.jpg', 0);
INSERT INTO public.destination VALUES (26, 'Sitakunda', 'Sitakunda, north of Chattogram, is known for Chandranath hill and the Hindu temple at its summit, a major pilgrimage site. Around it are an eco-park, several waterfalls and Guliakhali beach, where green grassland meets the sea.', 'Chandranath temple trek, Sitakunda Botanical Garden and Eco-park, Guliakhali beach, waterfalls', 'The waterfalls flow best in the monsoon; winter is better for trekking.', 'Start the Chandranath climb early in the morning, carry water and wear good shoes: the steps are steep.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/26-sitakunda/image.jpg', 0.0, 81, 'https://maps.google.com/maps?q=Chandranath%20Temple%2C%20Chattogram&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/26-sitakunda/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/26-sitakunda/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/26-sitakunda/image3.jpg', 0);
INSERT INTO public.destination VALUES (27, 'Himchari National Park', 'Himchari National Park lies along the Marine Drive just south of Cox''s Bazar town, where forested hills meet the sea. It has a waterfall, a hilltop viewpoint over the Bay of Bengal and patches of tropical forest.', 'Himchari waterfall, hilltop viewpoint, Marine Drive, Himchari beach', 'Best from November to March; the waterfall is fullest in the monsoon.', 'Combine it with a ride along the Marine Drive to Inani. The stairs to the viewpoint are steep.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/27-himchari-national-park/image.jpg', 0.0, 83, 'https://maps.google.com/maps?q=Himchari%20National%20Park%2C%20Cox''s%20Bazar&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/27-himchari-national-park/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/27-himchari-national-park/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/27-himchari-national-park/image3.jpg', 0);
INSERT INTO public.destination VALUES (28, 'Moheshkhali Island', 'Moheshkhali, a short boat ride from Cox''s Bazar, is the only hilly island in Bangladesh. The Adinath temple on Mainak hill, Buddhist pagodas, mangroves, salt fields and betel leaf farms make it a rewarding day trip.', 'Adinath temple on Mainak hill, Buddhist pagodas, mangrove forest, salt fields and betel leaf farms', 'Tropical coastal climate; the sea crossing is rough in the monsoon.', 'Speedboats from Cox''s Bazar take about 20 minutes. Plan to return before dark.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/28-moheshkhali-island/image.jpg', 0.0, 85, 'https://maps.google.com/maps?q=Adinath%20Temple%2C%20Moheshkhali&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/28-moheshkhali-island/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/28-moheshkhali-island/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/28-moheshkhali-island/image3.jpg', 0);
INSERT INTO public.destination VALUES (29, 'Mainamati', 'The Mainamati ruins near Cumilla are the remains of Buddhist monasteries from the 7th to 12th centuries. The best known is Shalban Vihara, a square monastery with 115 cells around a central temple, and finds from the sites are on show at the Mainamati Museum.', 'Shalban Vihara, Mainamati Museum, Kutila Mura, Ananda Vihara', 'Hot summers, monsoon rain and mild winters.', 'Allow two to three hours for the site and museum, and try Cumilla''s famous rasmalai while you''re there.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/29-mainamati/image.jpg', 0.0, 95, 'https://maps.google.com/maps?q=Shalban%20Vihara%2C%20Cumilla&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/29-mainamati/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/29-mainamati/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/29-mainamati/image3.jpg', 0);
INSERT INTO public.destination VALUES (30, 'Nijhum Dwip', 'Nijhum Dwip is an island off Hatiya in Noakhali that rose from the Meghna estuary in the last century. Its national park is known for herds of spotted deer in planted mangrove forest, mudflats full of birds and quiet beaches.', 'Spotted deer in the mangrove forest, Namar Bazar beach, migratory birds, fishing villages', 'Coastal and cyclone-prone; winter is the safest and best time to visit.', 'Reach Hatiya by launch, then continue to the island by boat or motorbike. Facilities are basic, so carry cash and essentials.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/30-nijhum-dwip/image.jpg', 0.0, 130, 'https://maps.google.com/maps?q=Nijhum%20Dwip%20National%20Park%2C%20Hatiya&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/30-nijhum-dwip/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/30-nijhum-dwip/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/30-nijhum-dwip/image3.jpg', 0);
INSERT INTO public.destination VALUES (31, 'Paharpur Buddhist Vihara', 'Somapura Mahavihara at Paharpur, Naogaon, was one of the largest Buddhist monasteries south of the Himalayas, built in the 8th century by the Pala king Dharmapala. A UNESCO World Heritage Site, it has 177 monks'' cells around a huge cross-shaped central temple.', 'Central temple mound, monastery cells, Paharpur Museum, Satyapir Bhita', 'Very hot summers and cold winter nights.', 'Visit in winter, early in the day. The site museum is right next to the ruins.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/31-paharpur-buddhist-vihara/image.jpg', 0.0, 351, 'https://maps.google.com/maps?q=Somapura%20Mahavihara%2C%20Paharpur%2C%20Naogaon&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/31-paharpur-buddhist-vihara/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/31-paharpur-buddhist-vihara/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/31-paharpur-buddhist-vihara/image3.jpg', 0);
INSERT INTO public.destination VALUES (32, 'Mahasthangarh', 'Mahasthangarh in Shibganj, Bogura, is the earliest known urban archaeological site in Bangladesh: the ancient city of Pundranagara, dating back to at least the 3rd century BC. Its walled citadel by the Karatoya River is surrounded by ruins such as Gokul Medh and Bhasu Vihara.', 'Citadel walls, Mahasthangarh Museum, Gokul Medh (Behula''s Basar Ghar), Shah Sultan Balkhi''s shrine, Bhasu Vihara', 'Hot summers and cool, dry winters.', 'The sites are spread out, so hire a rickshaw-van. Try the local kotkoti sweets.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/32-mahasthangarh/image.jpg', 0.0, 338, 'https://maps.google.com/maps?q=Mahasthangarh%2C%20Shibganj%2C%20Bogura&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/32-mahasthangarh/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/32-mahasthangarh/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/32-mahasthangarh/image3.jpg', 0);
INSERT INTO public.destination VALUES (33, 'Puthia Temple Complex', 'Puthia, about 23 km east of Rajshahi, has the largest group of historic Hindu temples in Bangladesh, built by the zamindars of the Puthia estate. Highlights include the Shiva Temple of 1823, the terracotta-covered Govinda Temple and the Puthia Rajbari palace.', 'Shiva Temple, Govinda Temple, Dol Mandir, Puthia Rajbari', 'Hot summers and cold winters.', 'Allow half a day, and dress modestly in the temples that are still in use.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/33-puthia-temple-complex/image.jpg', 0.0, 384, 'https://maps.google.com/maps?q=Puthia%20Temple%20Complex%2C%20Rajshahi&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/33-puthia-temple-complex/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/33-puthia-temple-complex/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/33-puthia-temple-complex/image3.jpg', 0);
INSERT INTO public.destination VALUES (34, 'Kantajew Temple', 'Kantajew Temple in Kaharol, Dinajpur, is an 18th-century Hindu temple completed in 1752. Every wall is covered in terracotta panels showing scenes from the Mahabharata, the Ramayana and everyday life.', 'Terracotta panels of the temple, Rash Mela fair, nearby Nayabad Mosque', 'Hot summers and cold, foggy winters.', 'The temple is about 20 km north of Dinajpur town. Morning light shows the terracotta details best.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/34-kantajew-temple/image.jpg', 0.0, 404, 'https://maps.google.com/maps?q=Kantajew%20Temple%2C%20Dinajpur&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/34-kantajew-temple/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/34-kantajew-temple/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/34-kantajew-temple/image3.jpg', 0);
INSERT INTO public.destination VALUES (35, 'Tajhat Palace', 'Tajhat Palace in Rangpur was built in the early 20th century by Maharaja Kumar Gopal Lal Roy. The white palace with its grand central staircase now houses the Rangpur Museum.', 'Palace museum, grand marble staircase, gardens and ponds', 'Hot summers and cold winters.', 'The museum is ticketed, and photography inside may be restricted.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/35-tajhat-palace/image.jpg', 0.0, 511, 'https://maps.google.com/maps?q=Tajhat%20Palace%2C%20Rangpur&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/35-tajhat-palace/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/35-tajhat-palace/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/35-tajhat-palace/image3.jpg', 0);
INSERT INTO public.destination VALUES (36, 'Tetulia', 'Tetulia, the northernmost upazila of Bangladesh in Panchagarh, is known for its flat-land tea gardens and, on clear days, a view of Kanchenjunga from the banks of the Mahananda River. The Banglabandha zero point is nearby.', 'Kanchenjunga view, tea gardens, Mahananda River, Banglabandha zero point', 'The coldest part of Bangladesh in winter; mountain views are clearest from October to December.', 'Be by the river at sunrise for the best chance of seeing Kanchenjunga.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/36-tetulia/image.jpg', 0.0, 439, 'https://maps.google.com/maps?q=Tetulia%2C%20Panchagarh&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/36-tetulia/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/36-tetulia/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/36-tetulia/image3.jpg', 0);
INSERT INTO public.destination VALUES (37, 'Sixty Dome Mosque', 'The Sixty Dome Mosque (Shat Gombuj Masjid) in Bagerhat was built in the 15th century by Khan Jahan Ali and is the largest medieval mosque in Bangladesh. It is the centrepiece of the UNESCO-listed Historic Mosque City of Bagerhat.', 'Sixty Dome Mosque, Khan Jahan Ali''s shrine, Singair Mosque, Bagerhat Museum, Ghora Dighi', 'Hot, humid summers, monsoon rain and mild winters.', 'Dress modestly and remove your shoes inside. Bagerhat is an easy day trip from Khulna.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/37-sixty-dome-mosque/image.jpg', 0.0, 234, 'https://maps.google.com/maps?q=Sixty%20Dome%20Mosque%2C%20Bagerhat&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/37-sixty-dome-mosque/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/37-sixty-dome-mosque/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/37-sixty-dome-mosque/image3.jpg', 0);
INSERT INTO public.destination VALUES (38, 'Shilaidaha Kuthibari', 'Shilaidaha Kuthibari in Kumarkhali, Kushtia, is the house where Rabindranath Tagore stayed in the 1890s while managing his family''s estates, writing many of his poems here. The house near the Padma is now a museum.', 'Tagore''s house museum, gardens and pond, Padma River, Lalon Shah''s shrine in Kushtia', 'Hot summers and mild winters.', 'Visit Lalon Shah''s shrine at Cheuriya, Kushtia, on the same trip.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/38-shilaidaha-kuthibari/image.jpg', 0.0, 273, 'https://maps.google.com/maps?q=Shilaidaha%20Kuthibari%2C%20Kushtia&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/38-shilaidaha-kuthibari/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/38-shilaidaha-kuthibari/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/38-shilaidaha-kuthibari/image3.jpg', 0);
INSERT INTO public.destination VALUES (39, 'Durga Sagar', 'Durga Sagar, known locally as Madhabpasha Dighi, is the largest lake in southern Bangladesh, about 11 km from Barishal city. Rani Durgabati, mother of Raja Joy Narayan, had it dug in 1780. Its tree-lined banks and small man-made island make it a quiet picnic spot that draws migratory birds in winter.', 'The lake and its island, walking path around the banks, migratory birds in winter', 'Hot, humid summers, heavy monsoon rain and mild winters.', 'Go on a winter morning to see the birds. There is a small entry fee.', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/39-durga-sagar/image.jpg', 0.0, 8, 'https://maps.google.com/maps?q=Durga%20Sagar%2C%20Babuganj%2C%20Barishal&z=13&output=embed', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/39-durga-sagar/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/39-durga-sagar/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/destinations/39-durga-sagar/image3.jpg', 0);


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
INSERT INTO public.destination_type VALUES (12, 10, 7);
INSERT INTO public.destination_type VALUES (13, 11, 4);
INSERT INTO public.destination_type VALUES (14, 12, 2);
INSERT INTO public.destination_type VALUES (15, 12, 5);
INSERT INTO public.destination_type VALUES (16, 13, 4);
INSERT INTO public.destination_type VALUES (17, 13, 2);
INSERT INTO public.destination_type VALUES (18, 14, 1);
INSERT INTO public.destination_type VALUES (19, 15, 1);
INSERT INTO public.destination_type VALUES (20, 15, 2);
INSERT INTO public.destination_type VALUES (21, 16, 2);
INSERT INTO public.destination_type VALUES (22, 16, 6);
INSERT INTO public.destination_type VALUES (23, 17, 2);
INSERT INTO public.destination_type VALUES (24, 18, 4);
INSERT INTO public.destination_type VALUES (25, 18, 5);
INSERT INTO public.destination_type VALUES (26, 19, 1);
INSERT INTO public.destination_type VALUES (27, 19, 5);
INSERT INTO public.destination_type VALUES (28, 20, 1);
INSERT INTO public.destination_type VALUES (29, 20, 5);
INSERT INTO public.destination_type VALUES (30, 21, 4);
INSERT INTO public.destination_type VALUES (31, 21, 5);
INSERT INTO public.destination_type VALUES (32, 22, 2);
INSERT INTO public.destination_type VALUES (33, 22, 1);
INSERT INTO public.destination_type VALUES (34, 23, 5);
INSERT INTO public.destination_type VALUES (35, 24, 3);
INSERT INTO public.destination_type VALUES (36, 25, 2);
INSERT INTO public.destination_type VALUES (37, 26, 1);
INSERT INTO public.destination_type VALUES (38, 26, 3);
INSERT INTO public.destination_type VALUES (39, 27, 4);
INSERT INTO public.destination_type VALUES (40, 27, 3);
INSERT INTO public.destination_type VALUES (41, 28, 3);
INSERT INTO public.destination_type VALUES (42, 28, 7);
INSERT INTO public.destination_type VALUES (43, 29, 7);
INSERT INTO public.destination_type VALUES (44, 30, 4);
INSERT INTO public.destination_type VALUES (45, 30, 3);
INSERT INTO public.destination_type VALUES (46, 31, 7);
INSERT INTO public.destination_type VALUES (47, 32, 7);
INSERT INTO public.destination_type VALUES (48, 33, 7);
INSERT INTO public.destination_type VALUES (49, 34, 7);
INSERT INTO public.destination_type VALUES (50, 35, 7);
INSERT INTO public.destination_type VALUES (51, 36, 6);
INSERT INTO public.destination_type VALUES (52, 36, 1);
INSERT INTO public.destination_type VALUES (53, 37, 7);
INSERT INTO public.destination_type VALUES (54, 38, 7);
INSERT INTO public.destination_type VALUES (55, 39, 2);


--
-- Data for Name: destination_wishlist; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: flight; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.flight VALUES (41, 'US-Bangla', 6, 5, '1970-01-01 07:30:00', '1970-01-01 08:35:00', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/flights/us-bangla.jpg', 'Round Trip', '1970-01-01 16:30:00', '1970-01-01 17:35:00', 14000, 20000, 32000);
INSERT INTO public.flight VALUES (42, 'Air Astra', 7, 6, '1970-01-01 16:30:00', '1970-01-01 17:35:00', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/flights/air-astra.jpg', 'Round Trip', '1970-01-01 16:30:00', '1970-01-01 17:35:00', 16000, 22000, 34000);
INSERT INTO public.flight VALUES (43, 'Novo Air', 8, 7, '1970-01-01 07:30:00', '1970-01-01 08:35:00', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/flights/novo-air.jpg', 'Round Trip', '1970-01-01 16:30:00', '1970-01-01 17:35:00', 18000, 24000, 36000);
INSERT INTO public.flight VALUES (44, 'Air Astra', 1, 2, '1970-01-01 14:30:00', '1970-01-01 15:25:00', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/flights/air-astra.jpg', 'One Way', NULL, NULL, 6000, 9000, 15000);
INSERT INTO public.flight VALUES (45, 'Air Astra', 1, 2, '1970-01-01 07:40:00', '1970-01-01 08:45:00', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/flights/air-astra.jpg', 'One Way', NULL, NULL, 6000, 9000, 15000);
INSERT INTO public.flight VALUES (46, 'US-Bangla', 1, 2, '1970-01-01 07:30:00', '1970-01-01 08:35:00', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/flights/us-bangla.jpg', 'One Way', NULL, NULL, 8000, 11000, 17000);
INSERT INTO public.flight VALUES (47, 'Air Astra', 1, 2, '1970-01-01 16:30:00', '1970-01-01 17:35:00', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/flights/air-astra.jpg', 'Round Trip', '1970-01-01 16:30:00', '1970-01-01 17:35:00', 6000, 9000, 15000);
INSERT INTO public.flight VALUES (48, 'Novo Air', 1, 2, '1970-01-01 07:30:00', '1970-01-01 08:35:00', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/flights/novo-air.jpg', 'One Way', NULL, NULL, 7000, 10000, 16000);
INSERT INTO public.flight VALUES (49, 'US-Bangla', 1, 2, '1970-01-01 09:00:00', '1970-01-01 10:05:00', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/flights/us-bangla.jpg', 'One Way', NULL, NULL, 8000, 11000, 17000);
INSERT INTO public.flight VALUES (50, 'Biman Bangladesh', 1, 2, '1970-01-01 15:30:00', '1970-01-01 16:35:00', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/flights/biman-bangladesh.jpg', 'One Way', NULL, NULL, 9000, 12000, 18000);
INSERT INTO public.flight VALUES (51, 'Air Astra', 1, 5, '1970-01-01 07:40:00', '1970-01-01 08:35:00', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/flights/air-astra.jpg', 'One Way', NULL, NULL, 6000, 9000, 15000);
INSERT INTO public.flight VALUES (52, 'US-Bangla', 1, 5, '2024-03-10 18:00:00', '2024-03-12 20:08:00', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/flights/us-bangla.jpg', 'One Way', NULL, NULL, 8000, 10000, 16000);
INSERT INTO public.flight VALUES (53, 'Air Astra', 2, 1, '1970-01-01 14:30:00', '1970-01-01 15:25:00', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/flights/air-astra.jpg', 'One Way', NULL, NULL, 6000, 9000, 15000);
INSERT INTO public.flight VALUES (54, 'Air Astra', 3, 2, '1970-01-01 07:40:00', '1970-01-01 08:45:00', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/flights/air-astra.jpg', 'One Way', NULL, NULL, 6000, 9000, 15000);
INSERT INTO public.flight VALUES (55, 'US-Bangla', 8, 3, '1970-01-01 07:30:00', '1970-01-01 08:35:00', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/flights/us-bangla.jpg', 'One Way', NULL, NULL, 8000, 11000, 17000);
INSERT INTO public.flight VALUES (56, 'Air Astra', 5, 8, '1970-01-01 16:30:00', '1970-01-01 17:35:00', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/flights/air-astra.jpg', 'One Way', NULL, NULL, 6000, 9000, 15000);
INSERT INTO public.flight VALUES (57, 'Novo Air', 2, 3, '1970-01-01 07:30:00', '1970-01-01 08:35:00', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/flights/novo-air.jpg', 'One Way', NULL, NULL, 7000, 10000, 16000);
INSERT INTO public.flight VALUES (58, 'US-Bangla', 2, 8, '1970-01-01 09:00:00', '1970-01-01 10:05:00', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/flights/us-bangla.jpg', 'One Way', NULL, NULL, 8000, 11000, 17000);
INSERT INTO public.flight VALUES (59, 'Biman Bangladesh', 2, 5, '1970-01-01 15:30:00', '1970-01-01 16:35:00', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/flights/biman-bangladesh.jpg', 'One Way', NULL, NULL, 9000, 12000, 18000);
INSERT INTO public.flight VALUES (60, 'Air Astra', 3, 5, '1970-01-01 07:40:00', '1970-01-01 08:35:00', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/flights/air-astra.jpg', 'One Way', NULL, NULL, 6000, 9000, 15000);
INSERT INTO public.flight VALUES (61, 'Biman Bangladesh', 3, 5, '1970-01-01 15:30:00', '1970-01-01 16:35:00', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/flights/biman-bangladesh.jpg', 'One Way', NULL, NULL, 9000, 12000, 18000);


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

INSERT INTO public.restaurant VALUES (1, 'Mermaid Cafe', 'Seafood', 0.0, 89, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29713.624727556853!2d91.94227941083983!3d21.421260900000018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc87ce9c0fb4d%3A0x83536e3b5f20191b!2sMermaid%20Cafe!5e0!3m2!1sen!2sbd!4v1708931328639!5m2!1sen!2sbd', 4, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/1-mermaid-cafe/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/1-mermaid-cafe/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/1-mermaid-cafe/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/1-mermaid-cafe/image3.jpg', '01841416461', 'Near Dragon Mart, Kolatoli Road, Sugandha Beach Sea In point, Hotel Motel, Cox''s Bazar 4700', 'https://www.facebook.com/mermaidcafe/?ref=page_internal', 'https://mermaidcafechillng.wixsite.com/mermaidcafe?fbclid=IwAR2mU_EN3K6Ay9feM-y0rt4jBvbrTTM-XPaojPi7Z-3wemzkyIVlncmIQeo', '
mermaidcafechillngrill@gmail.com', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', '$$', 1000, 0);
INSERT INTO public.restaurant VALUES (2, 'Salt Bistro & Cafe', 'Seafood', 0.0, 89, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29712.37197875065!2d91.94158761083985!3d21.427417300000013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc8655a31efcb%3A0x5da86c8f26b26ec3!2sSalt%20Bistro%20%26%20Cafe!5e0!3m2!1sen!2sbd!4v1708940507424!5m2!1sen!2sbd', 5, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/2-salt-bistro-cafe/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/2-salt-bistro-cafe/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/2-salt-bistro-cafe/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/2-salt-bistro-cafe/image3.jpg', '01816155651', '10, Kalatoli, Hotel-Motel Zone, Cox''s Bazar 4700', 'https://www.facebook.com/SaltCoxsBazar/', 'https://saltbistroandcafe.wordpress.com/', '
saltbistroandcafe@gmail.com', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', '$$$', 800, 0);
INSERT INTO public.restaurant VALUES (3, 'Handi', 'Indian', 0.0, 89, 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3714.0441321382445!2d91.97171617381042!3d21.42751027396639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30adc865f13d8687%3A0xf97cee3a853b3a07!2sHandi%20(Cox''s%20Bazar%20Branch)!5e0!3m2!1sen!2sbd!4v1709597503316!5m2!1sen!2sbd', 3, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/3-handi/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/3-handi/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/3-handi/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/3-handi/image3.jpg', '01886342628', 'Hotel Ovishar, Sea Laboni Point, Laboni Beach Rd, Cox''s Bazar 4700', 'https://www.facebook.com/profile.php?id=100064343521589', 'https://handi.com/', 'handi.gulshan9900@gmail.com', 'Y', 'N', 'N', 'Y', 'Y', 'Y', '$$', 500, 0);
INSERT INTO public.restaurant VALUES (4, 'Haji Biriyani', 'Bangladeshi', 0.0, 505, 'https://maps.google.com/maps?q=Haji%20Biriyani%2C%2070%20Kazi%20Alauddin%20Road%2C%20Nazira%20Bazar%2C%20Dhaka&z=15&output=embed', 2, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/4-haji-biriyani/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/4-haji-biriyani/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/4-haji-biriyani/image2.jpg', NULL, '01711523505', '70 Kazi Alauddin Road, Nazira Bazar, Old Dhaka, Dhaka 1000', NULL, 'https://hajibiriyani.com/', 'shahedhossain0982@gmail.com', 'N', 'N', 'Y', 'Y', 'Y', 'N', '$', 300, 0);
INSERT INTO public.restaurant VALUES (5, 'Beauty Lacchi', 'Bangladeshi', 0.0, 505, 'https://maps.google.com/maps?q=Beauty%20Lacchi%2C%2030%2FA%20Johnson%20Road%2C%20Dhaka&z=15&output=embed', 1, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/5-beauty-lacchi/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/5-beauty-lacchi/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/5-beauty-lacchi/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/5-beauty-lacchi/image3.jpg', '01619050420', '30/A Johnson Road, Old Dhaka, Dhaka 1100', NULL, NULL, NULL, 'N', 'N', 'N', 'Y', 'Y', 'N', '$', 300, 0);
INSERT INTO public.restaurant VALUES (6, 'Nirob Hotel', 'Bangladeshi', 0.0, 505, 'https://maps.google.com/maps?q=Nirob%20Hotel%2C%20Nazimuddin%20Road%2C%20Old%20Dhaka&z=15&output=embed', 1, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/6-nirob-hotel/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/6-nirob-hotel/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/6-nirob-hotel/image2.jpg', NULL, NULL, 'Nazimuddin Road, Old Dhaka, Dhaka 1100', NULL, NULL, NULL, 'N', 'N', 'N', 'Y', 'Y', 'N', '$', 300, 0);
INSERT INTO public.restaurant VALUES (7, 'Bismillah Kabab Ghar', 'Bangladeshi', 0.0, 505, 'https://maps.google.com/maps?q=Bismillah%20Kabab%20Ghar%2C%20Kazi%20Alauddin%20Road%2C%20Nazira%20Bazar%2C%20Dhaka&z=15&output=embed', 1, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/7-bismillah-kabab-ghar/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/7-bismillah-kabab-ghar/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/7-bismillah-kabab-ghar/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/7-bismillah-kabab-ghar/image3.jpg', '01819295824', 'Kazi Alauddin Road, Nazira Bazar, Old Dhaka, Dhaka 1000', NULL, NULL, NULL, 'N', 'N', 'N', 'Y', 'Y', 'N', '$', 300, 0);
INSERT INTO public.restaurant VALUES (8, 'Beauty Boarding', 'Bangladeshi', 0.0, 505, 'https://maps.google.com/maps?q=Beauty%20Boarding%2C%20Sreesh%20Das%20Lane%2C%20Banglabazar%2C%20Dhaka&z=15&output=embed', 2, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/8-beauty-boarding/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/8-beauty-boarding/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/8-beauty-boarding/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/8-beauty-boarding/image3.jpg', NULL, 'Sreesh Das Lane, Banglabazar, Old Dhaka, Dhaka 1100', NULL, NULL, NULL, 'N', 'N', 'N', 'Y', 'N', 'N', '$$', 500, 0);
INSERT INTO public.restaurant VALUES (9, 'Al Razzak Restaurant', 'Bangladeshi', 0.0, 505, 'https://maps.google.com/maps?q=Al%20Razzak%20Restaurant%2C%2029%2F1%20North%20South%20Road%2C%20Bangshal%2C%20Dhaka&z=15&output=embed', 2, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/9-al-razzak-restaurant/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/9-al-razzak-restaurant/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/9-al-razzak-restaurant/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/9-al-razzak-restaurant/image3.jpg', '01309607683', '29/1 North South Road, Bangshal, Old Dhaka, Dhaka 1100', NULL, NULL, NULL, 'N', 'N', 'N', 'Y', 'Y', 'N', '$$', 500, 0);
INSERT INTO public.restaurant VALUES (10, 'Niribili Restora', 'Bangladeshi', 0.0, 315, 'https://maps.google.com/maps?q=Niribili%20Restora%2C%20Ukilpara%20Road%2C%20Durgapur%2C%20Netrokona&z=15&output=embed', 2, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/10-niribili-restora/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/10-niribili-restora/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/10-niribili-restora/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/10-niribili-restora/image3.jpg', '01977100834', 'Ukilpara Road, Durgapur, Netrokona', NULL, NULL, NULL, 'N', 'Y', 'N', 'Y', 'Y', 'Y', '$', 300, 0);
INSERT INTO public.restaurant VALUES (11, 'Hotel Nirala', 'Bangladeshi', 0.0, 315, 'https://maps.google.com/maps?q=Hotel%20Nirala%2C%20Durgapur%2C%20Netrokona&z=15&output=embed', 2, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/11-hotel-nirala/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/11-hotel-nirala/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/11-hotel-nirala/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/11-hotel-nirala/image3.jpg', '01712786798', 'Durgapur Bazar area (Plus code 4MCG+F2W), Durgapur, Netrokona', NULL, NULL, NULL, 'N', 'N', 'N', 'Y', 'Y', 'Y', '$', 300, 0);
INSERT INTO public.restaurant VALUES (12, 'Rongdhonu Cafe & Restaurant', 'Bangladeshi', 0.0, 315, 'https://maps.google.com/maps?q=Rongdhonu%20Cafe%20and%20Restaurant%20(%E0%A6%B0%E0%A6%82%E0%A6%A7%E0%A6%A8%E0%A7%81%20%E0%A6%95%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%AB%E0%A7%87%20%E0%A6%8F%E0%A6%A8%E0%A7%8D%E0%A6%A1%20%E0%A6%B0%E0%A7%87%E0%A6%B8%E0%A7%8D%E0%A6%9F%E0%A7%81%E0%A6%B0%E0%A7%87%E0%A6%A8%E0%A7%8D%E0%A6%9F)%2C%20Shyamganj%20Road%2C%20Durgapur&z=15&output=embed', 2, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/12-rongdhonu-cafe-restaurant/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/12-rongdhonu-cafe-restaurant/image1.jpg', NULL, NULL, '01953838244', 'Shyamganj Road, Durgapur 2420, Netrokona', 'https://www.facebook.com/rainbowdurgapur/', NULL, NULL, 'N', 'Y', 'N', 'Y', 'Y', 'Y', '$$', 500, 0);
INSERT INTO public.restaurant VALUES (13, 'Panshi Restaurant (Sunamganj)', 'Bangladeshi', 0.0, 478, 'https://maps.google.com/maps?q=Panshi%20Restaurant%2C%20Old%20Bus%20Stand%2C%20Sunamganj&z=15&output=embed', 2, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/13-panshi-restaurant-sunamganj/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/13-panshi-restaurant-sunamganj/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/13-panshi-restaurant-sunamganj/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/13-panshi-restaurant-sunamganj/image3.jpg', '01304189202', 'Old Bus Stand, Teghoria Road, Sunamganj 3000', NULL, NULL, NULL, 'N', 'Y', 'N', 'Y', 'Y', 'Y', '$$', 500, 0);
INSERT INTO public.restaurant VALUES (14, 'Ambrosia Family Dine and Party Centre', 'Chinese', 0.0, 478, 'https://maps.google.com/maps?q=Ambrosia%20Family%20Dine%20and%20Party%20Centre%2C%20Hasan%20Nagar%20Road%2C%20Sunamganj&z=15&output=embed', 3, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/14-ambrosia-family-dine-and-party-centre/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/14-ambrosia-family-dine-and-party-centre/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/14-ambrosia-family-dine-and-party-centre/image2.jpg', NULL, '01886900646', 'H.M.P School - Girls School - Hasan Nagar Road, Sunamganj', 'https://www.facebook.com/ambrosiafamilydine/', NULL, NULL, 'N', 'Y', 'N', 'Y', 'Y', 'N', '$$', 500, 0);
INSERT INTO public.restaurant VALUES (15, 'Shaheen''s Cafe & Restaurant', 'Bangladeshi', 0.0, 478, 'https://maps.google.com/maps?q=Shaheen''s%20Cafe%20%26%20Restaurant%2C%20Kutubpur%2C%20Sunamganj&z=15&output=embed', 2, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/15-shaheens-cafe-restaurant/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/15-shaheens-cafe-restaurant/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/15-shaheens-cafe-restaurant/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/15-shaheens-cafe-restaurant/image3.jpg', '01712239206', 'Opposite Sunamganj Housing Estate gate, Kutubpur, Sunamganj 3000', 'https://www.facebook.com/Shaheenscafe', NULL, NULL, 'N', 'Y', 'N', 'Y', 'Y', 'Y', '$$', 500, 0);
INSERT INTO public.restaurant VALUES (16, 'River Queen Restaurant', 'Bangladeshi', 0.0, 488, 'https://maps.google.com/maps?q=River%20Queen%20Restaurant%2C%20Lala%20Khal%2C%20Jaintiapur&z=15&output=embed', 3, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/16-river-queen-restaurant/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/16-river-queen-restaurant/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/16-river-queen-restaurant/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/16-river-queen-restaurant/image3.jpg', NULL, 'Lalakhal Point (Nazimgarh Lalakhal), Lalakhal, Jaintiapur, Sylhet', NULL, 'https://www.nazimgarh.com/nazimgarh-lalakhal/', NULL, 'N', 'N', 'N', 'Y', 'N', 'Y', '$$$', 800, 0);
INSERT INTO public.restaurant VALUES (17, 'Shuruchi Restaurant (Sarighat)', 'Bangladeshi', 0.0, 488, 'https://maps.google.com/maps?q=Shuruchi%20Restaurant%2C%20Sarighat%20Bridge%2C%20Sylhet-Tamabil%20Highway&z=15&output=embed', 1, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/17-shuruchi-restaurant-sarighat/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/17-shuruchi-restaurant-sarighat/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/17-shuruchi-restaurant-sarighat/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/17-shuruchi-restaurant-sarighat/image3.jpg', '01722625086', 'Sarighat Bridge, Sylhet-Tamabil Highway, Jaintiapur, Sylhet', NULL, NULL, NULL, 'N', 'N', 'N', 'Y', 'Y', 'Y', '$', 300, 0);
INSERT INTO public.restaurant VALUES (18, 'Queen''s Garden of Jaintiapur', 'Cafe', 0.0, 488, 'https://maps.google.com/maps?q=Queen''s%20Garden%20of%20Jaintiapur%2C%20Alubagan%2C%20Sylhet-Tamabil%20Highway&z=15&output=embed', 3, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/18-queens-garden-of-jaintiapur/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/18-queens-garden-of-jaintiapur/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/18-queens-garden-of-jaintiapur/image2.jpg', NULL, '01716355862', 'Alubagan, Sylhet-Tamabil Highway, Jaintapur (near Jaflong), Sylhet', 'https://www.facebook.com/profile.php?id=100087507191861', NULL, NULL, 'N', 'Y', 'N', 'Y', 'Y', 'Y', '$$', 500, 0);
INSERT INTO public.restaurant VALUES (19, 'Parjatan Restaurant Madhabkunda', 'Bangladeshi', 0.0, 462, 'https://maps.google.com/maps?q=Parjatan%20Restaurant%2C%20Madhabkunda%20Waterfall%2C%20Barlekha&z=15&output=embed', 2, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/19-parjatan-restaurant-madhabkunda/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/19-parjatan-restaurant-madhabkunda/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/19-parjatan-restaurant-madhabkunda/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/19-parjatan-restaurant-madhabkunda/image3.jpg', '01710558833', 'Madhabkunda Waterfall area, Madhabkunda Eco Park, Barlekha, Moulvibazar', NULL, NULL, NULL, 'N', 'N', 'N', 'Y', 'Y', 'Y', '$$', 500, 0);
INSERT INTO public.restaurant VALUES (20, 'Yummy Paradise Chinese Restaurant & Party Center', 'Chinese', 0.0, 462, 'https://maps.google.com/maps?q=Yummy%20Paradise%20Chinese%20Restaurant%20%26%20Party%20Center%2C%20Barlekha&z=15&output=embed', 3, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/20-yummy-paradise-chinese-restaurant-party-center/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/20-yummy-paradise-chinese-restaurant-party-center/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/20-yummy-paradise-chinese-restaurant-party-center/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/20-yummy-paradise-chinese-restaurant-party-center/image3.jpg', '01890192500', 'Barlekha Bazar, Barlekha, Moulvibazar', NULL, NULL, NULL, 'N', 'N', 'N', 'Y', 'Y', 'N', '$$', 500, 0);
INSERT INTO public.restaurant VALUES (21, 'Divan Restaurant', 'Bangladeshi', 0.0, 462, 'https://maps.google.com/maps?q=Divan%20Restaurant%2C%20Barlekha%2C%20Moulvibazar&z=15&output=embed', 2, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/21-divan-restaurant/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/21-divan-restaurant/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/21-divan-restaurant/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/21-divan-restaurant/image3.jpg', '01716968685', 'Barlekha Bazar (Plus code P53R+743), Barlekha 3250, Moulvibazar', NULL, NULL, NULL, 'N', 'Y', 'N', 'Y', 'Y', 'N', '$', 300, 0);
INSERT INTO public.restaurant VALUES (22, 'Panshi Restaurant', 'Bangladeshi', 0.0, 512, 'https://maps.google.com/maps?q=Panshi%20Restaurant%2C%20Jallarpar%20Road%2C%20Zindabazar%2C%20Sylhet&z=15&output=embed', 2, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/22-panshi-restaurant/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/22-panshi-restaurant/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/22-panshi-restaurant/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/22-panshi-restaurant/image3.jpg', '01761152939', 'Jallarpar Road, Zindabazar, Sylhet 3100', NULL, 'https://panshirestaurant.shop/', 'panshirestaurant@yahoo.com', 'N', 'N', 'N', 'Y', 'Y', 'Y', '$$', 500, 0);
INSERT INTO public.restaurant VALUES (23, 'Pach Bhai Restaurant', 'Bangladeshi', 0.0, 512, 'https://maps.google.com/maps?q=Pach%20Bhai%20Restaurant%2C%20Jallarpar%20Road%2C%20Sylhet&z=15&output=embed', 2, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/23-pach-bhai-restaurant/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/23-pach-bhai-restaurant/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/23-pach-bhai-restaurant/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/23-pach-bhai-restaurant/image3.jpg', '01710459607', 'Jallarpar Road, Zindabazar, Sylhet 3100', NULL, NULL, NULL, 'N', 'N', 'N', 'Y', 'Y', 'N', '$', 300, 0);
INSERT INTO public.restaurant VALUES (24, 'Palki Restaurant', 'Bangladeshi', 0.0, 512, 'https://maps.google.com/maps?q=Palki%20Restaurant%2C%20Shohir%20Plaza%2C%20Ambarkhana%2C%20Sylhet&z=15&output=embed', 2, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/24-palki-restaurant/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/24-palki-restaurant/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/24-palki-restaurant/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/24-palki-restaurant/image3.jpg', '01958495450', 'Shohir Plaza, Ambarkhana, Sylhet 3100', 'https://www.facebook.com/palki.2014.bd/', NULL, NULL, 'N', 'N', 'N', 'Y', 'Y', 'N', '$$', 500, 0);
INSERT INTO public.restaurant VALUES (25, 'Woondaal King Kebab', 'Indian', 0.0, 512, 'https://maps.google.com/maps?q=Woondaal%20King%20Kebab%2C%20East%20Zindabazar%2C%20Sylhet&z=15&output=embed', 3, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/25-woondaal-king-kebab/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/25-woondaal-king-kebab/image1.jpg', NULL, NULL, '01717020505', '465 East Zindabazar, Baruthkhana Road, Sylhet 3100', NULL, 'https://woondaal.com/', 'woondaal@gmail.com', 'Y', 'N', 'Y', 'Y', 'Y', 'N', '$$', 500, 0);
INSERT INTO public.restaurant VALUES (26, 'Spicy Restaurant & Party Center', 'Chinese', 0.0, 512, 'https://maps.google.com/maps?q=Spicy%20Restaurant%20%26%20Party%20Center%2C%20City%20Center%2C%20Zindabazar%2C%20Sylhet&z=15&output=embed', 3, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/26-spicy-restaurant-party-center/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/26-spicy-restaurant-party-center/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/26-spicy-restaurant-party-center/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/26-spicy-restaurant-party-center/image3.jpg', '01779713683', '10th Floor, City Center, Zindabazar Point, Sylhet 3100', NULL, NULL, 'spicybd24@gmail.com', 'Y', 'N', 'N', 'Y', 'Y', 'Y', '$', 300, 0);
INSERT INTO public.restaurant VALUES (27, 'Tin Bhai Restaurant', 'Bangladeshi', 0.0, 483, 'https://maps.google.com/maps?q=Tin%20Bhai%20Restaurant%2C%20Sada%20Pathor%20Highway%2C%20Companiganj%2C%20Sylhet&z=15&output=embed', 1, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/27-tin-bhai-restaurant/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/27-tin-bhai-restaurant/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/27-tin-bhai-restaurant/image2.jpg', NULL, '01710053952', 'Sada Pathor Highway (Sylhet-Bholaganj Road), Companiganj, Sylhet 3140', NULL, NULL, NULL, 'N', 'N', 'N', 'Y', 'Y', 'Y', '$', 300, 0);
INSERT INTO public.restaurant VALUES (28, 'Nilkantha Tea Cabin', 'Cafe', 0.0, 468, 'https://maps.google.com/maps?q=Adi%20Nilkantha%20Tea%20Cabin%2C%20Ramnagar%2C%20Sreemangal&z=15&output=embed', 1, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/28-nilkantha-tea-cabin/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/28-nilkantha-tea-cabin/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/28-nilkantha-tea-cabin/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/28-nilkantha-tea-cabin/image3.jpg', '01714292851', 'Ramnagar Manipuri Para, Kalighat Road, Sreemangal 3210', NULL, NULL, NULL, 'N', 'N', 'N', 'Y', 'N', 'N', '$', 300, 0);
INSERT INTO public.restaurant VALUES (29, 'Kutum Bari Restaurant', 'Bangladeshi', 0.0, 468, 'https://maps.google.com/maps?q=Kutum%20Bari%20Restaurant%2C%20Railway%20Station%20Road%2C%20Sreemangal&z=15&output=embed', 2, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/29-kutum-bari-restaurant/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/29-kutum-bari-restaurant/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/29-kutum-bari-restaurant/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/29-kutum-bari-restaurant/image3.jpg', '01917729780', 'Railway Station Road, Sreemangal 3210', NULL, NULL, NULL, 'N', 'N', 'Y', 'Y', 'Y', 'N', '$$', 500, 0);
INSERT INTO public.restaurant VALUES (30, 'Chamung Restaurant & Eco Cafe', 'Bangladeshi', 0.0, 468, 'https://maps.google.com/maps?q=Chamung%20Restaurant%20%26%20Eco%20Cafe%2C%20Radhanagar%2C%20Sreemangal&z=15&output=embed', 2, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/30-chamung-restaurant-eco-cafe/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/30-chamung-restaurant-eco-cafe/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/30-chamung-restaurant-eco-cafe/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/30-chamung-restaurant-eco-cafe/image3.jpg', '01777913370', 'Zerin Road, Radhanagar (opposite Nishorgo Nirob Eco Cottage), Sreemangal 3210', NULL, NULL, 'chamungrestaurant@gmail.com', 'Y', 'N', 'Y', 'Y', 'Y', 'Y', '$$', 500, 0);
INSERT INTO public.restaurant VALUES (31, 'Poushee Restaurant', 'Bangladeshi', 0.0, 83, 'https://maps.google.com/maps?q=Poushee%20Restaurant%2C%20Hotel%20Sayeman%20Road%2C%20Cox''s%20Bazar&z=15&output=embed', 2, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/31-poushee-restaurant/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/31-poushee-restaurant/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/31-poushee-restaurant/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/31-poushee-restaurant/image3.jpg', '01881222666', 'Hotel Sayeman Road, Jhautala, Cox''s Bazar 4700', NULL, NULL, NULL, 'N', 'N', 'N', 'Y', 'Y', 'N', '$$', 500, 0);
INSERT INTO public.restaurant VALUES (32, 'Koyla Restaurant', 'Indian', 0.0, 83, 'https://maps.google.com/maps?q=Koyla%20Restaurant%2C%20Laboni%20Point%2C%20Cox''s%20Bazar&z=15&output=embed', 3, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/32-koyla-restaurant/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/32-koyla-restaurant/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/32-koyla-restaurant/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/32-koyla-restaurant/image3.jpg', '01324938185', 'Laboni Point, near Stadium, Laboni Beach Road, Cox''s Bazar 4700', 'https://www.facebook.com/koylacoxs', NULL, NULL, 'Y', 'N', 'N', 'Y', 'Y', 'Y', '$$', 500, 0);
INSERT INTO public.restaurant VALUES (33, 'Kasundi Restora', 'Bangladeshi', 0.0, 83, 'https://maps.google.com/maps?q=Kasundi%20Restora%2C%20Hotel%20Kollol%2C%20Laboni%20Point%2C%20Cox''s%20Bazar&z=15&output=embed', 3, 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/33-kasundi-restora/image.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/33-kasundi-restora/image1.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/33-kasundi-restora/image2.jpg', 'https://hnvczysuhftfohwsexpp.supabase.co/storage/v1/object/public/restaurants/33-kasundi-restora/image3.jpg', '01958399523', 'Hotel Kollol, Laboni Beach Point, Sea Beach Road, Cox''s Bazar 4700', NULL, NULL, NULL, 'Y', 'Y', 'N', 'Y', 'Y', 'Y', '$$', 500, 0);


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

SELECT pg_catalog.setval('public.accommodation_accommodation_id_seq', 29, true);


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

SELECT pg_catalog.setval('public.destination_destination_id_seq', 39, true);


--
-- Name: destination_type_destination_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.destination_type_destination_type_id_seq', 55, true);


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

SELECT pg_catalog.setval('public.restaurant_restaurant_id_seq', 33, true);


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

\unrestrict BCN5WbeWPOoPuwLK3k0iW3qyyeaZpMbkWb7arHgaM7nenNB7RQ2x2arAPgU7Omg

