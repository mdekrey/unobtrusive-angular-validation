using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace ResponsivePath.Validation.Web.Models.Home
{
    public class IndexModel
    {
        public PersonalData Personal { get; set; }

        [Required(ErrorMessage = "URL is required")]
        [Url(ErrorMessage = "Must be a valid web address")]
        public string WebAddress { get; set; }

        [RegularExpression(@"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$", ErrorMessage = "Invalid format for an email address")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Make sure you say how many you want")]
        [Range(1, 4, ErrorMessage = "Must be between 1 and 4")]
        public int Number { get; set; }

        [Required(ErrorMessage = "Password cannot be empty")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Put your password in here again")]
        [Compare("Password", ErrorMessage = "Must be the same as your password")]
        public string Password2 { get; set; }

        [Required]
        public Item[] Items { get; set; }

        [Required]
        public IEnumerable<Item> ItemsFixed { get; set; }
    }
}