UPDATE ClientesDB.dbo.Clientes

SET tipo = '1'

WHERE CAST(Nome AS VARCHAR(MAX)) = 'Vitor Assis';

select*from ClientesDB.dbo.Clientes