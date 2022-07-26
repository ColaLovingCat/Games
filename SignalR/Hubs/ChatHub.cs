using Microsoft.AspNetCore.SignalR;

namespace SignalRChat.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(MessageInfo message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }

        public class MessageInfo
        {
            public string category { get; set; }
            public string from { get; set; }
            public string to { get; set; }
            public string contents { get; set; }
            public string remarks { get; set; }
        }
    }
}
