using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace ResponsivePath.Validation.Web.Models.Home
{
    public class PersonalData
    {
        [Required(ErrorMessage = "You must provide a first name")]
        [StringLength(10, ErrorMessage = "No more than 10 letters")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Gimme your Last name!")]
        public string LastName { get; set; }

        [Required]
        [DataType(System.ComponentModel.DataAnnotations.DataType.Date)]
        public DateTime BirthDate { get; set; }
    }
}
