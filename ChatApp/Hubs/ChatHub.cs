using Microsoft.AspNetCore.SignalR;
using ChatApp.Models;
using ChatApp.Repos;

namespace ChatApp.Hubs
{
    public class ChatHub : Hub
    {
        public static Dictionary<string, string> Users { get; set; } = new Dictionary<string, string>();

        public async Task SetUsername(string username)
        {
            bool isTaken = Users.Where(p => p.Value == username).Any();
            if (isTaken)
            {
                Context.Abort();
                return;
            }
            Users[Context.ConnectionId] = username;
            await Clients.All.SendAsync("OnJoin", username, Users.Count);
        }

        public async Task SendMessage(string message)
        {
            string username = Users[Context.ConnectionId];
            DbRepo.GetInstance().AddMessage(new Message(username, message));
            await Clients.All.SendAsync("OnNewMessage", username, message);
        }

        public override Task OnConnectedAsync()
        {
            foreach (Message message in DbRepo.GetInstance().GetAllMessages())
            {
                Clients.Caller.SendAsync("OnNewMessage", message.Username, message.Content);
            }
            return base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            string username = Users[Context.ConnectionId];
            bool isTaken = Users.Where(p => p.Value == username).Count() > 1;
            if (isTaken)
            {
                return;
            }
            Users.Remove(Context.ConnectionId);
            await Clients.All.SendAsync("OnLeft", username, Users.Count);
        }
    }
}
