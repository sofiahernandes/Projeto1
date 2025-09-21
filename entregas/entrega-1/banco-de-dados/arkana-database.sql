create database Arkana;
use Arkana;

create table usuario(
	RaUsuario int primary key, 
	NomeUsuario varchar(250) not null, 
	EmailUsuario varchar(250) not null, 
	SenhaUsuario varchar(16) not null,
	TelefoneUsuario varchar(250) not null, 
    Turma varchar(20) not null
);

create table mentor(
	IdMentor int primary key auto_increment,
	EmailMentor varchar(250) not null,
	IsAdmin boolean not null,
	SenhaMentor varchar(16) not null
);

create table time(
	IdTime int primary key auto_increment,
    NomeTime varchar(250) not null,
    RaUsuario int not null,
    RaAlunos varchar(300) not null,
    IdMentor int,
    foreign key(IdMentor) references mentor(IdMentor),
    foreign key(RaUsuario) references usuario(RaUsuario)
);

create table contribuicao(
	RaUsuario int,
	TipoDoacao varchar(10) not null,
	Quantidade int not null, 
	Meta int,
	Gastos int,
	Fonte varchar(200),
	Comprovante varchar(200),
	IdContribuicao int primary key auto_increment,
	DataContribuicao timestamp default current_timestamp, 
	foreign key (RaUsuario) references usuario(RaUsuario)
);
