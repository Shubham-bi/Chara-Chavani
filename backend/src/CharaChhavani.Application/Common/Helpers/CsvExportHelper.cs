using System.Reflection;
using System.Text;

namespace CharaChhavani.Application.Common.Helpers;

public static class CsvExportHelper
{
    private const string Utf8Bom = "\uFEFF";

    public static byte[] GenerateCsvBytes<T>(IEnumerable<T> data)
    {
        var csvString = GenerateCsvString(data);
        return Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(csvString)).ToArray();
    }

    public static string GenerateCsvString<T>(IEnumerable<T> data)
    {
        var sb = new StringBuilder();
        sb.Append(Utf8Bom);

        var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

        // Header row
        var header = string.Join(",", properties.Select(p => EscapeCsvValue(p.Name)));
        sb.AppendLine(header);

        // Data rows
        foreach (var item in data)
        {
            var rowValues = properties.Select(p =>
            {
                var val = p.GetValue(item);
                if (val == null) return string.Empty;

                if (val is DateTime dt)
                {
                    return EscapeCsvValue(dt.ToString("yyyy-MM-dd HH:mm:ss"));
                }

                if (val is decimal dec)
                {
                    return dec.ToString("F2");
                }

                if (val is double dbl)
                {
                    return dbl.ToString("F4");
                }

                return EscapeCsvValue(val.ToString() ?? string.Empty);
            });

            sb.AppendLine(string.Join(",", rowValues));
        }

        return sb.ToString();
    }

    private static string EscapeCsvValue(string value)
    {
        if (string.IsNullOrEmpty(value))
            return "\"\"";

        if (value.Contains(',') || value.Contains('"') || value.Contains('\n') || value.Contains('\r'))
        {
            return $"\"{value.Replace("\"", "\"\"")}\"";
        }

        return $"\"{value}\"";
    }
}
