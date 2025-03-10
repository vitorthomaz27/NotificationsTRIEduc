using Microsoft.AspNetCore.SignalR;
using Microsoft.Data.SqlClient;
using System;
using System.Threading;
using System.Threading.Tasks;
using WebApplication1.Hubs;

public class DatabaseMonitorService : IHostedService, IDisposable
{
    private readonly IHubContext<PollHub> _hubContext;
    private readonly string _connectionString = "Server=LAPTOP-U1J53KDF;Database=ClientesDB;Integrated Security=True;TrustServerCertificate=True;MultipleActiveResultSets=True;";
    private bool _disposed = false;
    private SqlDependency _dependency;

    public DatabaseMonitorService(IHubContext<PollHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        SqlDependency.Start(_connectionString);
        RegisterSqlDependency();
        return Task.CompletedTask;
    }

    private void RegisterSqlDependency()
    {
        if (_dependency != null)
        {
            _dependency.OnChange -= OnDataChange;
            _dependency = null;
        }

        using (var connection = new SqlConnection(_connectionString))
        {
            connection.Open();

            using (var command = new SqlCommand("SELECT Nome FROM dbo.Clientes", connection))
            {
                command.Notification = null;

                _dependency = new SqlDependency(command);
                _dependency.OnChange += OnDataChange;

                using (var reader = command.ExecuteReader()) { }
            }
        }
    }

    private void OnDataChange(object sender, SqlNotificationEventArgs e)
    {
        if (e.Type == SqlNotificationType.Change)
        {
            NotifyClients();
            RegisterSqlDependency();
        }
    }

    private async void NotifyClients()
    {
        await _hubContext.Clients.All.SendAsync("ReceiveMessage", "System", "Dados foram alterados no banco de dados", "channel_1", "update");
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        SqlDependency.Stop(_connectionString);
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing && _dependency != null)
            {
                _dependency.OnChange -= OnDataChange;
                _dependency = null;
            }
            _disposed = true;
        }
    }
}
