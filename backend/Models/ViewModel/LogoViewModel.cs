using System.ComponentModel.DataAnnotations;

namespace TestScriptTracker.Models.ViewModel
{
    public class LogoViewModel
    {
        //public int LogoId { get; set; }
        public string LogoImage { get; set; } = string.Empty;

        //[Required]
        //public int ThemeId { get; set; }//FK
    }
}
