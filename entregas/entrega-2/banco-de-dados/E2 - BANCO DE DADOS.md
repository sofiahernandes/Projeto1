# Descrição das Tabelas Usadas no Projeto
## Introdução
  O presente trabalho tem como objetivo analisar a estrutura e o modelo relacional do banco de dados Arkana (disponível na íntegra em banco.sql), desenvolvido para atender às necessidades do projeto Lideranças Empáticas, uma iniciativa voltada à arrecadação e gestão de doações em contextos sociais e educacionais no centro universitário da FECAP; com base nos conceitos aprendidos nas aulas de Projeto Banco de Dados. O sistema busca oferecer um controle eficiente das contribuições financeiras e alimentícias realizadas por grupos (times) de alunos, acompanhados, averiguados e avaliados por mentores.
  Ao longo deste trabalho, são apresentadas análises individuais de cada tabela, destacando-se sua função no sistema, as boas práticas de modelagem adotadas e os principais insights que justificam as escolhas estruturais do modelo. Dessa forma, busca-se demonstrar como o banco de dados Arkana contribui para a gestão eficiente das doações, reforçando o compromisso do projeto com a organização, confiabilidade e impacto social.

<br/>

--- 
<br/>

## Desenvolvimento
  A seguir, apresento uma análise breve de cada tabela, incluindo os motivos por trás das escolhas de estrutura, boas práticas aplicadas e possíveis melhorias:
<br/>

### Tabela Usuario
```sql
create table Usuario(
	RaUsuario int primary key, 
	NomeUsuario varchar(250) not null, 
	EmailUsuario varchar(250) not null, 
	SenhaUsuario varchar(16) not null,
	TelefoneUsuario varchar(250) not null, 
  Turma varchar(20) not null
);
```

- Tabelas Prisma
```
model Usuario {
  RaUsuario                  Int                          @id
  NomeUsuario                String                       @db.VarChar(250)
  EmailUsuario               String                       @db.VarChar(250)
  SenhaUsuario               String                       @db.VarChar(255)
  TurmaUsuario               String                       @db.VarChar(20)
  TelefoneUsuario            String?                      @db.VarChar(20)
  
  // Relações
  time_usuarios              Time_Usuario[]
  contribuicoes_financeiras  Contribuicao_Financeira[]
  contribuicoes_alimenticias Contribuicao_Alimenticia[]
}
```

  Esta tabela armazena os dados dos usuários (alunos mentores, “líderes” de seus respectivos grupos). O campo RaUsuario (registro acadêmico do aluno) funciona como um identificador único.
  Nela, observa-se a aplicação de boas práticas, como:
- Uso de chave primária simples (RaUsuario), evitando duplicações;
- Campos not null, que garantem integridade dos dados essenciais;
- Separação adequada entre informações pessoais do aluno mentor e da sua equipe (Turma).
  Nesse contexto, este usuário é responsável por cadastrar: seu time (incluindo os participantes), seu mentor (atrelado ao grupo), e as contribuições recebidas pelo seu time.
  Mais adiante, essa tabela é central no modelo, pois conecta o usuário às doações (Contribuicao_Financeira, Contribuicao_Alimenticia) e aos times (Time).
<br/>

### Tabela Mentor
```sql
create table Mentor(
	IdMentor int primary key auto_increment,
	EmailMentor varchar(250) not null,
	IsAdmin boolean not null,
	SenhaMentor varchar(16) not null
);
```

- Tabela Prisma
```
model Mentor {
  IdMentor    Int      @id @default(autoincrement())
  EmailMentor String  @unique @db.VarChar(250) 
  IsAdmin     Boolean?
  SenhaMentor String   @db.VarChar(80)
  times       Time[]   // Relação com Time
}
```

 Esta tabela armazena os mentores (orientadores de equipes) e os administradores do sistema (que possuem mais privilégios).
  Nela, observa-se a aplicação de boas práticas, como:
Uso de auto_increment para simplificar o gerenciamento de IDs;
Campo booleano IsAdmin separa perfis de mentor e administrador sem precisar de tabelas adicionais.
  Nesse contexto, o mentor possui acesso a somente observar o histórico de seu próprio grupo, enquanto o administrador pode observar os históricos de todos os grupos cadastrados. Isto se dá porque as suas funções incluem somente monitorar os times e averiguar os dados cadastrados por eles.
 Ademais, a separação entre Usuario e Mentor é decorrente de papéis distintos no sistema, facilitando o controle de permissões. Essa abordagem facilita a implementação de autenticação e autorização diferenciadas (por exemplo, mentores podem visualizar relatórios, enquanto usuários também cadastram doações).
<br/>

### Tabela Time
```sql
create table Time(
	IdTime int primary key auto_increment,
  NomeTime varchar(250) not null,
  IdMentor int,
  foreign key(IdMentor) references mentor(IdMentor),
);
```

- Tabela Prisma
```
model Time {
  IdTime        Int             @id @default(autoincrement())
  NomeTime      String          @db.VarChar(250)
  IdMentor      Int?
  mentor        Mentor?         @relation(fields: [IdMentor], references: [IdMentor])
  time_usuarios Time_Usuario[]  // Relação com Time_Usuario

  @@index([IdMentor], map: "IdMentor")
}
```
 Esta tabela representa uma equipe que participa do Projeto Lideranças Empáticas, cada uma liderada por um aluno mentor e orientado por um mentor.
  Nela, observa-se a aplicação de boas práticas, como:
- Ligação com as tabelas de Usuario e Mentor por meio de chaves estrangeiras;
- O uso de auto_increment é adequado para identificação única.
<br/>

### Tabela Time_Usuario
```sql
model Time_Usuario {
  IdTimeUsuario int,
  IdTime int not null,
  RaUsuario int not null,
  RaAluno2 int not null,
  RaAluno3 int not null,
  RaAluno4 int not null,
  RaAluno5 int not null,
  RaAluno6 int not null,
  RaAluno7 int not null,
  RaAluno8 int not null,
  RaAluno9 int not null,
  RaAluno10 int not null,
  foreign key(RaUsuario) references usuario(RaUsuario),
  foreign key(IdTime) references time(IdTime)
}
```

- Tabela Prisma
```
model Time_Usuario {
  IdTimeUsuario Int      @id @default(autoincrement())
  IdTime        Int?
  RaUsuario     Int?
  RaAluno2      Int
  RaAluno3      Int
  RaAluno4      Int
  RaAluno5      Int
  RaAluno6      Int
  RaAluno7      Int
  RaAluno8      Int
  RaAluno9      Int?
  RaAluno10     Int?
  
  // Relações
  time          Time?    @relation(fields: [IdTime], references: [IdTime])
  usuario       Usuario? @relation(fields: [RaUsuario], references: [RaUsuario])

  @@index([IdTime], map: "IdTime")
  @@index([RaUsuario], map: "RaUsuario")
}
```
 Esta tabela representa os grupos de alunos (times) que participam do Projeto, estabelecendo uma relação com a tabela time de acordo com o processo de normalização e de boas práticas.
<br/>

### Tabela Contribuicao_Financeira
```sql
create table Contribuicao_Financeira(
  TipoDoacao varchar(100)not null,
	RaUsuario int not null,
	Quantidade decimal(10,2) not null, 
	Meta decimal(10,2),
	Gastos decimal(10,2),
	Fonte varchar(200) not null,
	IdComprovante int,
	IdContribuicaoFinanceira int primary key auto_increment,
	DataContribuicao timestamp default current_timestamp, 
	foreign key (RaUsuario) references usuario(RaUsuario)
	foreign key (IdComprovante) references comprovante(IdComprovante)
);
```

- Tabelas Prisma
```
model Contribuicao_Financeira {
  IdContribuicaoFinanceira Int       @id @default(autoincrement())
  DataContribuicao         DateTime? @default(now()) @db.Timestamp(0)
  Quantidade               Decimal   @db.Decimal(10, 2)
  TipoDoacao               String    @db.VarChar(20)
  Gastos                   Decimal   @db.Decimal(10, 2)
  Meta                     Decimal?  @db.Decimal(10, 2)
  Fonte                    String?   @db.VarChar(200)
  IdComprovante            Int? @unique
  RaUsuario                Int?
  
  usuario                  Usuario?  @relation(fields: [RaUsuario], references: [RaUsuario])
  comprovante              Comprovante? @relation(fields: [IdComprovante], references: [IdComprovante])
  @@index([IdComprovante], map:"IdComprovante")
  @@index([RaUsuario], map: "RaUsuario")
}
```

  Esta tabela registra doações financeiras, vinculadas a um time, por meio de seu aluno mentor.
  Nela, observa-se a aplicação de boas práticas, como:
Chave estrangeira para Usuário garante rastreabilidade das doações;
Utiliza-se também a chave estrangeira que armazena os comprovantes enviados pelo  usuário dentro da contribuição financeira.
O uso do timestamp default current_timestamp automatiza o registro de data;
Campos de controle como Meta e Gastos ajudam na gestão de metas e transparência financeira.

  Nesse contexto, a inclusão do campo Fonte possibilita análises de origem de recursos (ex: eventos, doações diretas etc.), facilitando que mentores e administradores detectem arrecadações com fraudes ou fontes enviesadas.
<br/>

### Tabela Comprovantes 
```sql
create table Comprovante (
	IdComprovante int primary key auto_increment,
	Imagem varchar(255) not null
);
```

- Tabelas Prisma
```
model Comprovante{
  IdComprovante Int @id @default(autoincrement())
  Imagem String @db.VarChar(255)

  contribuicao_financeira   Contribuicao_Financeira?
}
```

Essa tabela armazena o caminho do comprovante enviado pela tabela de contribuições financeiras.
<br/>

### Tabela Contribuicao_Alimenticia
```sql
create table Contribuicao_Alimenticia(
  TipoDoacao varchar(100) not null;
	RaUsuario int not null,
	Quantidade decimal(10,2) not null,
  PesoUnidade float not null,
	Meta decimal(10,2),
	Gastos decimal(10,2),
	Fonte varchar(200) not null,
	Comprovante varchar(200),
	IdContribuicaoAlimenticia int primary key auto_increment,
  IdAlimento int not null,
	DataContribuicao timestamp default current_timestamp, 
	foreign key (RaUsuario) references usuario(RaUsuario),
  foreign key (IdAlimento) references alimento(IdAlimento)
);
```

- Tabela Prisma
```
model Contribuicao_Alimenticia {
  IdContribuicaoAlimenticia Int       @id @default(autoincrement())
  DataContribuicao          DateTime? @default(now()) @db.Timestamp(0)
  TipoDoacao                String    @db.VarChar(20)
  Quantidade                Decimal   @db.Decimal(10, 2)
  PesoUnidade               Float
  Gastos                    Decimal   @db.Decimal(10, 2)
  Meta                      Decimal?  @db.Decimal(10, 2)
  Fonte                     String?   @db.VarChar(200)
  Comprovante               String?   @db.VarChar(200)
  RaUsuario                 Int?
  IdAlimento                Int?
  
  usuario                   Usuario?  @relation(fields: [RaUsuario], references: [RaUsuario])
  alimento                  Alimento? @relation(fields: [IdAlimento], references: [IdAlimento])               
  contribuicoes_alimento    Contribuicao_Alimento[]

  @@index([IdAlimento], map: "IdAlimento")
  @@index([RaUsuario], map: "RaUsuario")
}
```

 Esta tabela armazena doações de alimentos, com vínculo ao tipo de alimento e ao usuário.
  Nela, observa-se a aplicação de boas práticas, como:
Boa normalização com referência direta à tabela Alimento;
Campos Meta, Gastos e Fonte padronizados com a versão financeira (mantendo consistência de modelo das contribuições).
  Além disso, esta tabela permite análises quantitativas e qualitativas das doações (peso total, tipo de alimento mais doado, cumprimento de metas, etc.); sendo o campo PesoUnidade muitíssimo útil para calcular o impacto total das doações e suas respectivas pontuações.
<br/>

### Tabela Alimento
```sql
CREATE TABLE Alimento {
  IdAlimento int primary key,
  NomeAlimento varchar(100) not null,
  Pontuacao int not null,
}
```

- Tabela Prisma
```
model Alimento {
  IdAlimento                 Int                        @id @default(autoincrement())
  NomeAlimento               String                     @db.VarChar(100)
  Pontuacao                  Int
  
  contribuicoes_alimenticias Contribuicao_Alimenticia[]
  contribuicoes_alimento     Contribuicao_Alimento[]
}
```
 Nesse contexto, o catálogo de alimentos que são aceitos nas contribuições alimentícias, com pontuação associada.
  Nela, observa-se a aplicação de boas práticas, como:
Tabela de referência limpa, que permite padronizar cadastros e associar valores simbólicos que permitem a atribuição de notas totais para os times (PontuacaoAlimento).
  Em adição à isto, essa pontuação pode ser usada para a criação de rankings, recompensas e controle do impacto social gerado pelo projeto, incentivando o engajamento dos participantes.

<br/>

### Tabela Contribuicao_Alimento
```sql
CREATE TABLE Contribuicao_Alimento(
  IdContribuicaoAlimento int primary key auto_increment,
  IdAlimento int not null;
  IdContribuicaoAlimenticia int not null;
  foreign key (IdAlimento) references alimento(IdAlimento),
  foreign key (IdContribuicaoAlimenticia) references contribuicao_alimenticia(IdContribuicaoAlimenticia)
);
```

- Tabela Prisma
```
model Contribuicao_Alimento {
  IdContribuicaoAlimento    Int                       @id @default(autoincrement())
  IdAlimento                Int?
  IdContribuicaoAlimenticia Int?
  
  alimento                  Alimento?                 @relation(fields: [IdAlimento], references: [IdAlimento])
  contribuicao_alimenticia  Contribuicao_Alimenticia? @relation(fields: [IdContribuicaoAlimenticia], references: [IdContribuicaoAlimenticia])

  @@index([IdAlimento], map: "IdAlimento")
  @@index([IdContribuicaoAlimenticia], map: "IdContribuicaoAlimenticia")
}
```

 Tendo em vista a relação N:N entre contribuições alimentícias e alimentos, criou-se a tabela Contribuicao_Alimento para relacioná-las.
  Nela, observa-se a aplicação de boas práticas, como:
- Resolve um problema de cardinalidade entre tabelas (uma contribuição arrecadada vários tipos de alimentos).
 Sendo assim, essa estrutura reflete uma modelagem que apresenta preocupação com a manutenção futura do sistema (como o aumento da gama de alimentos).

<br/>

--- 
<br/>

### Conclusão
  O banco de dados Arkana segue uma lógica de modelagem para o contexto de uma plataforma de doações baseada nos conceitos aprendidos durante as aulas de Projeto Banco de Dados e por meio de variadas pesquisas paralelas.
 Em suma, os principais pontos fortes deste banco são:
- Uso consistente de chaves primárias e estrangeiras;
- Separação clara de responsabilidades (usuário, mentor, time, contribuições);
- Boa normalização;
- Presença de campos de gestão e auditoria (Meta, Gastos, Comprovante, DataContribuicao).
