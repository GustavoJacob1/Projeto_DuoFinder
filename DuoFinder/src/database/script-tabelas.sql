DROP DATABASE IF EXISTS duofinder;

CREATE DATABASE duofinder;

USE duofinder;

CREATE TABLE regiao (
	id INT PRIMARY KEY AUTO_INCREMENT,
	sigla VARCHAR(4) NOT NULL UNIQUE,
	nome VARCHAR(30) NOT NULL
);

CREATE TABLE usuario (
	id INT PRIMARY KEY AUTO_INCREMENT,

	nick VARCHAR(16) NOT NULL,
	email VARCHAR(50) NOT NULL UNIQUE,
	senha VARCHAR(50) NOT NULL,

	elo INT NOT NULL,
	fk_regiao INT NOT NULL,

	discord VARCHAR(40) DEFAULT '',
	mostrar_discord VARCHAR(3) DEFAULT 'sim',
	horario VARCHAR(10) NOT NULL,
	bio VARCHAR(200) DEFAULT '',

	data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,

	CONSTRAINT fk_usuario_regiao FOREIGN KEY (fk_regiao) REFERENCES regiao(id),

	CONSTRAINT chk_elo CHECK (elo BETWEEN 200 AND 3000),
	CONSTRAINT chk_horario CHECK (horario IN ('Manhã', 'Tarde', 'Noite', 'Madrugada')),
	CONSTRAINT chk_mostrar_discord CHECK (mostrar_discord IN ('sim', 'nao'))
);

CREATE TABLE lenda (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE usuario_lenda (
	fk_usuario INT,
	fk_lenda INT,
	ordem INT NOT NULL,

	PRIMARY KEY (fk_usuario, fk_lenda),

	CONSTRAINT fk_ul_usuario FOREIGN KEY (fk_usuario) REFERENCES usuario(id),
	CONSTRAINT fk_ul_lenda FOREIGN KEY (fk_lenda) REFERENCES lenda(id),

	CONSTRAINT chk_ordem CHECK (ordem BETWEEN 1 AND 3),
	CONSTRAINT uq_usuario_ordem UNIQUE (fk_usuario, ordem)
);

INSERT INTO regiao (sigla, nome) VALUES
('BRZ', 'Brasil'),
('US-E', 'EUA Leste'),
('EU', 'Europa'),
('SA', 'África do Sul');

INSERT INTO lenda (nome) VALUES
('Hattori'),
('Orion'),
('Kor'),
('Val'),
('Ember'),
('Jhala'),
('Ada'),
('Teros'),
('Koji'),
('Bödvar'),
('Mordex'),
('Artemis'),
('Arcadia'),
('Asuri'),
('Aurus'),
('Azoth'),
('Barraza'),
('Brynn'),
('Caspian'),
('Cassidy'),
('Cross'),
('Diana'),
('Dusk'),
('Ezio'),
('Fait'),
('Gnash'),
('Imugi'),
('Isaiah'),
('Jaeyun'),
('Jiro'),
('Kaya'),
('King Zuva'),
('Lady Vera'),
('Lin Fei'),
('Loki'),
('Lord Vraxx'),
('Lucien'),
('Magyar'),
('Mako'),
('Mirage'),
('Munin'),
('Nix'),
('Onyx'),
('Petra'),
('Priya'),
('Qinghua & Baobao'),
('Queen Nai'),
('Ragnir'),
('Ransom'),
('Rayman'),
('Red Raptor'),
('Reno'),
('Rupture'),
('Scarlet'),
('Sentinel'),
('Seven'),
('Sidra'),
('Sir Roland'),
('Tezca'),
('Thatch'),
('Thea'),
('Thor'),
('Ulgrim'),
('Vector'),
('Vivi'),
('Volkov'),
('Wu Shang'),
('Xull'),
('Yumiko'),
('Zariel');

INSERT INTO usuario (nick, email, senha, elo, fk_regiao, discord, mostrar_discord, horario, bio) VALUES
('Jacob', 'jacob@email.com', 'duofinder2v2', 1950, 1, 'jacob.bh', 'sim', 'Noite', 'Voltando ao ranqueado 2v2 e procurando dupla fixa para jogar à noite.'),
('Zyphr', 'zyphr@email.com', 'duofinder2v2', 1865, 1, 'zyphr.bh', 'sim', 'Noite', 'Main Hattori há 3 temporadas. Procuro dupla fixa para chegar ao Diamante.'),
('Kaizen', 'kaizen@email.com', 'duofinder2v2', 2200, 1, 'kaizen_bh', 'sim', 'Noite', 'Jogo mais de suporte e gosto de quem puxa a luta.'),
('Lunna', 'lunna@email.com', 'duofinder2v2', 1902, 1, 'lunna.gg', 'sim', 'Tarde', 'Ada main, foco em edgeguard. Quero chegar ao Diamante nesta temporada.'),
('ThunderBR', 'thunderbr@email.com', 'duofinder2v2', 2345, 1, 'thunderbr', 'sim', 'Noite', 'Jogo desde 2018. Quero treinar combos de 2v2 e subir com calma.'),
('Mizuki', 'mizuki@email.com', 'duofinder2v2', 1933, 1, '', 'nao', 'Madrugada', 'Prefiro jogar de madrugada. Ainda sem Discord, me chama dentro do jogo.'),
('RatoVeloz', 'ratoveloz@email.com', 'duofinder2v2', 1705, 1, 'ratoveloz', 'sim', 'Tarde', 'Rápido no dodge, ruim de recovery. Bora evoluir junto.'),
('Nox', 'nox@email.com', 'duofinder2v2', 1842, 2, 'nox.na', 'sim', 'Noite', 'Brasileiro jogando no US-E. Falo português e inglês.'),
('Neblina', 'neblina@email.com', 'duofinder2v2', 1980, 1, 'neblina.bh', 'sim', 'Noite', 'Procuro dupla para jogar ranqueada à noite, sem estresse.'),
('Brick', 'brick@email.com', 'duofinder2v2', 2015, 1, 'brick2v2', 'sim', 'Noite', 'Diamante no 2v2. Topo treinar com quem está chegando lá.'),
('Sakura', 'sakura@email.com', 'duofinder2v2', 1611, 1, 'sakura.bh', 'sim', 'Noite', 'Subindo do Ouro. Procuro alguém paciente para jogar junto.'),
('Titan', 'titan@email.com', 'duofinder2v2', 1580, 1, 'titan_2v2', 'sim', 'Noite', 'Treino todo dia. Procuro dupla fixa e comprometida.'),
('Vexa', 'vexa@email.com', 'duofinder2v2', 1480, 3, 'vexa_2v2', 'sim', 'Tarde', 'Jogo no servidor EU, mas falo português.'),
('Kyubi', 'kyubi@email.com', 'duofinder2v2', 1320, 1, '', 'nao', 'Manhã', 'Voltando a jogar depois de um tempo.'),
('Echo', 'echo@email.com', 'duofinder2v2', 1255, 2, 'echo.bh', 'sim', 'Madrugada', 'Gosto de jogar agressivo. Quero alguém que segure a defesa.'),
('Mamute', 'mamute@email.com', 'duofinder2v2', 1150, 1, 'mamute.bh', 'sim', 'Noite', 'Jogador casual querendo levar o 2v2 mais a sério.'),
('Faisca', 'faisca@email.com', 'duofinder2v2', 980, 4, 'faisca.bh', 'sim', 'Tarde', 'Começando no ranqueado. Bora aprender junto.'),
('Pixel', 'pixel@email.com', 'duofinder2v2', 850, 1, 'pixel.bh', 'sim', 'Tarde', 'Primeira temporada no ranqueado.');

INSERT INTO usuario_lenda (fk_usuario, fk_lenda, ordem) VALUES
(1, 1, 1), (1, 2, 2), (1, 3, 3),
(2, 1, 1), (2, 2, 2), (2, 3, 3),
(3, 4, 1), (3, 5, 2), (3, 6, 3),
(4, 7, 1), (4, 8, 2), (4, 9, 3),
(5, 3, 1), (5, 11, 2), (5, 2, 3),
(6, 12, 1), (6, 4, 2), (6, 9, 3),
(7, 10, 1), (7, 1, 2), (7, 5, 3),
(8, 9, 1), (8, 4, 2), (8, 2, 3),
(9, 4, 1), (9, 3, 2), (9, 1, 3),
(10, 8, 1), (10, 3, 2), (10, 6, 3),
(11, 1, 1), (11, 5, 2), (11, 7, 3),
(12, 3, 1), (12, 1, 2), (12, 8, 3),
(13, 2, 1), (13, 12, 2), (13, 5, 3),
(14, 1, 1), (14, 9, 2), (14, 11, 3),
(15, 6, 1), (15, 2, 2), (15, 9, 3),
(16, 8, 1), (16, 10, 2), (16, 3, 3),
(17, 5, 1), (17, 4, 2), (17, 7, 3),
(18, 1, 1), (18, 2, 2), (18, 12, 3);

SELECT * FROM regiao;
SELECT * FROM lenda;
SELECT * FROM usuario;
SELECT * FROM usuario_lenda;

SELECT u.nick, u.elo, r.sigla, r.nome AS regiao
FROM usuario u
JOIN regiao r ON r.id = u.fk_regiao;

SELECT u.nick, l.nome AS lenda, ul.ordem
FROM usuario u
JOIN usuario_lenda ul ON ul.fk_usuario = u.id
JOIN lenda l ON l.id = ul.fk_lenda
ORDER BY u.nick, ul.ordem;

SELECT u.id, u.nick, u.elo, r.sigla AS regiao,
	GROUP_CONCAT(l.nome ORDER BY ul.ordem) AS lendas,
	CASE WHEN u.mostrar_discord = 'sim' THEN u.discord ELSE '' END AS discord
FROM usuario u
JOIN regiao r ON r.id = u.fk_regiao
JOIN usuario_lenda ul ON ul.fk_usuario = u.id
JOIN lenda l ON l.id = ul.fk_lenda
WHERE u.id <> 1
GROUP BY u.id, r.sigla;

SELECT l.nome, COUNT(ul.fk_usuario) AS jogadores
FROM lenda l
LEFT JOIN usuario_lenda ul ON ul.fk_lenda = l.id
GROUP BY l.id, l.nome
ORDER BY jogadores DESC;

SELECT r.sigla, COUNT(u.id) AS jogadores
FROM regiao r
LEFT JOIN usuario u ON u.fk_regiao = r.id
GROUP BY r.id, r.sigla;

SELECT u.nick
FROM usuario u
JOIN usuario_lenda ul ON ul.fk_usuario = u.id
JOIN lenda l ON l.id = ul.fk_lenda
WHERE l.nome = 'Hattori' AND ul.ordem = 1;

SELECT ROUND(AVG(elo)) AS elo_medio FROM usuario;
