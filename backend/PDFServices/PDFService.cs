using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Threading.Tasks;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using TestScriptTracker.Models.Domain;

namespace TestScriptTracker.PDFServices
{
    public class PDFService
    {
        private readonly string _connectionString;

        public PDFService(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<List<Help>> GetHelpEntriesFromDatabase()
        {
            var helpEntries = new List<Help>();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                var query = "SELECT HelpId, Question, Answer, ImageUrl FROM [TestScriptTrackerDb].[dbo].[Help]";
                using (var command = new SqlCommand(query, connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var helpEntry = new Help
                            {
                                HelpId = reader.GetInt32(0),
                                Question = reader.GetString(1),
                                Answer = reader.GetString(2),
                                ImageUrl = reader.IsDBNull(3) ? null : reader.GetString(3)
                            };

                            helpEntries.Add(helpEntry);
                        }
                    }
                }
            }

            return helpEntries;
        }

        public byte[] CreateHelpPdf(List<Help> helpEntries)
        {
            var document = QuestPDF.Fluent.Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(12).FontColor(Colors.Black));

                    page.Header().Row(row =>
                    {
                       // row.RelativeItem().Image("path/to/logo.png", ImageScaling.FitWidth);
                        row.RelativeItem().Column(column =>
                        {
                            column.Item().Text("EPI-USE AFRICA").SemiBold().FontSize(20);
                            column.Item().Text("Help Document").FontSize(16);
                        });
                    });

                    //page.Content().PaddingTop(1, Unit.Centimetre).Column(column =>
                    //{
                    //    column.Item().LineHorizontal(1).LineColor(Colors.Black);

                    //    foreach (var entry in helpEntries)
                    //    {
                    //        if (!string.IsNullOrEmpty(entry.ImageUrl))
                    //        {
                    //            column.Item().AlignCenter().Element(container =>
                    //            {
                    //                container.Image(entry.ImageUrl, ImageScaling.FitWidth);
                    //            });
                    //        }

                    //        column.Item().PaddingBottom(5).AlignCenter().Element(container =>
                    //        {
                    //            container.Text(entry.Question).Bold();
                    //        });

                    //        column.Item().PaddingBottom(10).AlignCenter().Element(container =>
                    //        {
                    //            container.Text(entry.Answer);
                    //        });
                    //    }
                    //});
                    page.Content()
                   .Column(column =>
                   {
                       foreach (var entry in helpEntries)
                       {
                           if (!string.IsNullOrEmpty(entry.ImageUrl))
                           {
                               column.Item().Image(entry.ImageUrl);
                           }

                           column.Item().Text(entry.Question).Bold();
                           column.Item().Text(entry.Answer);
                       }
                   });

                    page.Footer().AlignCenter().Text(text =>
                    {
                        text.Span("Generated from the Test Script Tracker").FontSize(10).FontColor(Colors.Black);
                        text.Span(" - Page ");
                        text.CurrentPageNumber();
                        text.Span(" of ");
                        text.TotalPages();
                    });
                });
            });

            using (var memoryStream = new MemoryStream())
            {
                document.GeneratePdf(memoryStream);
                return memoryStream.ToArray();
            }
        }



    }
}
