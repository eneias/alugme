
# Alugme Backend

API .NET 8 para gestão de imóveis, locações, contratos e vistorias.

## Recursos

- SQL Server + Entity Framework Core
- Autenticação JWT
- Seed de usuário admin
- Swagger com Bearer
- Docker Compose com SQL Server
- Testes de integração (xUnit)

## Credenciais padrão

- Email: admin@admin.com
- Senha: 123456

## Rodar com Docker

```bash
docker compose up --build
```

API: http://localhost:8080/swagger

## Rodar local (sem docker)

Requisitos:

- .NET 8
- SQL Server

Editar `appsettings.json` connection string.

```bash
cd Alugme.Api
dotnet ef database update
dotnet run
```

## Testes

```bash
cd Alugme.Tests
dotnet test
```
