## ETAPAS DA MODELAGEM DO BANCO DE DADOS USADO NA APLICAÇÃO WEB ARKANA (PROJETO 1) DE GERENCIAMENTO DO PROJETO LIDERANÇAS EMPÁTICAS
Orientadora: Prof. Kátia Milani Lara Bossi

### 1. INTRODUÇÃO
&nbsp;&nbsp;Neste trabalho, estudaremos o caso da aplicação web Arkana, no que se refere à sua modelagem para a implementação de um banco de dados. Esse processo compõe parte do projeto preliminar do seu banco de dados, sendo extremamente relevante para, entre outros fatores, garantir sua organização, conformidade com boas práticas e fácil manutenção.
&nbsp;&nbsp;Nesse contexto, são aqui desenvolvidos um mini-mundo detalhado relativo à aplicação Arkana, tal como um DER (Diagrama Entidade-Relacionamento) que servirá como base para o desenvolvimento do banco de dados SQL.

### 2. MINI MUNDO
&nbsp;&nbsp;Arkana é uma aplicação web desenvolvida para apoiar o projeto Lideranças Empáticas da FECAP. Seu objetivo é facilitar o gerenciamento de doações e eventos, tornando a sua organização mais eficiente. Neste cenário, são criados times e cadastradas as contribuições financeiras ou alimentares que conseguiram como parte de seus projetos.
&nbsp;&nbsp;O primeiro passo do Aluno Mentor (Usuário) dentro da plataforma é realizar o cadastro do seu grupo. Para isso, o sistema exige alguns dados: seu R.A. (Registro Acadêmico), nome completo, telefone, e-mail e uma senha de acesso. Além disso, é necessário cadastrar os dados do Time: seu nome, que servirá como identidade pública, e a turma à qual pertencem os integrantes. Nesse mesmo momento, o Aluno Mentor registra o R.A. de cada integrante do grupo e o e-mail do Mentor, garantindo que todos fiquem devidamente associados ao time criado. Apenas o aluno mentor têm acesso à interface de criação do sistema, que apresenta um menu com três abas principais: o cadastro de novas Contribuições (arrecadações), onde ele registra doações financeiras em reais e doações alimentares em quilos sempre especificando o tipo de alimento entregue (previamente definidos pela plataforma). Nessa mesma aba, ele deve cadastrar gastos, metas, nome do doador/evento e os comprovantes da arrecadação em anexo.
&nbsp;&nbsp;A segunda aba é o histórico, onde se pode visualizar (e deletar) as arrecadações realizadas pelo grupo. Nessa aba, o Mentor pode somente visualizar os arquivos das contribuições.
&nbsp;&nbsp;Por fim, na área de perfil, são apresentados o nome do grupo, o nome e R.A. do Aluno Mentor, o R.A. de cada um dos integrantes e o nome/email do Mentor.
&nbsp;&nbsp;Com isso, o dashboard público é gerado automaticamente pela plataforma Arkana e tem acesso universal. Nele, é possível visualizar o total arrecadado em dinheiro e alimentos, além de quais times cadastraram as arrecadações, separado por dinheiro e comida.


### 3. DIAGRAMA ENTIDADE-RELACIONAMENTO
[aqui]

### 4. CONCLUSÃO
&nbsp;&nbsp;Em suma, neste trabalho, detalhamos as etapas de modelagem do banco de dados para a aplicação web Arkana, essencial para o projeto Lideranças Empáticas da FECAP. Através da elaboração de um mini-mundo e de um Diagrama Entidade-Relacionamento (DER), demonstramos a estrutura lógica e as relações entre as entidades de dados.
&nbsp;&nbsp;Este processo visa garantir a organização, a integridade e a manutenção do banco de dados, elementos cruciais para o sucesso da aplicação e a eficiência do gerenciamento de doações e eventos.
