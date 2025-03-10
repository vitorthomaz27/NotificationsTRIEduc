using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace WebApplication1.Hubs
{
    public class PollHub : Hub
    {
        public async Task EnviarNotificacao(string nomeCliente)
        {
            await Clients.All.SendAsync("ReceiveMessage", nomeCliente, "está processando", "", "").ConfigureAwait(false);
        }
    }
}
