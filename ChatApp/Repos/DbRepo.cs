using ChatApp.Database;
using ChatApp.Models;

namespace ChatApp.Repos
{
    public class DbRepo
    {
        private static DbRepo? instance = null;
        private readonly ChatAppContext context;

        private DbRepo()
        {
            context = new ChatAppContext();
        }

        public async void AddMessage(Message message)
        {
            await context.Messages.AddAsync(message);
            context.SaveChanges();
        }

        public List<Message> GetAllMessages()
        {
            return context.Messages.ToList();
        }

        public static DbRepo GetInstance()
        {
            instance ??= new DbRepo();
            return instance;
        }
    }
}

