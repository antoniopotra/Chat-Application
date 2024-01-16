using System.ComponentModel.DataAnnotations.Schema;

namespace ChatApp.Models
{
    public class Message
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string Username { get; set; }
        public string Content { get; set; }

        public Message(string username, string content)
        {
            Username = username;
            Content = content;
        }
    }
}
